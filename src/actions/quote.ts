"use server";

import { type QuoteFormInput, quoteFormSchema } from "@/lib/quote-schema";
import { submitLead } from "./lead-delivery";

/**
 * Save a quote request, then deliver it through the configured channels: the
 * external webhook (QUOTE_ENDPOINT) and email to the business inbox.
 *
 * The visitor sees success once the request is saved; delivery and its
 * retries happen afterwards. See ./lead-delivery for the shared rules.
 */
export async function submitQuote(data: QuoteFormInput, submissionId?: string) {
  return submitLead("quote", quoteFormSchema, data, submissionId);
}
