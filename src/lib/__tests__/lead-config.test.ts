import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getLeadConfiguration } from "@/lib/lead-config";
import { getEnv } from "@/lib/env";

beforeEach(() => {
  for (const key of [
    "QUOTE_ENDPOINT", "CONTACT_ENDPOINT", "ALLOWED_ENDPOINT_HOSTS",
    "RESEND_API_KEY", "QUOTE_NOTIFICATION_FROM", "QUOTE_NOTIFICATION_TO",
    "CONTACT_NOTIFICATION_FROM", "CONTACT_NOTIFICATION_TO",
  ]) vi.stubEnv(key, "");
});

afterEach(() => vi.unstubAllEnvs());

function configureQuoteEmail() {
  vi.stubEnv("RESEND_API_KEY", "re_test_key");
  vi.stubEnv("QUOTE_NOTIFICATION_FROM", "Caraway <quote@example.com>");
  vi.stubEnv("QUOTE_NOTIFICATION_TO", "inbox@example.com");
}

describe("independent lead delivery configuration", () => {
  it("keeps healthy quote email ready despite a malformed webhook and unrelated configuration", () => {
    configureQuoteEmail();
    vi.stubEnv("QUOTE_ENDPOINT", "malformed-url");
    vi.stubEnv("CONTACT_NOTIFICATION_TO", "malformed-mailbox");
    vi.stubEnv("SITE_URL", "malformed-url");

    const configuration = getLeadConfiguration("quote");
    expect(configuration.webhook).toEqual({ status: "invalid" });
    expect(configuration.email).toMatchObject({
      status: "ready", from: "Caraway <quote@example.com>", to: "inbox@example.com",
    });
    expect(getLeadConfiguration("contact").email).toEqual({ status: "invalid" });
  });

  it("keeps a healthy webhook ready despite malformed email configuration", () => {
    configureQuoteEmail();
    vi.stubEnv("QUOTE_ENDPOINT", "https://hooks.example.com/quote");
    vi.stubEnv("QUOTE_NOTIFICATION_TO", "not-an-email");

    expect(getLeadConfiguration("quote")).toEqual({
      webhook: { status: "ready", endpoint: "https://hooks.example.com/quote" },
      email: { status: "invalid" },
    });
  });

  it("treats empty values as absent and a shared API key alone as disabled for each kind", () => {
    vi.stubEnv("RESEND_API_KEY", "re_test_key");
    vi.stubEnv("QUOTE_ENDPOINT", "  ");
    vi.stubEnv("QUOTE_NOTIFICATION_FROM", "  ");
    expect(getLeadConfiguration("quote")).toEqual({
      webhook: { status: "disabled" }, email: { status: "disabled" },
    });
    expect(getLeadConfiguration("contact").email).toEqual({ status: "disabled" });
  });

  it("reports incomplete email configuration as invalid", () => {
    vi.stubEnv("QUOTE_NOTIFICATION_FROM", "quote@example.com");
    expect(getLeadConfiguration("quote").email.status).toBe("invalid");
    vi.stubEnv("QUOTE_NOTIFICATION_TO", "inbox@example.com");
    expect(getLeadConfiguration("quote").email.status).toBe("invalid");
    vi.stubEnv("RESEND_API_KEY", "re_test_key");
    expect(getLeadConfiguration("quote").email.status).toBe("ready");
  });

  it.each([
    "quote@example.com", "Caraway <quote@example.com>", '"Caraway, Brisbane" <quote@example.com>',
  ])("accepts a standard From and To mailbox: %s", (mailbox) => {
    configureQuoteEmail();
    vi.stubEnv("QUOTE_NOTIFICATION_FROM", mailbox);
    vi.stubEnv("QUOTE_NOTIFICATION_TO", mailbox);
    expect(getLeadConfiguration("quote").email.status).toBe("ready");
  });

  it.each([
    "not-an-address", "Caraway <invalid>", "quote@example.com, other@example.com",
    "Caraway <quote@example.com> trailing", "quote@example.com\r\nBcc: other@example.com",
    "quote@example.com\n", "<quote@example.com>",
  ])("rejects malformed or injected mailboxes: %j", (mailbox) => {
    configureQuoteEmail();
    vi.stubEnv("QUOTE_NOTIFICATION_FROM", mailbox);
    expect(getLeadConfiguration("quote").email).toEqual({ status: "invalid" });
    configureQuoteEmail();
    vi.stubEnv("QUOTE_NOTIFICATION_TO", mailbox);
    expect(getLeadConfiguration("quote").email).toEqual({ status: "invalid" });
  });

  it.each(["not-a-url", "http://hooks.example.com/quote", "https://127.0.0.1/hook"])(
    "uses the delivery endpoint security validator for %s", (endpoint) => {
      vi.stubEnv("QUOTE_ENDPOINT", endpoint);
      expect(getLeadConfiguration("quote").webhook).toEqual({ status: "invalid" });
    },
  );

  it("retains the optional endpoint-host allowlist", () => {
    vi.stubEnv("QUOTE_ENDPOINT", "https://hooks.example.com/quote");
    vi.stubEnv("ALLOWED_ENDPOINT_HOSTS", "trusted.example.com");
    expect(getLeadConfiguration("quote").webhook.status).toBe("invalid");
    vi.stubEnv("ALLOWED_ENDPOINT_HOSTS", "hooks.example.com");
    expect(getLeadConfiguration("quote").webhook.status).toBe("ready");
  });
});

describe("lazy environment fields", () => {
  it("lets Places and chat read their credentials when unrelated settings are malformed", () => {
    vi.stubEnv("QUOTE_ENDPOINT", "not-a-url");
    vi.stubEnv("CONTACT_NOTIFICATION_TO", "not-an-email");
    vi.stubEnv("SITE_URL", "not-a-url");
    vi.stubEnv("GOOGLE_PLACES_API_KEY", "places_test_key");
    vi.stubEnv("AI_GATEWAY_API_KEY", "gateway_test_key");
    const env = getEnv();

    expect(env.GOOGLE_PLACES_API_KEY).toBe("places_test_key");
    expect(env.AI_GATEWAY_API_KEY).toBe("gateway_test_key");
    expect(() => env.QUOTE_ENDPOINT).toThrow();
    expect(env.CONTACT_ENDPOINT).toBeUndefined();
  });

  it("normalizes blank values and reads updated credentials without a module reset", () => {
    vi.stubEnv("GOOGLE_PLACES_API_KEY", " ");
    const env = getEnv();
    expect(env.GOOGLE_PLACES_API_KEY).toBeUndefined();
    vi.stubEnv("GOOGLE_PLACES_API_KEY", "new_places_test_key");
    expect(env.GOOGLE_PLACES_API_KEY).toBe("new_places_test_key");
  });
});
