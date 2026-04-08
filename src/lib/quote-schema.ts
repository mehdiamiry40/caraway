import { z } from "zod";

/** Matches Australian phone formats: 04xx, +614xx, landlines, 1800/1300 numbers */
const auPhoneRegex = /^(?:\+?61|0)[2-478]\d{8}$|^1[38]00\d{6}$/;

const stripPhone = (v: string) => v.replace(/[\s\-()]/g, "");

/** Honeypot field — present on every public form but hidden from real users. */
const honeypotField = z.string().optional();

const requiredPhone = z
  .string()
  .transform(stripPhone)
  .pipe(z.string().regex(auPhoneRegex, "Enter a valid Australian phone number"));

const optionalPhone = z
  .string()
  .optional()
  .transform((v) => (v ? stripPhone(v) : ""))
  .pipe(
    z.string().refine(
      (v) => v === "" || auPhoneRegex.test(v),
      "Enter a valid Australian phone number"
    )
  );

export const quoteFormSchema = z.object({
  name: z.string().min(2, "Name is required").max(200, "Name is too long"),
  phone: requiredPhone,
  make: z.string().min(2, "Car make is required").max(200, "Car make is too long"),
  year: z.coerce.number().min(1950, "Invalid year").max(new Date().getFullYear() + 1, "Invalid year"),
  condition: z.string().min(2, "Please select a condition").max(200, "Condition is too long"),
  honeypot: honeypotField,
});

export type QuoteFormValues = z.infer<typeof quoteFormSchema>;

export const contactFormSchema = z.object({
  name: z.string().min(2, "Name is required").max(200, "Name is too long"),
  email: z.string().email("Enter a valid email address").max(320, "Email is too long"),
  phone: optionalPhone,
  message: z.string().min(10, "Please provide more detail (at least 10 characters)").max(5000, "Message is too long"),
  honeypot: honeypotField,
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
