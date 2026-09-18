import type { FieldError, FieldErrors, Resolver } from "react-hook-form";

import { CONTACT_MESSAGE_MAX } from "@/data/constants";
import type { ContactFormInput } from "@/lib/quote-schema";
import {
  auPhoneRegex,
  CONTACT_VALIDATION_LIMITS,
  CONTACT_VALIDATION_MESSAGES,
  QUOTE_VALIDATION_LIMITS,
  QUOTE_VALIDATION_MESSAGES,
  sanitizeLine,
  stripPhone,
} from "@/lib/quote-validation-rules";

type ContactField = keyof ContactFormInput;
type ContactErrors = FieldErrors<ContactFormInput>;

export type ContactClientValidationResult =
  | { success: true; data: ContactFormInput }
  | { success: false; errors: ContactErrors };

// Mirrors Zod's default email format without importing Zod into the browser.
const contactEmailRegex =
  /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+.\-]*)[A-Za-z0-9_+\-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/;

function setError(
  errors: ContactErrors,
  field: ContactField,
  message: string,
): void {
  const fieldErrors = errors as Partial<Record<ContactField, FieldError>>;
  if (fieldErrors[field]) return;
  fieldErrors[field] = { type: "validate", message };
}

function readString(
  raw: Partial<Record<ContactField, unknown>>,
  errors: ContactErrors,
  field: ContactField,
): string | null {
  const value = raw[field];
  if (typeof value !== "string") {
    setError(errors, field, QUOTE_VALIDATION_MESSAGES.invalidInput);
    return null;
  }
  return value;
}

/**
 * Lightweight browser validation for the contact form. The server action
 * always validates the submitted object again with contactFormSchema before
 * any delivery side effect, so this resolver only improves client feedback.
 */
export function validateContactFormForClient(
  values: ContactFormInput,
): ContactClientValidationResult {
  const raw = values as Partial<Record<ContactField, unknown>>;
  const errors: ContactErrors = {};
  const normalized: Partial<Record<ContactField, unknown>> = {};

  const name = readString(raw, errors, "name");
  if (name !== null) {
    const trimmed = name.trim();
    if (trimmed.length < QUOTE_VALIDATION_LIMITS.name.min) {
      setError(errors, "name", QUOTE_VALIDATION_MESSAGES.nameRequired);
    } else if (trimmed.length > QUOTE_VALIDATION_LIMITS.name.max) {
      setError(errors, "name", QUOTE_VALIDATION_MESSAGES.nameTooLong);
    }
    normalized.name = sanitizeLine(trimmed);
  }

  const email = readString(raw, errors, "email");
  if (email !== null) {
    const trimmed = email.trim();
    if (!contactEmailRegex.test(trimmed)) {
      setError(errors, "email", CONTACT_VALIDATION_MESSAGES.emailInvalid);
    }
    if (trimmed.length > CONTACT_VALIDATION_LIMITS.email.max) {
      setError(errors, "email", CONTACT_VALIDATION_MESSAGES.emailTooLong);
    }
    normalized.email = sanitizeLine(trimmed);
  }

  if (raw.phone === undefined) {
    normalized.phone = "";
  } else if (typeof raw.phone !== "string") {
    setError(errors, "phone", QUOTE_VALIDATION_MESSAGES.invalidInput);
  } else {
    const phone = stripPhone(raw.phone.trim());
    if (phone !== "" && !auPhoneRegex.test(phone)) {
      setError(errors, "phone", QUOTE_VALIDATION_MESSAGES.phoneInvalid);
    }
    normalized.phone = sanitizeLine(phone);
  }

  const message = readString(raw, errors, "message");
  if (message !== null) {
    const trimmed = message.trim();
    if (trimmed.length < CONTACT_VALIDATION_LIMITS.message.min) {
      setError(
        errors,
        "message",
        CONTACT_VALIDATION_MESSAGES.messageTooShort,
      );
    } else if (trimmed.length > CONTACT_MESSAGE_MAX) {
      setError(
        errors,
        "message",
        CONTACT_VALIDATION_MESSAGES.messageTooLong,
      );
    }
    normalized.message = trimmed;
  }

  if (raw.honeypot === undefined) {
    normalized.honeypot = "";
  } else if (typeof raw.honeypot !== "string") {
    setError(errors, "honeypot", QUOTE_VALIDATION_MESSAGES.invalidInput);
  } else {
    const honeypot = raw.honeypot.trim();
    if (honeypot !== "") {
      setError(errors, "honeypot", QUOTE_VALIDATION_MESSAGES.honeypotInvalid);
    }
    normalized.honeypot = honeypot;
  }

  if (raw.marketingConsent === undefined) {
    normalized.marketingConsent = false;
  } else if (typeof raw.marketingConsent !== "boolean") {
    setError(
      errors,
      "marketingConsent",
      QUOTE_VALIDATION_MESSAGES.invalidInput,
    );
  } else {
    normalized.marketingConsent = raw.marketingConsent;
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  return { success: true, data: normalized as ContactFormInput };
}

export const contactFormResolver: Resolver<ContactFormInput> = (values) => {
  const result = validateContactFormForClient(values);
  if (!result.success) {
    return { values: {}, errors: result.errors };
  }
  return { values: result.data, errors: {} };
};
