import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createSubmissionId } from "@/lib/submission-id";
import type { LeadRecord, LeadStore } from "@/lib/lead-store";

// Real senders and the installed provider SDK, with only the network replaced.
const ENDPOINT = "https://hooks.example.com/private-path-9f3a";
const quote = {
  name: "Jane Doe", phone: "0412345678", make: "Toyota", model: "Hilux", year: 2015,
  condition: "running" as const, suburb: "Brisbane", honeypot: "",
};
let processor: typeof import("@/lib/lead-processor");
let storage: typeof import("@/lib/lead-store");
let store: LeadStore;
let fetchMock: ReturnType<typeof vi.fn<typeof fetch>>;

beforeEach(async () => {
  vi.resetModules();
  vi.stubEnv("NODE_ENV", "test");
  for (const key of ["KV_REST_API_URL", "KV_REST_API_TOKEN", "UPSTASH_REDIS_REST_URL", "UPSTASH_REDIS_REST_TOKEN", "ALLOWED_ENDPOINT_HOSTS", "RESEND_BASE_URL"]) vi.stubEnv(key, "");
  vi.stubEnv("RESEND_API_KEY", "re_test_key");
  vi.stubEnv("QUOTE_ENDPOINT", ENDPOINT);
  vi.stubEnv("QUOTE_NOTIFICATION_FROM", "Caraway <leads@example.com>");
  vi.stubEnv("QUOTE_NOTIFICATION_TO", "inbox@example.com");
  fetchMock = vi.fn<typeof fetch>();
  vi.stubGlobal("fetch", fetchMock);
  vi.spyOn(console, "error").mockImplementation(() => {});
  storage = await import("@/lib/lead-store");
  store = storage.getLeadStore();
  processor = await import("@/lib/lead-processor");
});
afterEach(() => {
  vi.restoreAllMocks(); vi.unstubAllEnvs(); vi.unstubAllGlobals();
});

async function capture() {
  const id = createSubmissionId();
  const channel = (name: "email" | "webhook") => ({
    state: "pending" as const, configurationHash: processor.channelConfigurationHash("quote", name),
    attempts: 0, nextAttemptAt: Date.now(),
  });
  const record: LeadRecord = {
    id, kind: "quote", payload: quote, fingerprint: storage.fingerprint({ kind: "quote", payload: quote }),
    version: 1, createdAt: Date.now(), expiresAt: Date.now() + storage.LEAD_RETENTION_MS,
    channels: { webhook: channel("webhook"), email: channel("email") },
  };
  expect(await store.create(record)).toBe(true);
  return id;
}

/** Answers the email API and the webhook separately. */
function respond(handlers: { email: () => Promise<Response>; webhook: () => Promise<Response> }) {
  fetchMock.mockImplementation((input) =>
    String(input).startsWith("https://api.resend.com/") ? handlers.email() : handlers.webhook(),
  );
}
const logged = (): string[] =>
  vi.mocked(console.error).mock.calls.map((call: unknown[]) => call.join(" "));

describe("delivery failure diagnostics", () => {
  it("records and logs the provider's error name and status for a rejected email, and the HTTP status for a failed webhook", async () => {
    const id = await capture();
    respond({
      email: async () => new Response(JSON.stringify({
        statusCode: 422, name: "validation_error",
        message: "The inbox@example.com address for Jane Doe 0412345678 is not allowed.",
      }), { status: 422, headers: { "content-type": "application/json" } }),
      webhook: async () => new Response("upstream said no to Jane Doe", { status: 502 }),
    });

    await processor.processLead("quote", id, store);

    const record = (await store.read("quote", id))!;
    expect(record.channels.email).toMatchObject({ state: "retry", reason: "provider_not_confirmed:validation_error_422" });
    expect(record.channels.webhook).toMatchObject({ state: "manual", reason: "provider_not_confirmed:http_502" });
    expect(logged()).toEqual(expect.arrayContaining([
      `[lead-delivery] quote/${id}/email provider_not_confirmed validation_error_422 attempt=1`,
      `[lead-delivery] quote/${id}/webhook provider_not_confirmed http_502 attempt=1`,
      "[submit-form] quote delivery failed after a delivery attempt (http_502)",
    ]));
  });

  it("never logs or stores customer details, addresses, the endpoint or provider message text", async () => {
    const id = await capture();
    respond({
      email: async () => new Response(JSON.stringify({
        statusCode: 403, name: "invalid_from_address",
        message: "leads@example.com cannot send to inbox@example.com for Jane Doe 0412345678",
      }), { status: 403, headers: { "content-type": "application/json" } }),
      webhook: async () => { throw new TypeError(`fetch failed for ${ENDPOINT} with body ${JSON.stringify(quote)}`); },
    });

    await processor.processLead("quote", id, store);

    const record = (await store.read("quote", id))!;
    const exposed = `${logged().join("\n")}\n${record.channels.email.reason}\n${record.channels.webhook.reason}`;
    expect(exposed).toContain("invalid_from_address_403");
    expect(exposed).toContain("request_failed");
    for (const secret of ["Jane", "0412345678", "example.com", "private-path", "re_test_key", "cannot send"]) {
      expect(exposed).not.toContain(secret);
    }
  });

  it.each([
    ["a provider that cannot be reached", async () => { throw new TypeError("fetch failed"); }, "application_error"],
    ["an accepted response with no delivery ID", async () => new Response(JSON.stringify({})), "no_delivery_id"],
  ] as const)("names %s", async (_label, email, code) => {
    const id = await capture();
    respond({ email, webhook: async () => new Response("ok") });

    await processor.processLead("quote", id, store);

    const record = (await store.read("quote", id))!;
    expect(record.channels.webhook.state).toBe("accepted");
    expect(record.channels.email).toMatchObject({ state: "retry", reason: `provider_not_confirmed:${code}` });
  });

  it("names a webhook that times out and clears the reason once email is accepted", async () => {
    const id = await capture();
    respond({
      email: async () => new Response(JSON.stringify({ id: "provider-123" })),
      webhook: async () => { throw new DOMException("The operation timed out.", "TimeoutError"); },
    });

    await processor.processLead("quote", id, store);

    const record = (await store.read("quote", id))!;
    expect(record.channels.webhook).toMatchObject({ state: "manual", reason: "provider_not_confirmed:timeout" });
    expect(record.channels.email.state).toBe("accepted");
    expect(record.channels.email.reason).toBeUndefined();
    expect(logged().some((line) => line.includes("/email "))).toBe(false);
  });
});
