import * as z from "zod/mini";
import {
  auPhoneRegex,
  CONTACT_VALIDATION_LIMITS,
  CONTACT_VALIDATION_MESSAGES,
  normalizeExpectedPrice,
  QUOTE_VALIDATION_LIMITS,
  QUOTE_VALIDATION_MESSAGES,
  sanitizeLine,
  stripPhone,
} from "@/lib/quote-validation-rules";
import { quoteConditionValues } from "@/lib/quote-condition";
import { CONTACT_MESSAGE_MAX } from "@/data/constants";

export {
  CONDITION_LABELS,
  quoteConditionValues,
  type QuoteCondition,
} from "@/lib/quote-condition";

/** Honeypot field — present on every public form but hidden from real users. */
const honeypotField = z.pipe(
  z.pipe(
    z.optional(z.string()),
    z.transform((value) => value?.trim() ?? ""),
  ),
  z.string().check(
    z.refine((v) => v === "", QUOTE_VALIDATION_MESSAGES.honeypotInvalid),
  ),
);

/**
 * Seller's asking price in whole AUD. Optional: a blank entry stays absent
 * from the payload rather than being recorded as $0.
 */
const optionalExpectedPrice = z.pipe(
  z.pipe(
    z.optional(z.union([z.string(), z.number()])),
    z.transform((value: string | number | undefined) =>
      normalizeExpectedPrice(value),
    ),
  ),
  z.optional(
    z.number(QUOTE_VALIDATION_MESSAGES.expectedPriceInvalid).check(
      z.refine(
        (v) => Number.isInteger(v),
        QUOTE_VALIDATION_MESSAGES.expectedPriceInvalid,
      ),
      z.gte(
        QUOTE_VALIDATION_LIMITS.expectedPrice.min,
        QUOTE_VALIDATION_MESSAGES.expectedPriceInvalid,
      ),
      z.lte(
        QUOTE_VALIDATION_LIMITS.expectedPrice.max,
        QUOTE_VALIDATION_MESSAGES.expectedPriceTooHigh,
      ),
    ),
  ),
);

const requiredPhone = z.string().check(
  z.trim(),
  z.overwrite(stripPhone),
  z.regex(auPhoneRegex, QUOTE_VALIDATION_MESSAGES.phoneInvalid),
  z.overwrite(sanitizeLine),
);

const optionalPhone = z.pipe(
  z.pipe(
    z.optional(z.string()),
    z.transform((v) => (v ? stripPhone(v.trim()) : "")),
  ),
  z.string().check(
    z.refine(
      (v) => v === "" || auPhoneRegex.test(v),
      QUOTE_VALIDATION_MESSAGES.phoneInvalid,
    ),
    z.overwrite(sanitizeLine),
  ),
);

export const quoteFormSchema = z.object({
  name: z.string().check(
    z.trim(),
    z.minLength(
      QUOTE_VALIDATION_LIMITS.name.min,
      QUOTE_VALIDATION_MESSAGES.nameRequired,
    ),
    z.maxLength(
      QUOTE_VALIDATION_LIMITS.name.max,
      QUOTE_VALIDATION_MESSAGES.nameTooLong,
    ),
    z.overwrite(sanitizeLine),
  ),
  phone: requiredPhone,
  make: z.string().check(
    z.trim(),
    z.minLength(
      QUOTE_VALIDATION_LIMITS.make.min,
      QUOTE_VALIDATION_MESSAGES.makeRequired,
    ),
    z.maxLength(
      QUOTE_VALIDATION_LIMITS.make.max,
      QUOTE_VALIDATION_MESSAGES.makeTooLong,
    ),
    z.overwrite(sanitizeLine),
  ),
  model: z.string().check(
    z.trim(),
    z.minLength(
      QUOTE_VALIDATION_LIMITS.model.min,
      QUOTE_VALIDATION_MESSAGES.modelRequired,
    ),
    z.maxLength(
      QUOTE_VALIDATION_LIMITS.model.max,
      QUOTE_VALIDATION_MESSAGES.modelTooLong,
    ),
    z.overwrite(sanitizeLine),
  ),
  year: z.coerce.number().check(
    z.gte(
      QUOTE_VALIDATION_LIMITS.year.min,
      QUOTE_VALIDATION_MESSAGES.yearInvalid,
    ),
    z.lte(
      QUOTE_VALIDATION_LIMITS.year.max,
      QUOTE_VALIDATION_MESSAGES.yearInvalid,
    ),
  ),
  condition: z.enum(quoteConditionValues, {
    message: QUOTE_VALIDATION_MESSAGES.conditionRequired,
  }),
  address: z.string().check(
    z.trim(),
    z.minLength(
      QUOTE_VALIDATION_LIMITS.address.min,
      QUOTE_VALIDATION_MESSAGES.addressRequired,
    ),
    z.maxLength(
      QUOTE_VALIDATION_LIMITS.address.max,
      QUOTE_VALIDATION_MESSAGES.addressTooLong,
    ),
    z.overwrite(sanitizeLine),
  ),
  details: z.optional(
    z.string().check(
      z.trim(),
      z.maxLength(
        QUOTE_VALIDATION_LIMITS.details.max,
        QUOTE_VALIDATION_MESSAGES.detailsTooLong,
      ),
      z.overwrite(sanitizeLine),
    ),
  ),
  expectedPrice: optionalExpectedPrice,
  honeypot: honeypotField,
});

export type QuoteFormValues = z.infer<typeof quoteFormSchema>;
export type QuoteFormInput = z.input<typeof quoteFormSchema>;

export const contactFormSchema = z.object({
  name: z.string().check(
    z.trim(),
    z.minLength(
      QUOTE_VALIDATION_LIMITS.name.min,
      QUOTE_VALIDATION_MESSAGES.nameRequired,
    ),
    z.maxLength(
      QUOTE_VALIDATION_LIMITS.name.max,
      QUOTE_VALIDATION_MESSAGES.nameTooLong,
    ),
    z.overwrite(sanitizeLine),
  ),
  email: z.pipe(
    z.string().check(z.trim()),
    z.email(CONTACT_VALIDATION_MESSAGES.emailInvalid).check(
      z.maxLength(
        CONTACT_VALIDATION_LIMITS.email.max,
        CONTACT_VALIDATION_MESSAGES.emailTooLong,
      ),
      z.overwrite(sanitizeLine),
    ),
  ),
  phone: optionalPhone,
  message: z.string().check(
    z.trim(),
    z.minLength(
      CONTACT_VALIDATION_LIMITS.message.min,
      CONTACT_VALIDATION_MESSAGES.messageTooShort,
    ),
    z.maxLength(CONTACT_MESSAGE_MAX, CONTACT_VALIDATION_MESSAGES.messageTooLong),
  ),
  honeypot: honeypotField,
  marketingConsent: z._default(z.optional(z.boolean()), false),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
export type ContactFormInput = z.input<typeof contactFormSchema>;
