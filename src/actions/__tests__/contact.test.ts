import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createSubmissionId } from "@/lib/submission-id";
import type { LeadStore } from "@/lib/lead-store";
import type { ContactFormInput } from "@/lib/quote-schema";

const mocks = vi.hoisted(() => ({ after: vi.fn(), rateLimit: vi.fn() }));
vi.mock("next/server", () => ({ after: mocks.after }));
vi.mock("@/lib/rate-limit", () => ({ rateLimit: mocks.rateLimit }));
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
  it("discards honeypot messages before admission or storage", async () => {
    const id = createSubmissionId();
    expect(await submitContact({ ...contact, honeypot: "spam" }, id)).toEqual({ success: true });
    expect(await store.read("contact", id)).toBeNull();
    expect(mocks.after).not.toHaveBeenCalled(); expect(mocks.rateLimit).not.toHaveBeenCalled();
    expect(console.warn).toHaveBeenCalled();
  });
});
