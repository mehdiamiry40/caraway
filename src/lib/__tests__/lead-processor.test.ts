import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createSubmissionId } from "@/lib/submission-id";
import type { LeadKind } from "@/lib/lead-config";
import type { LeadChannel, LeadRecord, LeadStore } from "@/lib/lead-store";

const mocks = vi.hoisted(() => ({ webhook: vi.fn(), quoteEmail: vi.fn(), contactEmail: vi.fn() }));
vi.mock("@/actions/submit-form", () => ({ submitForm: mocks.webhook }));
vi.mock("@/lib/quote-email", () => ({ sendQuoteNotificationEmail: mocks.quoteEmail }));
vi.mock("@/lib/contact-email", () => ({ sendContactNotificationEmail: mocks.contactEmail }));

const quote = {
  name: "Jane Doe", phone: "0412345678", make: "Toyota", model: "Hilux", year: 2015,
  condition: "running" as const, suburb: "Brisbane", honeypot: "",
};
const contact = {
  name: "Jane Doe", email: "jane@example.com", phone: "0412345678",
  message: "Please contact me about my vehicle.", honeypot: "", marketingConsent: false,
};
let processor: typeof import("@/lib/lead-processor");
let storage: typeof import("@/lib/lead-store");
let store: LeadStore;

beforeEach(async () => {
  vi.resetModules(); vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-09-05T00:00:00Z"));
  vi.stubEnv("NODE_ENV", "test");
  vi.stubEnv("VERCEL_ENV", "preview");
  vi.stubEnv("VERCEL_GIT_COMMIT_REF", "delivery-tests");
  for (const key of ["KV_REST_API_URL", "KV_REST_API_TOKEN", "UPSTASH_REDIS_REST_URL", "UPSTASH_REDIS_REST_TOKEN", "ALLOWED_ENDPOINT_HOSTS"]) vi.stubEnv(key, "");
  vi.stubEnv("RESEND_API_KEY", "re_test_key");
  for (const prefix of ["QUOTE", "CONTACT"]) {
    vi.stubEnv(`${prefix}_ENDPOINT`, "https://hooks.example.com/lead");
    vi.stubEnv(`${prefix}_NOTIFICATION_FROM`, "Caraway <leads@example.com>");
    vi.stubEnv(`${prefix}_NOTIFICATION_TO`, "inbox@example.com");
  }
  vi.stubGlobal("fetch", vi.fn(() => { throw new Error("Unexpected network request"); }));
  vi.spyOn(console, "error").mockImplementation(() => {});
  mocks.webhook.mockReset().mockResolvedValue({ success: true });
  mocks.quoteEmail.mockReset().mockResolvedValue({ sent: true, providerId: "quote-provider-123" });
  mocks.contactEmail.mockReset().mockResolvedValue({ sent: true, providerId: "contact-provider-123" });
  storage = await import("@/lib/lead-store");
  store = storage.getLeadStore();
  processor = await import("@/lib/lead-processor");
});
afterEach(() => {
  vi.restoreAllMocks(); vi.unstubAllEnvs(); vi.unstubAllGlobals(); vi.useRealTimers();
});

async function capture(kind: LeadKind = "quote", enabled: LeadChannel[] = ["webhook", "email"]) {
  const id = createSubmissionId();
  const payload = kind === "quote" ? quote : contact;
  const channel = (name: LeadChannel) => ({
    state: enabled.includes(name) ? "pending" as const : "disabled" as const,
    configurationHash: processor.channelConfigurationHash(kind, name), attempts: 0, nextAttemptAt: Date.now(),
  });
  const record: LeadRecord = {
    id, kind, payload, fingerprint: storage.fingerprint({ kind, payload }), version: 1,
    createdAt: Date.now(), expiresAt: Date.now() + storage.LEAD_RETENTION_MS,
    channels: { webhook: channel("webhook"), email: channel("email") },
  };
  expect(await store.create(record)).toBe(true);
  return id;
}

describe("lead processor delivery guarantees", () => {
  it("claims each channel once across concurrent workers and preserves provider IDs", async () => {
    const id = await capture();
    await Promise.all(Array.from({ length: 6 }, () => processor.processLead("quote", id, store)));
    expect(mocks.webhook).toHaveBeenCalledTimes(1);
    expect(mocks.quoteEmail).toHaveBeenCalledTimes(1);
    expect((await store.read("quote", id))?.channels).toMatchObject({
      webhook: { state: "accepted", attempts: 1 },
      email: { state: "accepted", attempts: 1, providerId: "quote-provider-123" },
    });
    await processor.processLead("quote", id, store);
    expect(mocks.webhook).toHaveBeenCalledTimes(1); expect(mocks.quoteEmail).toHaveBeenCalledTimes(1);
    expect(await store.health()).toEqual({ pending: 0, attention: 0 });
  });

  it("routes contact payloads to the contact provider with a distinct channel key", async () => {
    const id = await capture("contact");
    await processor.processLead("contact", id, store);
    expect(mocks.contactEmail).toHaveBeenCalledWith(contact, { idempotencyKey: expect.stringContaining(`/contact/${id}/email`) });
    expect(mocks.quoteEmail).not.toHaveBeenCalled();
    expect(mocks.webhook).toHaveBeenCalledWith(expect.objectContaining({
      data: contact, endpointEnvVar: "CONTACT_ENDPOINT", idempotencyKey: expect.stringContaining(`/contact/${id}/webhook`),
    }));
    expect((await store.read("contact", id))?.channels.email.providerId).toBe("contact-provider-123");
  });

  it("retries failed email with the same key after backoff while never replaying an unknown webhook", async () => {
    const id = await capture();
    mocks.webhook.mockResolvedValue({ success: false, ambiguous: true, message: "response lost" });
    mocks.quoteEmail.mockRejectedValueOnce(new Error("acceptance unknown"));
    await processor.processLead("quote", id, store);
    let record = (await store.read("quote", id))!;
    expect(record.channels).toMatchObject({ webhook: { state: "manual", attempts: 1 }, email: { state: "retry", attempts: 1 } });
    await processor.processLead("quote", id, store);
    expect(mocks.quoteEmail).toHaveBeenCalledTimes(1);
    vi.setSystemTime(record.channels.email.nextAttemptAt);
    await processor.processLead("quote", id, store);
    record = (await store.read("quote", id))!;
    expect(record.channels.email).toMatchObject({ state: "accepted", attempts: 2, providerId: "quote-provider-123" });
    expect(mocks.webhook).toHaveBeenCalledTimes(1);
    expect(mocks.quoteEmail).toHaveBeenCalledTimes(2);
    expect(mocks.quoteEmail.mock.calls[1][1]).toEqual(mocks.quoteEmail.mock.calls[0][1]);
  });

  it("stops failed email after four attempts without changing its provider key", async () => {
    const id = await capture("quote", ["email"]);
    mocks.quoteEmail.mockRejectedValue(new Error("unavailable"));
    for (let attempt = 1; attempt <= 4; attempt++) {
      await processor.processLead("quote", id, store);
      const channel = (await store.read("quote", id))!.channels.email;
      expect(channel.attempts).toBe(attempt);
      expect(channel.state).toBe(attempt === 4 ? "manual" : "retry");
      vi.setSystemTime(channel.nextAttemptAt);
    }
    await processor.processLead("quote", id, store);
    expect(mocks.quoteEmail).toHaveBeenCalledTimes(4);
    expect(new Set(mocks.quoteEmail.mock.calls.map((call) => call[1].idempotencyKey)).size).toBe(1);
    expect(await store.health()).toEqual({ pending: 0, attention: 1 });
  });

  it("moves retries outside the provider safety window to manual reconciliation", async () => {
    const id = await capture("quote", ["email"]);
    mocks.quoteEmail.mockRejectedValueOnce(new Error("unavailable"));
    await processor.processLead("quote", id, store);
    const firstAttemptAt = (await store.read("quote", id))!.channels.email.firstAttemptAt!;
    vi.setSystemTime(firstAttemptAt + storage.EMAIL_RETRY_WINDOW_MS);
    await processor.processLead("quote", id, store);
    expect(mocks.quoteEmail).toHaveBeenCalledTimes(1);
    expect((await store.read("quote", id))?.channels.email.state).toBe("manual");
  });

  it.each(["webhook", "email"] as const)("bounds a stalled %s while saving the other channel's acceptance", async (stalled) => {
    const id = await capture();
    if (stalled === "webhook") mocks.webhook.mockReturnValue(new Promise(() => {}));
    else mocks.quoteEmail.mockReturnValue(new Promise(() => {}));
    const operation = processor.processLead("quote", id, store);
    await vi.advanceTimersByTimeAsync(0);
    const healthy = stalled === "webhook" ? "email" : "webhook";
    expect((await store.read("quote", id))?.channels[healthy].state).toBe("accepted");
    expect((await store.read("quote", id))?.channels[stalled].state).toBe("sending");
    await vi.advanceTimersByTimeAsync(9_000);
    await operation;
    expect((await store.read("quote", id))?.channels[stalled].state).toBe(stalled === "webhook" ? "manual" : "retry");
    expect(vi.getTimerCount()).toBe(0);
  });

  it("does not let late provider completion overwrite a newer retry result", async () => {
    const id = await capture("quote", ["email"]);
    let completeLate!: (value: { sent: boolean; providerId: string }) => void;
    mocks.quoteEmail.mockImplementationOnce(() => new Promise((resolve) => { completeLate = resolve; }));
    const first = processor.processLead("quote", id, store);
    await vi.advanceTimersByTimeAsync(9_000);
    await first;
    vi.setSystemTime((await store.read("quote", id))!.channels.email.nextAttemptAt);
    await processor.processLead("quote", id, store);
    completeLate({ sent: true, providerId: "obsolete-provider-id" });
    await vi.advanceTimersByTimeAsync(0);
    expect((await store.read("quote", id))?.channels.email).toMatchObject({ state: "accepted", providerId: "quote-provider-123", attempts: 2 });
  });

  it.each([
    ["QUOTE_NOTIFICATION_TO", "new-inbox@example.com", "email"],
    ["RESEND_API_KEY", "re_rotated_key", "email"],
    ["QUOTE_ENDPOINT", "https://other.example.com/lead", "webhook"],
  ] as const)("requires reconciliation when %s changes after capture", async (name, value, channel) => {
    const id = await capture();
    vi.stubEnv(name, value);
    await processor.processLead("quote", id, store);
    expect((await store.read("quote", id))?.channels[channel]).toMatchObject({ state: "manual", attempts: 0 });
    if (channel === "email") expect(mocks.quoteEmail).not.toHaveBeenCalled();
    else expect(mocks.webhook).not.toHaveBeenCalled();
  });

  it("keeps a claimed record recoverable when saving the provider outcome fails", async () => {
    const id = await capture("quote", ["email"]);
    const replace = store.replace.bind(store);
    vi.spyOn(store, "replace").mockImplementation((previous, next) => {
      if (next.channels.email.state === "accepted") return Promise.reject(new Error("storage unavailable"));
      return replace(previous, next);
    });
    await expect(processor.processLead("quote", id, store)).rejects.toThrow();
    expect((await store.read("quote", id))?.channels.email.state).toBe("sending");
    vi.mocked(store.replace).mockRestore();
    vi.setSystemTime(Date.now() + storage.DELIVERY_LEASE_MS);
    await processor.processLead("quote", id, store);
    expect(mocks.quoteEmail).toHaveBeenCalledTimes(2);
    expect(mocks.quoteEmail.mock.calls[1][1]).toEqual(mocks.quoteEmail.mock.calls[0][1]);
    expect((await store.read("quote", id))?.channels.email.state).toBe("accepted");
  });

  it("drains a bounded batch and leaves additional saved leads queued", async () => {
    for (let index = 0; index < 15; index++) await capture("quote", ["email"]);
    expect(await processor.processPendingLeads(store)).toEqual({ processed: 12, failures: 0, pending: 3, attention: 0 });
    expect(mocks.quoteEmail).toHaveBeenCalledTimes(12);
    expect(await processor.processPendingLeads(store)).toEqual({ processed: 3, failures: 0, pending: 0, attention: 0 });
  });
});
