import { rateLimit } from "@/lib/rate-limit";
import type { submitForm } from "./submit-form";

type WebhookResult = Awaited<ReturnType<typeof submitForm>>;

export type LeadDeliveryResult =
  | { success: true }
  | { success: false; message: string };

const FAILURE_MESSAGE =
  "We couldn't send your request. Please try again or use the form below.";

/** Schema rejection caused by the hidden anti-spam field rather than bad user input. */
export function isHoneypotHit(error: {
  issues: Array<{ path: Array<PropertyKey> }>;
}): boolean {
  return error.issues.some((issue) => issue.path.includes("honeypot"));
}

/**
 * Shared handling for a lead that failed schema validation: honeypot hits are
 * swallowed with a fake success (bots get no signal they were caught), real
 * validation failures surface a generic message.
 */
export function rejectInvalidLead(
  formName: string,
  error: { issues: Array<{ path: Array<PropertyKey> }> },
): LeadDeliveryResult {
  if (isHoneypotHit(error)) {
    console.warn(`[honeypot] ${formName} spam detected`, {
      ts: new Date().toISOString(),
    });
    return { success: true as const };
  }
  return { success: false as const, message: "Invalid form data" };
}

/**
 * Run both delivery channels in parallel and treat either success as overall
 * success — a CRM outage must not block the lead from reaching the inbox, and
 * an email-provider outage must not lose a webhook-delivered lead. Partial
 * failures are logged for operators but kept out of the user response.
 */
export async function deliverLead(options: {
  /** Console tag for operator logs, e.g. "submit-quote". */
  logTag: string;
  webhook: () => Promise<WebhookResult>;
  email: () => Promise<{ sent: boolean }>;
}): Promise<LeadDeliveryResult> {
  // Both public actions validate before reaching this shared boundary. Consume
  // one deployment-wide unit per accepted lead attempt, not one per delivery
  // channel, so rotating IPs cannot create unbounded inbox/CRM work.
  const admission = await rateLimit("forms-global", "global");
  if (!admission.success) {
    console.error(
      `[${options.logTag}] lead delivery admission ${
        admission.mode === "unavailable" ? "unavailable" : "exhausted"
      }`,
    );
    return { success: false as const, message: FAILURE_MESSAGE };
  }

  const [webhookResult, emailResult] = await Promise.allSettled([
    options.webhook(),
    options.email(),
  ]);

  const webhookOk =
    webhookResult.status === "fulfilled" && webhookResult.value.success;
  const emailOk =
    emailResult.status === "fulfilled" && emailResult.value.sent;

  const webhookFailureReason = describeWebhookFailure(webhookResult);
  const emailFailureReason = describeEmailFailure(emailResult);
  if (webhookFailureReason) {
    console.error(
      `[${options.logTag}] webhook delivery failed:`,
      webhookFailureReason,
    );
  }
  if (emailFailureReason) {
    console.error(
      `[${options.logTag}] email delivery failed:`,
      emailFailureReason,
    );
  }

  if (webhookOk || emailOk) {
    return { success: true as const };
  }
  return { success: false as const, message: FAILURE_MESSAGE };
}

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
 * or because Resend isn't configured (quiet skip, not a failure; the
 * email helpers throw on real delivery failures).
 */
function describeEmailFailure(
  result: PromiseSettledResult<{ sent: boolean }>,
): string | null {
  if (result.status === "rejected") {
    return result.reason instanceof Error
      ? result.reason.message
      : String(result.reason);
  }
  return null;
}
