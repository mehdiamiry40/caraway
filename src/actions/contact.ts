"use server";

import { sendContactNotificationEmail } from "@/lib/contact-email";
import { contactFormSchema, type ContactFormValues } from "@/lib/quote-schema";
import { submitForm } from "./submit-form";

/**
 * Submit a contact request through two parallel delivery channels:
 *   1) the external webhook (CONTACT_ENDPOINT) — feeds CRM / automation
 *   2) direct email to the business inbox via Resend
 *
 * Either channel succeeding is enough to show the user a success state —
 * we don't want a CRM outage or a missing webhook config to block the
 * message from reaching info@caraway.au, and we don't want an email
 * provider outage to lose a webhook-delivered message. Partial failures
 * are logged for operators but kept out of the user response.
 *
 * Matches the dual-channel pattern used by submitQuote so that both
 * public forms share the same reliability story.
 */
export async function submitContact(data: ContactFormValues) {
  const parsed = contactFormSchema.safeParse(data);
  if (!parsed.success) {
    const honeypotHit = parsed.error.issues.some((i) =>
      i.path.includes("honeypot"),
    );
    if (honeypotHit) {
      console.warn("[honeypot] contact spam detected", {
        ts: new Date().toISOString(),
      });
      return { success: true as const };
    }
    return { success: false as const, message: "Invalid form data" };
  }

  const [webhookResult, emailResult] = await Promise.allSettled([
    submitForm({
      schema: contactFormSchema,
      data: parsed.data,
      endpointEnvVar: "CONTACT_ENDPOINT",
      label: "Contact submission",
    }),
    sendContactNotificationEmail(parsed.data),
  ]);

  const webhookOk =
    webhookResult.status === "fulfilled" && webhookResult.value.success;
  const emailOk =
    emailResult.status === "fulfilled" && emailResult.value.sent;

  if (webhookOk || emailOk) {
    if (!webhookOk) {
      const reason =
        webhookResult.status === "rejected"
          ? webhookResult.reason instanceof Error
            ? webhookResult.reason.message
            : String(webhookResult.reason)
          : webhookResult.value.message;
      console.error("[submit-contact] webhook delivery failed:", reason);
    }
    if (emailResult.status === "rejected") {
      const reason =
        emailResult.reason instanceof Error
          ? emailResult.reason.message
          : String(emailResult.reason);
      console.error("[submit-contact] email delivery failed:", reason);
    }
    return { success: true as const };
  }

  if (webhookResult.status === "rejected") {
    console.error(
      "[submit-contact] webhook delivery failed:",
      webhookResult.reason instanceof Error
        ? webhookResult.reason.message
        : String(webhookResult.reason),
    );
  }
  if (emailResult.status === "rejected") {
    console.error(
      "[submit-contact] email delivery failed:",
      emailResult.reason instanceof Error
        ? emailResult.reason.message
        : String(emailResult.reason),
    );
  }

  return {
    success: false as const,
    message:
      "We couldn't send your request. Please try again or use the form below.",
  };
}
