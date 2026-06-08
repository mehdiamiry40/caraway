import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/actions/submit-form", () => ({
  submitForm: vi.fn(),
}));

vi.mock("@/lib/contact-email", () => ({
  sendContactNotificationEmail: vi.fn(),
}));

import { submitContact } from "@/actions/contact";
import { submitForm } from "@/actions/submit-form";
import { sendContactNotificationEmail } from "@/lib/contact-email";
import type { ContactFormInput } from "@/lib/quote-schema";

const mockedSubmitForm = vi.mocked(submitForm);
const mockedSendEmail = vi.mocked(sendContactNotificationEmail);

const validContact: ContactFormInput = {
  name: "Jane Doe",
  email: "jane@example.com",
  phone: "0412345678",
  message: "Please contact me about selling my car.",
  honeypot: "",
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

describe("submitContact", () => {
  it("succeeds when either delivery channel succeeds", async () => {
    mockedSubmitForm.mockResolvedValue({
      success: false,
      message: "webhook unavailable",
    });
    mockedSendEmail.mockResolvedValue({ sent: true });

    await expect(submitContact(validContact)).resolves.toEqual({
      success: true,
    });
    expect(errorSpy).toHaveBeenCalledWith(
      "[submit-contact] webhook delivery failed:",
      "webhook unavailable",
    );
  });

  it("returns a generic failure when both channels fail", async () => {
    mockedSubmitForm.mockResolvedValue({
      success: false,
      message: "webhook unavailable",
    });
    mockedSendEmail.mockRejectedValue(new Error("email unavailable"));

    const result = await submitContact(validContact);

    expect(result.success).toBe(false);
    if (!result.success) expect(result.message).toMatch(/couldn't send/i);
    expect(errorSpy).toHaveBeenCalled();
  });

  it("silently accepts honeypot submissions without delivery", async () => {
    const result = await submitContact({
      ...validContact,
      honeypot: "spam",
    });

    expect(result).toEqual({ success: true });
    expect(mockedSubmitForm).not.toHaveBeenCalled();
    expect(mockedSendEmail).not.toHaveBeenCalled();
    expect(warnSpy).toHaveBeenCalled();
  });

  it("rejects invalid contact data before delivery", async () => {
    const result = await submitContact({
      ...validContact,
      email: "not-an-email",
    });

    expect(result).toEqual({
      success: false,
      message: "Invalid form data",
    });
    expect(mockedSubmitForm).not.toHaveBeenCalled();
    expect(mockedSendEmail).not.toHaveBeenCalled();
  });
});
