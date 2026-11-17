import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createSubmissionId } from "@/lib/submission-id";
import type { LeadStore } from "@/lib/lead-store";
import type { QuoteFormValues } from "@/lib/quote-schema";

const mocks = vi.hoisted(() => ({
  after: vi.fn<(callback: () => Promise<void>) => void>(), rateLimit: vi.fn(), processLead: vi.fn(),
  headers: vi.fn(), outageRateLimit: vi.fn(), sendLeadEmail: vi.fn(),
}));
vi.mock("next/server", () => ({ after: mocks.after }));
vi.mock("next/headers", () => ({ headers: mocks.headers }));
vi.mock("@/lib/rate-limit", async (importOriginal) => ({
  getClientIp: (await importOriginal<typeof import("@/lib/rate-limit")>()).getClientIp,
  leadRateLimit: mocks.rateLimit,
  outageRateLimit: mocks.outageRateLimit,
}));
vi.mock("@/lib/lead-processor", async (importOriginal) => ({
  ...await importOriginal<typeof import("@/lib/lead-processor")>(), processLead: mocks.processLead,
  sendLeadEmail: mocks.sendLeadEmail,
}));

const quote: QuoteFormValues = {
  name: "Jane Doe", phone: "0412345678", make: "Toyota", model: "Hilux", year: 2015,
  condition: "running", suburb: "Brisbane", honeypot: "",
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
  mocks.headers.mockReset().mockResolvedValue(new Headers({ "x-forwarded-for": "203.0.113.7, 10.0.0.1" }));
  mocks.processLead.mockReset().mockResolvedValue(undefined);
  mocks.outageRateLimit.mockReset().mockReturnValue({ success: true, mode: "outage" });
  mocks.sendLeadEmail.mockReset().mockResolvedValue({ accepted: false, failure: "request_failed" });
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
    expect(await delivery.deliverLead("quote", { ...quote, model: "Corolla" }, id)).toEqual({
      success: false, message: expect.stringMatching(/different details/), restart: true,
    });
    expect(await store.read("quote", id)).toMatchObject({ version: 1, payload: quote });
    expect(mocks.after).toHaveBeenCalledTimes(scheduled);
  });

  it.each([undefined, "", "not-an-id", "550e8400-e29b-41d4-a716-446655440000"])(
    "rejects missing or invalid IDs before admission: %j", async (id) => {
      expect(await delivery.deliverLead("quote", quote, id)).toMatchObject({ success: false, restart: true });
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
    expect(await delivery.deliverLead("quote", quote, old)).toEqual({ success: false, message: expect.stringMatching(/call Caraway/), restart: true });
    expect(await delivery.deliverLead("quote", quote, saved)).toEqual({ success: true });
    vi.setSystemTime(Date.now() + storage.LEAD_RETENTION_MS);
    expect(await delivery.deliverLead("quote", quote, saved)).toEqual({ success: false, message: expect.stringMatching(/call Caraway/), restart: true });
    expect(await store.read("quote", saved)).toBeNull();
  });

  it.each(["rejected", "unavailable"])("does not capture when admission is %s", async (mode) => {
    mocks.rateLimit.mockResolvedValue({ success: false, mode });
    expect(await delivery.deliverLead("quote", quote, createSubmissionId())).toMatchObject({ success: false });
    expect(await store.health()).toEqual({ pending: 0, attention: 0 });
    expect(mocks.after).not.toHaveBeenCalled();
  });

  it("checks the sender's own allowance before spending the shared one", async () => {
    expect(await delivery.deliverLead("quote", quote, createSubmissionId())).toEqual({ success: true });
    expect(mocks.rateLimit.mock.calls).toEqual([
      ["forms", "lead:203.0.113.7"],
      ["forms-global", "global"],
    ]);
    mocks.rateLimit.mockClear();
    mocks.headers.mockResolvedValue(new Headers({ "x-forwarded-for": "198.51.100.20" }));
    await delivery.deliverLead("quote", quote, createSubmissionId());
    expect(mocks.rateLimit.mock.calls[0]).toEqual(["forms", "lead:198.51.100.20"]);
  });

  it("refuses a sender over their own allowance even when the request carries a prefetch header", async () => {
    mocks.headers.mockResolvedValue(new Headers({
      "x-forwarded-for": "203.0.113.7", purpose: "prefetch", "next-router-prefetch": "1",
    }));
    mocks.rateLimit.mockImplementation(async (scope: string) =>
      scope === "forms" ? { success: false, mode: "distributed" } : { success: true });
    const id = createSubmissionId();
    expect(await delivery.deliverLead("quote", quote, id)).toEqual({
      success: false, message: expect.stringMatching(/^Too many requests/),
    });
    expect(mocks.rateLimit.mock.calls).toEqual([["forms", "lead:203.0.113.7"]]);
    expect(await store.read("quote", id)).toBeNull();
    expect(mocks.after).not.toHaveBeenCalled();
  });

  it("refuses without capture when no counter store is configured or the request has no headers", async () => {
    mocks.rateLimit.mockImplementation(async (scope: string) =>
      scope === "forms" ? { success: false, mode: "unavailable" } : { success: true });
    expect(await delivery.deliverLead("quote", quote, createSubmissionId())).toEqual({
      success: false, message: expect.stringMatching(/couldn't save/),
    });
    expect(mocks.rateLimit).toHaveBeenCalledTimes(1);
    mocks.rateLimit.mockReset().mockResolvedValue({ success: true });
    mocks.headers.mockRejectedValue(new Error("headers was called outside a request scope"));
    expect(await delivery.deliverLead("quote", quote, createSubmissionId())).toMatchObject({ success: false });
    expect(mocks.rateLimit).not.toHaveBeenCalled();
    expect(await store.health()).toEqual({ pending: 0, attention: 0 });
    expect(mocks.after).not.toHaveBeenCalled();
    expect(mocks.sendLeadEmail).not.toHaveBeenCalled();
  });

  it("does not report success after a failed storage write or disclose its error", async () => {
    const id = createSubmissionId();
    const create = vi.spyOn(store, "create").mockRejectedValue(new Error("redis-secret-and-personal-data"));
    expect(await delivery.deliverLead("quote", quote, id)).toEqual({ success: false, message: expect.stringMatching(/couldn't save/) });
    expect(create).toHaveBeenCalledTimes(2);
    expect(await store.read("quote", id)).toBeNull();
    expect(mocks.after).not.toHaveBeenCalled();
    const logged = JSON.stringify(vi.mocked(console.error).mock.calls);
    expect(logged).not.toContain("redis-secret-and-personal-data");
    expect(logged).toContain(`quote/${id} storage_unavailable email_not_confirmed request_failed`);
  });

  it("repeats a dropped storage request once and still saves the enquiry", async () => {
    const id = createSubmissionId();
    const read = store.read.bind(store);
    const create = store.create.bind(store);
    vi.spyOn(store, "read").mockRejectedValueOnce(new Error("dropped")).mockImplementation(read);
    // The first write lands but its answer is lost, so the repeat finds it there.
    vi.spyOn(store, "create").mockImplementationOnce(async (record) => { await create(record); throw new Error("dropped"); })
      .mockImplementation(create);
    expect(await delivery.deliverLead("quote", quote, id)).toEqual({ success: true });
    expect(await read("quote", id)).toMatchObject({ id, version: 1, payload: quote });
    expect(mocks.after).toHaveBeenCalledTimes(1);
    expect(mocks.sendLeadEmail).not.toHaveBeenCalled();
  });

  it("emails the enquiry directly when storage keeps failing, and succeeds only if the provider accepts", async () => {
    const id = createSubmissionId();
    const read = vi.spyOn(store, "read").mockRejectedValue(new Error("redis-secret-and-personal-data"));
    mocks.sendLeadEmail.mockResolvedValueOnce({ accepted: true, providerId: "provider-1" });
    expect(await delivery.deliverLead("quote", quote, id)).toEqual({ success: true });
    expect(read).toHaveBeenCalledTimes(2);
    expect(mocks.sendLeadEmail).toHaveBeenCalledExactlyOnceWith("quote", id, quote, { possibleSpam: false });
    expect(mocks.after).not.toHaveBeenCalled();
    const logged = JSON.stringify(vi.mocked(console.error).mock.calls);
    expect(logged).toContain(`quote/${id} storage_unavailable emailed_without_saving`);
    expect(logged).not.toMatch(/redis-secret|Jane Doe|0412345678/);

    mocks.sendLeadEmail.mockResolvedValueOnce({ accepted: false, failure: "rate_limit_exceeded_429" });
    expect(await delivery.deliverLead("quote", quote, id)).toEqual({ success: false, message: expect.stringMatching(/couldn't save/) });
    expect(JSON.stringify(vi.mocked(console.error).mock.calls)).toContain("email_not_confirmed rate_limit_exceeded_429");
  });

  it.each([
    ["the sender's own counter", { forms: "outage", "forms-global": "distributed" }, 1],
    ["only the shared counter", { forms: "distributed", "forms-global": "outage" }, 2],
  ] as const)("skips storage and emails directly when %s is counted locally", async (_label, modes, sharedCalls) => {
    mocks.rateLimit.mockImplementation(async (scope: "forms" | "forms-global") => ({ success: true, mode: modes[scope] }));
    const read = vi.spyOn(store, "read");
    mocks.sendLeadEmail.mockResolvedValue({ accepted: true, providerId: "provider-1" });
    const id = createSubmissionId();
    expect(await delivery.deliverLead("quote", quote, id)).toEqual({ success: true });
    // The shared counters are not asked a second time once they have failed.
    expect(mocks.rateLimit).toHaveBeenCalledTimes(sharedCalls);
    expect(mocks.outageRateLimit.mock.calls).toEqual(sharedCalls === 1 ? [["forms-global", "global"]] : []);
    expect(read).not.toHaveBeenCalled();
    expect(mocks.sendLeadEmail).toHaveBeenCalledExactlyOnceWith("quote", id, quote, { possibleSpam: false });
    expect(mocks.after).not.toHaveBeenCalled();
  });

  it("still refuses during an outage once the local allowances are used up", async () => {
    mocks.rateLimit.mockResolvedValue({ success: false, mode: "outage" });
    expect(await delivery.deliverLead("quote", quote, createSubmissionId())).toEqual({
      success: false, message: expect.stringMatching(/^Too many requests/),
    });
    mocks.rateLimit.mockResolvedValue({ success: true, mode: "outage" });
    mocks.outageRateLimit.mockReturnValue({ success: false, mode: "outage" });
    expect(await delivery.deliverLead("quote", quote, createSubmissionId())).toEqual({
      success: false, message: expect.stringMatching(/couldn't save/),
    });
    expect(mocks.sendLeadEmail).not.toHaveBeenCalled();
  });

  it("asks for a new ID instead of emailing an expired one that storage cannot vouch for", async () => {
    const id = createSubmissionId();
    vi.setSystemTime(Date.now() + storage.MAX_NEW_SUBMISSION_AGE_MS + 1);
    mocks.rateLimit.mockResolvedValue({ success: true, mode: "outage" });
    expect(await delivery.deliverLead("quote", quote, id)).toMatchObject({ success: false, restart: true });
    expect(mocks.sendLeadEmail).not.toHaveBeenCalled();
  });

  it("keeps the possible-spam label on the saved enquiry and on a direct email", async () => {
    const plain = createSubmissionId();
    const flagged = createSubmissionId();
    await delivery.deliverLead("quote", quote, plain);
    await delivery.deliverLead("quote", quote, flagged, { possibleSpam: true });
    expect(await store.read("quote", plain)).not.toHaveProperty("possibleSpam");
    expect(await store.read("quote", flagged)).toMatchObject({ possibleSpam: true, payload: quote });

    mocks.rateLimit.mockResolvedValue({ success: true, mode: "outage" });
    const direct = createSubmissionId();
    await delivery.deliverLead("quote", quote, direct, { possibleSpam: true });
    expect(mocks.sendLeadEmail).toHaveBeenCalledExactlyOnceWith("quote", direct, quote, { possibleSpam: true });
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

describe("spam trap and validation", () => {
  it("accepts ordinary valid details without a label or a log line", async () => {
    const { quoteFormSchema } = await import("@/lib/quote-schema");
    expect(delivery.parseLead("quote", quoteFormSchema, { ...quote, phone: "0412 345 678" })).toEqual({
      valid: true, payload: quote, possibleSpam: false,
    });
    expect(console.warn).not.toHaveBeenCalled();
  });

  it("labels a filled trap with valid details as possible spam and drops the trap's contents", async () => {
    const { quoteFormSchema } = await import("@/lib/quote-schema");
    expect(delivery.parseLead("quote", quoteFormSchema, { ...quote, honeypot: " https://autofilled.example " })).toEqual({
      valid: true, payload: quote, possibleSpam: true,
    });
    expect(console.warn).toHaveBeenCalledExactlyOnceWith("[honeypot] quote trap filled, details valid: delivering as possible spam");
  });

  it("refuses a filled trap with invalid details, and never reports a false success", async () => {
    const { contactFormSchema } = await import("@/lib/quote-schema");
    const contact = { name: "Bot", email: "not-an-email", message: "Buy cheap things here today.", honeypot: "spam" };
    expect(delivery.parseLead("contact", contactFormSchema, contact)).toEqual({ valid: false });
    expect(console.warn).toHaveBeenCalledExactlyOnceWith("[honeypot] contact trap filled, details invalid: refused");
    expect(await delivery.submitLead("contact", contactFormSchema, contact, createSubmissionId())).toEqual({
      success: false, message: "Invalid form data",
    });
    expect(mocks.rateLimit).not.toHaveBeenCalled();
  });

  it.each([null, undefined, "text", 42, []])("refuses a submission that is not a form object: %j", async (data) => {
    const { quoteFormSchema } = await import("@/lib/quote-schema");
    expect(delivery.parseLead("quote", quoteFormSchema, data)).toEqual({ valid: false });
  });

  it("recognises the trap among other validation issues", () => {
    expect(delivery.isHoneypotHit({ issues: [{ path: ["name"] }, { path: ["honeypot"] }] })).toBe(true);
    expect(delivery.isHoneypotHit({ issues: [{ path: ["name"] }] })).toBe(false);
  });
});
