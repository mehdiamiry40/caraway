import * as z from "zod/mini";
import {
  auPhoneRegex,
  quoteConditionValues,
  QUOTE_VALIDATION_LIMITS,
  QUOTE_VALIDATION_MESSAGES,
  sanitizeLine,
  stripPhone,
} from "@/lib/quote-validation-rules";

export { quoteConditionValues };

export type QuoteCondition = (typeof quoteConditionValues)[number];

/** Friendly labels for the condition enum — used by UI forms/selects. */
export const CONDITION_LABELS: Record<QuoteCondition, string> = {
  running: "Running — drives well, no major issues",
  needs_work: "Needs work — runs but has issues",
  not_running: "Not running — won't start or drive",
  damaged: "Damaged — accident, flood, or major fault",
  scrap: "Scrap — written off or end of life",
};

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
  quoteAmount: z.optional(
    z
      .int()
      .check(z.positive(), z.lte(QUOTE_VALIDATION_LIMITS.quoteAmount.max)),
  ),
  honeypot: honeypotField,
  marketingConsent: z._default(z.optional(z.boolean()), false),
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
    z.email("Enter a valid email address").check(
      z.maxLength(320, "Email is too long"),
      z.overwrite(sanitizeLine),
    ),
  ),
  phone: optionalPhone,
  message: z.string().check(
    z.trim(),
    z.minLength(5, "Please add a short note (at least 5 characters)"),
    z.maxLength(5000, "Message is too long"),
  ),
  honeypot: honeypotField,
  marketingConsent: z._default(z.optional(z.boolean()), false),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
export type ContactFormInput = z.input<typeof contactFormSchema>;
