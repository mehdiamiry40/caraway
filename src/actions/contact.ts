"use server";

import { contactFormSchema, type ContactFormInput } from "@/lib/quote-schema";
import { submitLead } from "./lead-delivery";

/**
 * Save a contact message, then deliver it through the configured channels:
 * the external webhook (CONTACT_ENDPOINT) and email to the business inbox.
 *
 * Shares every rule with submitQuote. See ./lead-delivery.
 */
export async function submitContact(data: ContactFormInput, submissionId?: string) {
  return submitLead("contact", contactFormSchema, data, submissionId);
}
