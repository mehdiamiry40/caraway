"use server";

import { sendContactNotificationEmail } from "@/lib/contact-email";
import { contactFormSchema, type ContactFormInput } from "@/lib/quote-schema";
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
export async function submitContact(data: ContactFormInput) {
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

  const webhookFailureReason = describeWebhookFailure(webhookResult);
  const emailFailureReason = describeEmailFailure(emailResult);

  if (webhookOk || emailOk) {
    if (webhookFailureReason) {
      console.error("[submit-contact] webhook delivery failed:", webhookFailureReason);
    }
    if (emailFailureReason) {
      console.error("[submit-contact] email delivery failed:", emailFailureReason);
    }
    return { success: true as const };
  }

  if (webhookFailureReason) {
    console.error("[submit-contact] webhook delivery failed:", webhookFailureReason);
  }
  if (emailFailureReason) {
    console.error("[submit-contact] email delivery failed:", emailFailureReason);
  }

  return {
    success: false as const,
    message:
      "We couldn't send your request. Please try again or use the form below.",
  };
}

type WebhookResult = Awaited<ReturnType<typeof submitForm>>;

/**
 * Returns an operator-facing failure reason for the webhook channel, or
 * `null` if there's nothing to log — either because delivery succeeded
 * or because the channel is intentionally not configured (the `skipped`
 * case should never produce an ops error).
 */
function describeWebhookFailure(
  result: PromiseSettledResult<WebhookResult>,
): string | null {
  if (result.status === "rejected") {
    return result.reason instanceof Error
      ? result.reason.message
      : String(result.reason);
  }
  const value = result.value;
  if (value.success) return null;
  if ("skipped" in value && value.skipped) return null;
  if ("message" in value) return value.message;
  return "unknown failure";
}

/**
 * Returns an operator-facing failure reason for the email channel, or
 * `null` if there's nothing to log — either because delivery succeeded
 * or because Resend isn't configured (quiet skip, not a failure).
 */
function describeEmailFailure(
  result: PromiseSettledResult<{ sent: boolean }>,
): string | null {
  if (result.status === "rejected") {
    return result.reason instanceof Error
      ? result.reason.message
      : String(result.reason);
  }
  // `sent: false` from the email helper means "intentionally not
  // configured" — the helper throws on real delivery failures.
  return null;
}
