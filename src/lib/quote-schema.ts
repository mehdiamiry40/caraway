import * as z from "zod/mini";

/** Matches Australian phone formats: mobiles, landlines, and common AU service numbers. */
const auPhoneRegex = /^(?:\+?61|0)[2-478]\d{8}$|^1[38]00\d{6}$/;

export const quoteConditionValues = [
  "running",
  "needs_work",
  "not_running",
  "damaged",
  "scrap",
] as const;

export type QuoteCondition = (typeof quoteConditionValues)[number];

/** Friendly labels for the condition enum — used by UI forms/selects. */
export const CONDITION_LABELS: Record<QuoteCondition, string> = {
  running: "Running — drives well, no major issues",
  needs_work: "Needs work — runs but has issues",
  not_running: "Not running — won't start or drive",
  damaged: "Damaged — accident, flood, or major fault",
  scrap: "Scrap — written off or end of life",
};

const stripPhone = (v: string) => v.replace(/[\s\-()]/g, "");
const sanitizeLine = (v: string) => v.replace(/[\r\n]+/g, " ");

/** Honeypot field — present on every public form but hidden from real users. */
const honeypotField = z.pipe(
  z.pipe(
    z.optional(z.string()),
    z.transform((value) => value?.trim() ?? ""),
  ),
  z.string().check(z.refine((v) => v === "", "Invalid form submission")),
);

const requiredPhone = z.string().check(
  z.trim(),
  z.overwrite(stripPhone),
  z.regex(auPhoneRegex, "Enter a valid Australian phone number"),
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
      "Enter a valid Australian phone number",
    ),
    z.overwrite(sanitizeLine),
  ),
);

export const quoteFormSchema = z.object({
  name: z.string().check(
    z.trim(),
    z.minLength(2, "Name is required"),
    z.maxLength(200, "Name is too long"),
    z.overwrite(sanitizeLine),
  ),
  phone: requiredPhone,
  make: z.string().check(
    z.trim(),
    z.minLength(2, "Car make is required"),
    z.maxLength(200, "Car make is too long"),
    z.overwrite(sanitizeLine),
  ),
  model: z.string().check(
    z.trim(),
    z.minLength(1, "Car model is required"),
    z.maxLength(200, "Car model is too long"),
    z.overwrite(sanitizeLine),
  ),
  year: z.coerce.number().check(
    z.gte(1950, "Invalid year"),
    z.lte(new Date().getFullYear() + 1, "Invalid year"),
  ),
  condition: z.enum(quoteConditionValues, {
    message: "Please select a condition",
  }),
  address: z.string().check(
    z.trim(),
    z.minLength(5, "Please enter a full pickup address"),
    z.maxLength(500, "Address is too long"),
    z.overwrite(sanitizeLine),
  ),
  quoteAmount: z.optional(z.int().check(z.positive(), z.lte(1000000))),
  honeypot: honeypotField,
});

export type QuoteFormValues = z.infer<typeof quoteFormSchema>;
export type QuoteFormInput = z.input<typeof quoteFormSchema>;

export const contactFormSchema = z.object({
  name: z.string().check(
    z.trim(),
    z.minLength(2, "Name is required"),
    z.maxLength(200, "Name is too long"),
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
