import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/actions/submit-form", () => ({
  submitForm: vi.fn(),
}));

vi.mock("@/lib/quote-email", () => ({
  sendQuoteNotificationEmail: vi.fn(),
}));

import { submitQuote } from "@/actions/quote";
import { submitForm } from "@/actions/submit-form";
import { sendQuoteNotificationEmail } from "@/lib/quote-email";
import type { QuoteFormValues } from "@/lib/quote-schema";

const mockedSubmitForm = vi.mocked(submitForm);
const mockedSendEmail = vi.mocked(sendQuoteNotificationEmail);

const baseValid: QuoteFormValues = {
  name: "Jane Doe",
  phone: "0412345678",
  make: "Toyota",
  model: "Hilux",
  year: 2015,
  condition: "running" as const,
  address: "12 George St, Brisbane",
  honeypot: "" as const,
  marketingConsent: false,
};

let warnSpy: ReturnType<typeof vi.spyOn>;
let errorSpy: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  mockedSubmitForm.mockReset();
  mockedSendEmail.mockReset();
  warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
  errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  warnSpy.mockRestore();
  errorSpy.mockRestore();
});

describe("submitQuote", () => {
  it("returns success when both webhook and email succeed", async () => {
    mockedSubmitForm.mockResolvedValue({ success: true });
    mockedSendEmail.mockResolvedValue({ sent: true });

    const result = await submitQuote(baseValid);

    expect(result).toEqual({ success: true });
    expect(mockedSubmitForm).toHaveBeenCalledTimes(1);
    expect(mockedSendEmail).toHaveBeenCalledTimes(1);
    expect(errorSpy).not.toHaveBeenCalled();
  });

  it("returns success and logs error when webhook fails but email succeeds", async () => {
    mockedSubmitForm.mockResolvedValue({
      success: false,
      message: "boom",
    });
    mockedSendEmail.mockResolvedValue({ sent: true });

    const result = await submitQuote(baseValid);

    expect(result).toEqual({ success: true });
    expect(errorSpy).toHaveBeenCalled();
    const messages = errorSpy.mock.calls.map((c: unknown[]) => c.join(" ")).join("\n");
    expect(messages).toContain("webhook delivery failed");
  });

  it("returns success and logs error when email rejects but webhook succeeds", async () => {
    mockedSubmitForm.mockResolvedValue({ success: true });
    mockedSendEmail.mockRejectedValue(new Error("resend down"));

    const result = await submitQuote(baseValid);

    expect(result).toEqual({ success: true });
    expect(errorSpy).toHaveBeenCalled();
    const messages = errorSpy.mock.calls.map((c: unknown[]) => c.join(" ")).join("\n");
    expect(messages).toContain("email delivery failed");
    expect(messages).toContain("resend down");
  });

  it("returns failure with generic message when both channels fail", async () => {
    mockedSubmitForm.mockResolvedValue({
      success: false,
      message: "webhook 500",
    });
    mockedSendEmail.mockRejectedValue(new Error("email kaboom"));

    const result = await submitQuote(baseValid);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.message).toMatch(/couldn't send/i);
    }
    expect(errorSpy).toHaveBeenCalled();
  });

  it("silently swallows honeypot hits and does not call delivery channels", async () => {
    const result = await submitQuote({
      ...baseValid,
      honeypot: "buy viagra" as unknown as "",
    });

    expect(result).toEqual({ success: true });
    expect(mockedSubmitForm).not.toHaveBeenCalled();
    expect(mockedSendEmail).not.toHaveBeenCalled();
    expect(warnSpy).toHaveBeenCalled();
    const warned = warnSpy.mock.calls.map((c: unknown[]) => c.join(" ")).join("\n");
    expect(warned).toContain("[honeypot]");
  });

  it("returns Invalid form data when schema validation fails for non-honeypot reasons", async () => {
    const { name: _name, ...withoutName } = baseValid;
    void _name;

    const result = await submitQuote(withoutName as never);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.message).toBe("Invalid form data");
    }
    expect(mockedSubmitForm).not.toHaveBeenCalled();
    expect(mockedSendEmail).not.toHaveBeenCalled();
  });
});
