import type {
  FieldError,
  FieldErrors,
  Resolver,
} from "react-hook-form";

import type { QuoteFormInput } from "@/lib/quote-schema";
import {
  auPhoneRegex,
  normalizeExpectedPrice,
  quoteConditionValues,
  QUOTE_VALIDATION_LIMITS,
  QUOTE_VALIDATION_MESSAGES,
  sanitizeLine,
  stripPhone,
} from "@/lib/quote-validation-rules";

type QuoteField = keyof QuoteFormInput;
type QuoteErrors = FieldErrors<QuoteFormInput>;

export type QuoteClientValidationResult =
  | { success: true; data: QuoteFormInput }
  | { success: false; errors: QuoteErrors };

function setError(
  errors: QuoteErrors,
  field: QuoteField,
  message: string,
): void {
  (errors as Partial<Record<QuoteField, FieldError>>)[field] = {
    type: "validate",
    message,
  };
}

function readString(
  raw: Partial<Record<QuoteField, unknown>>,
  errors: QuoteErrors,
  field: QuoteField,
): string | null {
  const value = raw[field];
  if (typeof value !== "string") {
    setError(errors, field, QUOTE_VALIDATION_MESSAGES.invalidInput);
    return null;
  }
  return value;
}

/**
 * Browser-only validation for the interactive quote form. This intentionally
 * has no runtime import from quote-schema/Zod: the server action validates the
 * submitted object again with quoteFormSchema before any delivery side effect.
 */
export function validateQuoteFormForClient(
  values: QuoteFormInput,
): QuoteClientValidationResult {
  const raw = values as Partial<Record<QuoteField, unknown>>;
  const errors: QuoteErrors = {};
  const normalized: Partial<Record<QuoteField, unknown>> = {};

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

  const phone = readString(raw, errors, "phone");
  if (phone !== null) {
    const stripped = stripPhone(phone.trim());
    if (!auPhoneRegex.test(stripped)) {
      setError(errors, "phone", QUOTE_VALIDATION_MESSAGES.phoneInvalid);
    }
    normalized.phone = sanitizeLine(stripped);
  }

  const make = readString(raw, errors, "make");
  if (make !== null) {
    const trimmed = make.trim();
    if (trimmed.length < QUOTE_VALIDATION_LIMITS.make.min) {
      setError(errors, "make", QUOTE_VALIDATION_MESSAGES.makeRequired);
    } else if (trimmed.length > QUOTE_VALIDATION_LIMITS.make.max) {
      setError(errors, "make", QUOTE_VALIDATION_MESSAGES.makeTooLong);
    }
    normalized.make = sanitizeLine(trimmed);
  }

  const model = readString(raw, errors, "model");
  if (model !== null) {
    const trimmed = model.trim();
    if (trimmed.length < QUOTE_VALIDATION_LIMITS.model.min) {
      setError(errors, "model", QUOTE_VALIDATION_MESSAGES.modelRequired);
    } else if (trimmed.length > QUOTE_VALIDATION_LIMITS.model.max) {
      setError(errors, "model", QUOTE_VALIDATION_MESSAGES.modelTooLong);
    }
    normalized.model = sanitizeLine(trimmed);
  }

  let year: number | null = null;
  try {
    year = Number(raw.year);
  } catch {
    setError(errors, "year", QUOTE_VALIDATION_MESSAGES.invalidInput);
  }
  if (year !== null) {
    if (!Number.isFinite(year)) {
      setError(errors, "year", QUOTE_VALIDATION_MESSAGES.invalidInput);
    } else if (
      year < QUOTE_VALIDATION_LIMITS.year.min ||
      year > QUOTE_VALIDATION_LIMITS.year.max
    ) {
      setError(errors, "year", QUOTE_VALIDATION_MESSAGES.yearInvalid);
    }
    normalized.year = year;
  }

  if (
    typeof raw.condition !== "string" ||
    !(quoteConditionValues as readonly string[]).includes(raw.condition)
  ) {
    setError(
      errors,
      "condition",
      QUOTE_VALIDATION_MESSAGES.conditionRequired,
    );
  } else {
    normalized.condition = raw.condition;
  }

  const address = readString(raw, errors, "address");
  if (address !== null) {
    const trimmed = address.trim();
    if (trimmed.length < QUOTE_VALIDATION_LIMITS.address.min) {
      setError(errors, "address", QUOTE_VALIDATION_MESSAGES.addressRequired);
    } else if (trimmed.length > QUOTE_VALIDATION_LIMITS.address.max) {
      setError(errors, "address", QUOTE_VALIDATION_MESSAGES.addressTooLong);
    }
    normalized.address = sanitizeLine(trimmed);
  }

  if (raw.details !== undefined) {
    if (typeof raw.details !== "string") {
      setError(errors, "details", QUOTE_VALIDATION_MESSAGES.invalidInput);
    } else {
      const trimmed = raw.details.trim();
      if (trimmed.length > QUOTE_VALIDATION_LIMITS.details.max) {
        setError(errors, "details", QUOTE_VALIDATION_MESSAGES.detailsTooLong);
      }
      normalized.details = sanitizeLine(trimmed);
    }
  }

  // A blank expected price stays absent from the payload rather than being
  // normalized to $0.
  const expectedPrice = normalizeExpectedPrice(raw.expectedPrice);
  if (expectedPrice !== undefined) {
    if (
      !Number.isInteger(expectedPrice) ||
      expectedPrice < QUOTE_VALIDATION_LIMITS.expectedPrice.min
    ) {
      setError(
        errors,
        "expectedPrice",
        QUOTE_VALIDATION_MESSAGES.expectedPriceInvalid,
      );
    } else if (expectedPrice > QUOTE_VALIDATION_LIMITS.expectedPrice.max) {
      setError(
        errors,
        "expectedPrice",
        QUOTE_VALIDATION_MESSAGES.expectedPriceTooHigh,
      );
    } else {
      normalized.expectedPrice = expectedPrice;
    }
  }

  if (raw.honeypot === undefined) {
    normalized.honeypot = "";
  } else if (typeof raw.honeypot !== "string") {
    setError(errors, "honeypot", QUOTE_VALIDATION_MESSAGES.invalidInput);
  } else {
    const honeypot = raw.honeypot.trim();
    if (honeypot !== "") {
      setError(
        errors,
        "honeypot",
        QUOTE_VALIDATION_MESSAGES.honeypotInvalid,
      );
    }
    normalized.honeypot = honeypot;
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  return { success: true, data: normalized as QuoteFormInput };
}

export const quoteFormResolver: Resolver<QuoteFormInput> = (values) => {
  const result = validateQuoteFormForClient(values);
  if (!result.success) {
    return { values: {}, errors: result.errors };
  }
  return { values: result.data, errors: {} };
};
