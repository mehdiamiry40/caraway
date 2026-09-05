"use server";

import { type QuoteFormInput, quoteFormSchema } from "@/lib/quote-schema";
import { deliverLead, rejectInvalidLead } from "./lead-delivery";

/**
 * Submit a quote request through two parallel delivery channels:
 *   1) the external webhook (QUOTE_ENDPOINT) — feeds CRM / automation
 *   2) direct email to the business inbox via Resend
 *
 * Either channel succeeding is enough to show the user a success state —
 * see deliverLead in ./lead-delivery for the shared redundancy semantics.
 */
export async function submitQuote(data: QuoteFormInput, submissionId?: string) {
  const parsed = quoteFormSchema.safeParse(data);
  if (!parsed.success) {
    return rejectInvalidLead("quote", parsed.error);
  }

  return deliverLead("quote", parsed.data, submissionId);
}
