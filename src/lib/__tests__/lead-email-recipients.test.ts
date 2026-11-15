import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ send: vi.fn() }));
vi.mock("resend", () => ({
  Resend: class {
    emails = { send: mocks.send };
  },
}));

import { sendContactNotificationEmail } from "@/lib/contact-email";
import { sendQuoteNotificationEmail } from "@/lib/quote-email";

const quote = {
  name: "Jane Doe", phone: "0412345678", make: "Toyota", model: "Hilux", year: 2015,
  condition: "running" as const, suburb: "Brisbane", honeypot: "",
};
const contact = {
  name: "Jane Doe", email: "jane@example.com", phone: "0412345678",
  message: "Please contact me about my vehicle.", honeypot: "", marketingConsent: false,
};

beforeEach(() => {
  vi.stubEnv("RESEND_API_KEY", "re_test_key");
  for (const prefix of ["QUOTE", "CONTACT"]) {
    vi.stubEnv(`${prefix}_NOTIFICATION_FROM`, "Caraway <leads@example.com>");
    vi.stubEnv(`${prefix}_NOTIFICATION_TO`, "inbox@example.com");
  }
  mocks.send.mockReset().mockResolvedValue({ data: { id: "provider-123" }, error: null });
});
afterEach(() => vi.unstubAllEnvs());

describe("lead notification recipients", () => {
  it("sends a single recipient as the plain string the provider has always received", async () => {
    expect(await sendQuoteNotificationEmail(quote, { idempotencyKey: "key" })).toEqual({ sent: true, providerId: "provider-123" });
    expect(mocks.send.mock.calls[0][0]).toMatchObject({ from: "Caraway <leads@example.com>", to: "inbox@example.com" });
    expect(mocks.send.mock.calls[0][1]).toMatchObject({ idempotencyKey: "key" });
  });

  it("sends one quote notification addressed to every configured recipient", async () => {
    vi.stubEnv("QUOTE_NOTIFICATION_TO", "inbox@example.com, backup@example.org");
    expect(await sendQuoteNotificationEmail(quote)).toEqual({ sent: true, providerId: "provider-123" });
    expect(mocks.send).toHaveBeenCalledTimes(1);
    expect(mocks.send.mock.calls[0][0].to).toEqual(["inbox@example.com", "backup@example.org"]);
  });

  it("sends one contact notification addressed to every configured recipient", async () => {
    vi.stubEnv("CONTACT_NOTIFICATION_TO", "inbox@example.com,backup@example.org");
    expect(await sendContactNotificationEmail(contact)).toEqual({ sent: true, providerId: "provider-123" });
    expect(mocks.send).toHaveBeenCalledTimes(1);
    expect(mocks.send.mock.calls[0][0].to).toEqual(["inbox@example.com", "backup@example.org"]);
  });

  it("refuses to send when the recipient list is malformed", async () => {
    vi.stubEnv("QUOTE_NOTIFICATION_TO", "inbox@example.com, not-an-address");
    await expect(sendQuoteNotificationEmail(quote)).rejects.toThrow("configuration is invalid");
    expect(mocks.send).not.toHaveBeenCalled();
  });
});
