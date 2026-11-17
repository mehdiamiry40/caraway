import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createSubmissionId } from "@/lib/submission-id";
import type { LeadStore } from "@/lib/lead-store";
import type { ContactFormInput } from "@/lib/quote-schema";

const mocks = vi.hoisted(() => ({ after: vi.fn(), rateLimit: vi.fn(), headers: vi.fn() }));
vi.mock("next/server", () => ({ after: mocks.after }));
vi.mock("next/headers", () => ({ headers: mocks.headers }));
vi.mock("@/lib/rate-limit", async (importOriginal) => ({
  getClientIp: (await importOriginal<typeof import("@/lib/rate-limit")>()).getClientIp,
  leadRateLimit: mocks.rateLimit,
  outageRateLimit: vi.fn(),
}));
const contact: ContactFormInput = {
  name: "Jane Doe", email: "jane@example.com", phone: "0412345678",
  message: "Please contact me about selling my car.", honeypot: "", marketingConsent: false,
};
let submitContact: typeof import("@/actions/contact").submitContact;
let store: LeadStore;
beforeEach(async () => {
  vi.resetModules(); vi.stubEnv("NODE_ENV", "test");
  for (const key of ["KV_REST_API_URL", "KV_REST_API_TOKEN", "UPSTASH_REDIS_REST_URL", "UPSTASH_REDIS_REST_TOKEN", "ALLOWED_ENDPOINT_HOSTS", "CONTACT_ENDPOINT"]) vi.stubEnv(key, "");
  vi.stubEnv("RESEND_API_KEY", "re_test_key");
  vi.stubEnv("CONTACT_ENDPOINT", "malformed-webhook");
  vi.stubEnv("CONTACT_NOTIFICATION_FROM", "Caraway <leads@example.com>");
  vi.stubEnv("CONTACT_NOTIFICATION_TO", "inbox@example.com");
  vi.stubGlobal("fetch", vi.fn(() => { throw new Error("Unexpected network request"); }));
  vi.spyOn(console, "warn").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
  mocks.after.mockReset(); mocks.rateLimit.mockReset().mockResolvedValue({ success: true });
  mocks.headers.mockReset().mockResolvedValue(new Headers({ "x-forwarded-for": "203.0.113.7" }));
  store = (await import("@/lib/lead-store")).getLeadStore();
  ({ submitContact } = await import("@/actions/contact"));
});
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllEnvs(); vi.unstubAllGlobals(); });

describe("submitContact capture boundary", () => {
  it("saves normalized details and consent before scheduling notification", async () => {
    const id = createSubmissionId();
    expect(await submitContact({ ...contact, email: " jane@example.com ", phone: "0412 345 678", marketingConsent: true }, id)).toEqual({ success: true });
    expect(await store.read("contact", id)).toMatchObject({
      payload: { ...contact, marketingConsent: true },
      channels: { webhook: { state: "disabled" }, email: { state: "pending", attempts: 0 } },
    });
    expect(mocks.after).toHaveBeenCalledTimes(1); expect(fetch).not.toHaveBeenCalled();
  });
  it("requires a submission identifier", async () => {
    expect(await submitContact(contact)).toMatchObject({ success: false, message: expect.stringMatching(/refresh/) });
    expect(mocks.after).not.toHaveBeenCalled(); expect(mocks.rateLimit).not.toHaveBeenCalled();
  });
  it("rejects changed consent under a saved identifier", async () => {
    const id = createSubmissionId();
    expect(await submitContact(contact, id)).toEqual({ success: true });
    expect(await submitContact({ ...contact, marketingConsent: true }, id)).toMatchObject({ success: false, message: expect.stringMatching(/different details/) });
    expect((await store.read("contact", id))?.payload).toEqual(contact);
    expect(mocks.after).toHaveBeenCalledTimes(1);
  });
  it("validates before admission or storage", async () => {
    const id = createSubmissionId();
    expect(await submitContact({ ...contact, email: "not-an-email" }, id)).toEqual({ success: false, message: "Invalid form data" });
    expect(await store.read("contact", id)).toBeNull();
    expect(mocks.after).not.toHaveBeenCalled(); expect(mocks.rateLimit).not.toHaveBeenCalled();
  });
  it("saves a valid message whose hidden trap field was filled, labelled as possible spam", async () => {
    const id = createSubmissionId();
    expect(await submitContact({ ...contact, honeypot: "https://autofilled.example" }, id)).toEqual({ success: true });
    expect(await store.read("contact", id)).toMatchObject({ possibleSpam: true, payload: contact });
    expect(mocks.after).toHaveBeenCalledTimes(1);
    expect(console.warn).toHaveBeenCalled();
  });
  it("refuses an invalid message with a filled trap instead of pretending it worked", async () => {
    const id = createSubmissionId();
    expect(await submitContact({ ...contact, email: "not-an-email", honeypot: "spam" }, id)).toEqual({ success: false, message: "Invalid form data" });
    expect(await store.read("contact", id)).toBeNull();
    expect(mocks.after).not.toHaveBeenCalled(); expect(mocks.rateLimit).not.toHaveBeenCalled();
  });
});
