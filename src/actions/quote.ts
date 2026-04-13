"use server";

import { sendQuoteNotificationEmail } from "@/lib/quote-email";
import { QuoteFormValues, quoteFormSchema } from "@/lib/quote-schema";
import { submitForm } from "./submit-form";

/**
 * Submit a quote request through two parallel delivery channels:
 *   1) the external webhook (QUOTE_ENDPOINT) — feeds CRM / automation
 *   2) direct email to the business inbox via Resend
 *
 * Either channel succeeding is enough to show the user a success state —
 * we don't want a CRM outage to block the lead from reaching info@caraway.au,
 * and we don't want an email provider outage to lose a webhook-delivered lead.
 * Partial failures are logged for operators but kept out of the user response.
 */
export async function submitQuote(data: QuoteFormValues) {
  const parsed = quoteFormSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false as const, message: "Invalid form data" };
  }

  const [webhookResult, emailResult] = await Promise.allSettled([
    submitForm({
      schema: quoteFormSchema,
      data: parsed.data,
      endpointEnvVar: "QUOTE_ENDPOINT",
      label: "Quote submission",
    }),
    sendQuoteNotificationEmail(parsed.data),
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
      console.error("[submit-quote] webhook delivery failed:", reason);
    }
    if (emailResult.status === "rejected") {
      const reason =
        emailResult.reason instanceof Error
          ? emailResult.reason.message
          : String(emailResult.reason);
      console.error("[submit-quote] email delivery failed:", reason);
    }
    return { success: true as const };
  }

  if (webhookResult.status === "rejected") {
    console.error(
      "[submit-quote] webhook delivery failed:",
      webhookResult.reason instanceof Error
        ? webhookResult.reason.message
        : String(webhookResult.reason),
    );
  }
  if (emailResult.status === "rejected") {
    console.error(
      "[submit-quote] email delivery failed:",
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
