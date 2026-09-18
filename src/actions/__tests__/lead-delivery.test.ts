import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createSubmissionId } from "@/lib/submission-id";
import type { LeadStore } from "@/lib/lead-store";
import type { QuoteFormValues } from "@/lib/quote-schema";

const mocks = vi.hoisted(() => ({
  after: vi.fn<(callback: () => Promise<void>) => void>(), rateLimit: vi.fn(), processLead: vi.fn(),
}));
vi.mock("next/server", () => ({ after: mocks.after }));
vi.mock("@/lib/rate-limit", () => ({ rateLimit: mocks.rateLimit }));
vi.mock("@/lib/lead-processor", async (importOriginal) => ({
  ...await importOriginal<typeof import("@/lib/lead-processor")>(), processLead: mocks.processLead,
}));

const quote: QuoteFormValues = {
  name: "Jane Doe", phone: "0412345678", make: "Toyota", model: "Hilux", year: 2015,
  condition: "running", address: "12 Example St, Brisbane", honeypot: "",
};
let delivery: typeof import("@/actions/lead-delivery");
let storage: typeof import("@/lib/lead-store");
let store: LeadStore;

beforeEach(async () => {
  vi.resetModules();
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-09-05T00:00:00Z"));
  vi.stubEnv("NODE_ENV", "test");
  for (const key of [
    "KV_REST_API_URL", "KV_REST_API_TOKEN", "UPSTASH_REDIS_REST_URL", "UPSTASH_REDIS_REST_TOKEN",
    "ALLOWED_ENDPOINT_HOSTS", "CONTACT_ENDPOINT", "CONTACT_NOTIFICATION_FROM", "CONTACT_NOTIFICATION_TO",
  ]) vi.stubEnv(key, "");
  vi.stubEnv("QUOTE_ENDPOINT", "https://hooks.example.com/quote");
  vi.stubEnv("RESEND_API_KEY", "re_test_key");
  vi.stubEnv("QUOTE_NOTIFICATION_FROM", "Caraway <leads@example.com>");
  vi.stubEnv("QUOTE_NOTIFICATION_TO", "inbox@example.com");
  vi.stubGlobal("fetch", vi.fn(() => { throw new Error("Unexpected network request"); }));
  vi.spyOn(console, "error").mockImplementation(() => {});
  vi.spyOn(console, "warn").mockImplementation(() => {});
  mocks.after.mockReset();
  mocks.rateLimit.mockReset().mockResolvedValue({ success: true });
  mocks.processLead.mockReset().mockResolvedValue(undefined);
  storage = await import("@/lib/lead-store");
  store = storage.getLeadStore();
  delivery = await import("@/actions/lead-delivery");
});
afterEach(() => {
  vi.restoreAllMocks(); vi.unstubAllEnvs(); vi.unstubAllGlobals(); vi.useRealTimers();
});

describe("durable lead capture", () => {
  it("waits for storage acknowledgement before success and schedules provider delivery afterward", async () => {
    const id = createSubmissionId();
    const create = store.create.bind(store);
    let acknowledge!: (accepted: boolean) => void;
    vi.spyOn(store, "create").mockImplementation(async (record) => {
      await create(record);
      return new Promise<boolean>((resolve) => { acknowledge = resolve; });
    });
    const result = delivery.deliverLead("quote", quote, id);
    let settled = false;
    void result.then(() => { settled = true; });
    await vi.waitFor(() => expect(acknowledge).toBeTypeOf("function"));
    expect(settled).toBe(false);
    expect(mocks.after).not.toHaveBeenCalled();
    acknowledge(true);
    await expect(result).resolves.toEqual({ success: true });
    expect(await store.read("quote", id)).toMatchObject({
      id, kind: "quote", payload: quote,
      channels: { webhook: { state: "pending", attempts: 0 }, email: { state: "pending", attempts: 0 } },
    });
    expect(mocks.processLead).not.toHaveBeenCalled();
    expect(mocks.after).toHaveBeenCalledTimes(1);
    await mocks.after.mock.calls[0][0]();
    expect(mocks.processLead).toHaveBeenCalledWith("quote", id, store);
  });

  it("deduplicates concurrent retries and rejects changed details without overwriting", async () => {
    const id = createSubmissionId();
    const results = await Promise.all(Array.from({ length: 6 }, () => delivery.deliverLead("quote", quote, id)));
    expect(results).toEqual(Array.from({ length: 6 }, () => ({ success: true })));
    expect(await store.health()).toEqual({ pending: 1, attention: 0 });
    const scheduled = mocks.after.mock.calls.length;
    expect(await delivery.deliverLead("quote", { ...quote, model: "Corolla" }, id)).toMatchObject({
      success: false, message: expect.stringMatching(/different details/),
    });
    expect(await store.read("quote", id)).toMatchObject({ version: 1, payload: quote });
    expect(mocks.after).toHaveBeenCalledTimes(scheduled);
  });

  it.each([undefined, "", "not-an-id", "550e8400-e29b-41d4-a716-446655440000"])(
    "rejects missing or invalid IDs before admission: %j", async (id) => {
      expect(await delivery.deliverLead("quote", quote, id)).toMatchObject({ success: false });
      expect(mocks.rateLimit).not.toHaveBeenCalled();
      expect(await store.health()).toEqual({ pending: 0, attention: 0 });
      expect(mocks.after).not.toHaveBeenCalled();
    },
  );

  it("rejects identifiers issued too far in the future", async () => {
    const now = Date.now();
    vi.setSystemTime(now + 6 * 60_000);
    const id = createSubmissionId();
    vi.setSystemTime(now);
    expect(await delivery.deliverLead("quote", quote, id)).toMatchObject({ success: false });
    expect(mocks.rateLimit).not.toHaveBeenCalled();
  });

  it("allows an existing old capture but rejects new expired IDs and prevents recreation after retention", async () => {
    const old = createSubmissionId();
    const saved = createSubmissionId();
    await delivery.deliverLead("quote", quote, saved);
    vi.setSystemTime(Date.now() + storage.MAX_NEW_SUBMISSION_AGE_MS + 1);
    expect(await delivery.deliverLead("quote", quote, old)).toMatchObject({ success: false, message: expect.stringMatching(/call Caraway/) });
    expect(await delivery.deliverLead("quote", quote, saved)).toEqual({ success: true });
    vi.setSystemTime(Date.now() + storage.LEAD_RETENTION_MS);
    expect(await delivery.deliverLead("quote", quote, saved)).toMatchObject({ success: false, message: expect.stringMatching(/call Caraway/) });
    expect(await store.read("quote", saved)).toBeNull();
  });

  it.each(["rejected", "unavailable"])("does not capture when admission is %s", async (mode) => {
    mocks.rateLimit.mockResolvedValue({ success: false, mode });
    expect(await delivery.deliverLead("quote", quote, createSubmissionId())).toMatchObject({ success: false });
    expect(await store.health()).toEqual({ pending: 0, attention: 0 });
    expect(mocks.after).not.toHaveBeenCalled();
  });

  it("does not report success after a failed storage write or disclose its error", async () => {
    const id = createSubmissionId();
    vi.spyOn(store, "create").mockRejectedValue(new Error("redis-secret-and-personal-data"));
    expect(await delivery.deliverLead("quote", quote, id)).toMatchObject({ success: false, message: expect.stringMatching(/couldn't save/) });
    expect(await store.read("quote", id)).toBeNull();
    expect(mocks.after).not.toHaveBeenCalled();
    expect(JSON.stringify(vi.mocked(console.error).mock.calls)).not.toContain("redis-secret-and-personal-data");
  });

  it("captures through healthy email configuration when the webhook is malformed", async () => {
    vi.stubEnv("QUOTE_ENDPOINT", "not-a-url");
    const id = createSubmissionId();
    expect(await delivery.deliverLead("quote", quote, id)).toEqual({ success: true });
    expect((await store.read("quote", id))?.channels).toMatchObject({ webhook: { state: "disabled" }, email: { state: "pending" } });
  });

  it("does not capture when no delivery channel is ready", async () => {
    vi.stubEnv("QUOTE_ENDPOINT", "not-a-url");
    vi.stubEnv("QUOTE_NOTIFICATION_TO", "not-an-email");
    expect(await delivery.deliverLead("quote", quote, createSubmissionId())).toMatchObject({ success: false });
    expect(await store.health()).toEqual({ pending: 0, attention: 0 });
    expect(mocks.after).not.toHaveBeenCalled();
  });

  it("keeps a saved lead recoverable if the deferred processor fails", async () => {
    const id = createSubmissionId();
    expect(await delivery.deliverLead("quote", quote, id)).toEqual({ success: true });
    mocks.processLead.mockRejectedValue(new Error("worker unavailable"));
    await expect(mocks.after.mock.calls[0][0]()).resolves.toBeUndefined();
    expect(await store.due(12)).toEqual([{ kind: "quote", id }]);
  });
});

describe("invalid lead rejection", () => {
  it("silently discards honeypots and reports ordinary validation failures", () => {
    expect(delivery.rejectInvalidLead("quote", { issues: [{ path: ["honeypot"] }] })).toEqual({ success: true });
    expect(console.warn).toHaveBeenCalledWith("[honeypot] quote spam detected", { ts: expect.any(String) });
    expect(delivery.rejectInvalidLead("contact", { issues: [{ path: ["phone"] }] })).toEqual({ success: false, message: "Invalid form data" });
    expect(delivery.isHoneypotHit({ issues: [{ path: ["name"] }, { path: ["honeypot"] }] })).toBe(true);
    expect(delivery.isHoneypotHit({ issues: [{ path: ["name"] }] })).toBe(false);
  });
});
