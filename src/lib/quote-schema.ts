import { z } from "zod";

/** Matches Australian phone formats: 04xx, +614xx, landlines, 1800/1300 numbers */
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
const trimText = (v: string) => v.trim();

/** Honeypot field — present on every public form but hidden from real users. */
const honeypotField = z
  .string()
  .optional()
  .transform((value) => value?.trim() ?? "")
  .refine((value) => value === "", "Invalid form submission");

const requiredPhone = z
  .string()
  .transform(trimText)
  .transform(stripPhone)
  .pipe(z.string().regex(auPhoneRegex, "Enter a valid Australian phone number"));

const optionalPhone = z
  .string()
  .optional()
  .transform((v) => (v ? stripPhone(v.trim()) : ""))
  .pipe(
    z.string().refine(
      (v) => v === "" || auPhoneRegex.test(v),
      "Enter a valid Australian phone number"
    )
  );

export const quoteFormSchema = z.object({
  name: z.string().transform(trimText).pipe(z.string().min(2, "Name is required").max(200, "Name is too long")),
  phone: requiredPhone,
  make: z.string().transform(trimText).pipe(z.string().min(2, "Car make is required").max(200, "Car make is too long")),
  year: z.coerce.number().min(1950, "Invalid year").max(new Date().getFullYear() + 1, "Invalid year"),
  condition: z.enum(quoteConditionValues, {
    errorMap: () => ({ message: "Please select a condition" }),
  }),
  honeypot: honeypotField,
  marketingConsent: z.boolean().optional().default(false),
});

export type QuoteFormValues = z.infer<typeof quoteFormSchema>;

export const contactFormSchema = z.object({
  name: z.string().transform(trimText).pipe(z.string().min(2, "Name is required").max(200, "Name is too long")),
  email: z
    .string()
    .transform(trimText)
    .pipe(z.string().email("Enter a valid email address").max(320, "Email is too long")),
  phone: optionalPhone,
  message: z
    .string()
    .transform(trimText)
    .pipe(
      z
        .string()
        .min(5, "Please add a short note (at least 5 characters)")
        .max(5000, "Message is too long")
    ),
  honeypot: honeypotField,
  marketingConsent: z.boolean().optional().default(false),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
