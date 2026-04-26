import { quoteFormSchema } from "@/lib/quote-schema";

export function validateName(value: string): string | null {
  const result = quoteFormSchema.shape.name.safeParse(value);
  if (result.success) return null;
  return result.error.issues[0]?.message ?? "Enter your name";
}

export function validatePhone(value: string): string | null {
  const result = quoteFormSchema.shape.phone.safeParse(value);
  if (result.success) return null;
  return result.error.issues[0]?.message ?? "Enter a valid Australian phone number";
}

export function validateAddress(value: string): string | null {
  const trimmed = value.trim();
  if (trimmed.length < 5) return "Enter a pickup address";
  if (trimmed.length > 500) return "Address is too long";
  return null;
}
