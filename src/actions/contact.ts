"use server";

import { sendContactNotificationEmail } from "@/lib/contact-email";
import { contactFormSchema, type ContactFormInput } from "@/lib/quote-schema";
import { deliverLead, rejectInvalidLead } from "./lead-delivery";
import { submitForm } from "./submit-form";

/**
 * Submit a contact request through two parallel delivery channels:
 *   1) the external webhook (CONTACT_ENDPOINT) — feeds CRM / automation
 *   2) direct email to the business inbox via Resend
 *
 * Either channel succeeding is enough to show the user a success state —
 * see deliverLead in ./lead-delivery for the shared redundancy semantics.
 * Matches the dual-channel pattern used by submitQuote so that both
 * public forms share the same reliability story.
 */
export async function submitContact(data: ContactFormInput) {
  const parsed = contactFormSchema.safeParse(data);
  if (!parsed.success) {
    return rejectInvalidLead("contact", parsed.error);
  }

  return deliverLead({
    logTag: "submit-contact",
    webhook: () =>
      submitForm({
        schema: contactFormSchema,
        data: parsed.data,
        endpointEnvVar: "CONTACT_ENDPOINT",
        label: "Contact submission",
      }),
    email: () => sendContactNotificationEmail(parsed.data),
  });
}
