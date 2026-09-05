import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { sendQuoteNotificationEmail } from "@/lib/quote-email";
import { sendContactNotificationEmail } from "@/lib/contact-email";
import { FORM_FETCH_TIMEOUT_MS } from "@/data/constants";

const quote = {
  name: "Jane Doe", phone: "0412345678", make: "Toyota", model: "Hilux", year: 2015,
  condition: "running" as const, address: "12 Example St, Brisbane", honeypot: "",
};
const contact = {
  name: "Jane Doe", email: "jane@example.com", phone: "0412345678",
  message: "Please contact me about my vehicle.", honeypot: "", marketingConsent: false,
};

const deliveries = [
  { kind: "QUOTE", send: (options = {}) => sendQuoteNotificationEmail(quote, options) },
  { kind: "CONTACT", send: (options = {}) => sendContactNotificationEmail(contact, options) },
];

const fetchMock = vi.fn<typeof fetch>();

beforeEach(() => {
  vi.stubGlobal("fetch", fetchMock);
  fetchMock.mockReset();
  for (const key of ["QUOTE_ENDPOINT", "CONTACT_ENDPOINT", "ALLOWED_ENDPOINT_HOSTS"]) {
    vi.stubEnv(key, "");
  }
  vi.stubEnv("RESEND_API_KEY", "re_test_key");
  for (const prefix of ["QUOTE", "CONTACT"]) {
    vi.stubEnv(`${prefix}_NOTIFICATION_FROM`, "Caraway <leads@example.com>");
    vi.stubEnv(`${prefix}_NOTIFICATION_TO`, "inbox@example.com");
  }
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe.each(deliveries)("$kind email delivery through the installed SDK", ({ kind, send }) => {
  it("passes the delivery key and an eight-second abort signal to fetch and preserves the provider ID", async () => {
    const timeout = vi.spyOn(AbortSignal, "timeout");
    fetchMock.mockResolvedValue(new Response(JSON.stringify({ id: "provider-123" })));

    expect(await send({ idempotencyKey: "lead-email-123" })).toEqual({
      sent: true, providerId: "provider-123",
    });
    expect(timeout).toHaveBeenCalledWith(FORM_FETCH_TIMEOUT_MS);
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.resend.com/emails");
    expect(options?.method).toBe("POST");
    expect(options?.signal).toBe(timeout.mock.results[0].value);
    expect(new Headers(options?.headers).get("Idempotency-Key")).toBe("lead-email-123");
    const body = JSON.parse(options?.body as string);
    expect(body.from).toBe("Caraway <leads@example.com>");
    expect(body.to).toBe("inbox@example.com");
    if (kind === "CONTACT") expect(body.reply_to).toBe("jane@example.com");
  });

  it("delivers with malformed webhook and unrelated configuration", async () => {
    vi.stubEnv(`${kind}_ENDPOINT`, "malformed-webhook");
    vi.stubEnv("SITE_URL", "malformed-site-url");
    vi.stubEnv(kind === "QUOTE" ? "CONTACT_NOTIFICATION_TO" : "QUOTE_NOTIFICATION_TO", "malformed-email");
    fetchMock.mockResolvedValue(new Response(JSON.stringify({ id: "accepted-123" })));

    expect(await send()).toEqual({ sent: true, providerId: "accepted-123" });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it.each([null, {}, { id: "" }])("does not report success without a provider ID: %j", async (response) => {
    fetchMock.mockResolvedValue(new Response(JSON.stringify(response)));
    await expect(send()).rejects.toThrow(/delivery ID/);
  });

  it("propagates the abort signal to a pending transport request", async () => {
    const controller = new AbortController();
    vi.spyOn(AbortSignal, "timeout").mockReturnValue(controller.signal);
    fetchMock.mockImplementation((_url, options) => new Promise((_resolve, reject) => {
      options?.signal?.addEventListener("abort", () => reject(controller.signal.reason), { once: true });
    }));

    const attempt = send();
    controller.abort(new DOMException("Deadline exceeded", "TimeoutError"));
    await expect(attempt).rejects.toThrow(/did not confirm acceptance/);
  });

  it("rejects a provider failure without reflecting its error body", async () => {
    fetchMock.mockResolvedValue(new Response(JSON.stringify({
      name: "validation_error", message: "secret-or-payload-detail", statusCode: 400,
    }), { status: 400 }));
    await expect(send()).rejects.toThrow(/did not confirm acceptance/);
  });

  it("skips disabled notification addresses and rejects partial configuration without a request", async () => {
    vi.stubEnv(`${kind}_NOTIFICATION_FROM`, " ");
    vi.stubEnv(`${kind}_NOTIFICATION_TO`, " ");
    expect(await send()).toEqual({ sent: false });
    vi.stubEnv(`${kind}_NOTIFICATION_FROM`, "leads@example.com");
    await expect(send()).rejects.toThrow(/configuration is invalid/);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
