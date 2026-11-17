import { submitForm } from "@/actions/submit-form";
import { sendQuoteNotificationEmail } from "./quote-email";
import { sendContactNotificationEmail } from "./contact-email";
import { getLeadConfiguration, type LeadKind } from "./lead-config";
import { DeliveryFailure, failureCode } from "./delivery-failure";
import {
  contactFormSchema,
  quoteFormSchema,
  type ContactFormValues,
  type QuoteFormValues,
} from "./quote-schema";
import {
  claimDelivery,
  finishDelivery,
  fingerprint,
  getLeadStore,
  overdueDeliveries,
  type LeadChannel,
  type LeadStore,
} from "./lead-store";

function emailBaseUrl() {
  return process.env.RESEND_BASE_URL ?? "https://api.resend.com";
}

/**
 * Identifies where a channel delivers. Queued work is parked for an operator
 * when this changes, so an enquiry is never sent to a new destination unasked.
 * The email credential is deliberately left out: rotating the API key keeps
 * the sender and recipients, and must not park enquiries that are waiting to
 * retry. The worst case after a rotation is one duplicate notification to the
 * same recipients.
 */
export function channelConfigurationHash(kind: LeadKind, channel: LeadChannel) {
  const configuration = getLeadConfiguration(kind);
  if (channel === "webhook")
    return fingerprint({ configuration: configuration.webhook, baseUrl: "" });
  const { status, from, to } = configuration.email;
  return fingerprint({
    configuration: { status, from, to },
    baseUrl: emailBaseUrl(),
  });
}

// Records captured before the credential was dropped from the email
// fingerprint carry this form. They expire within LEAD_RETENTION_MS of that
// release, after which this function and its use below can be deleted.
function legacyEmailConfigurationHash(kind: LeadKind) {
  return fingerprint({
    configuration: getLeadConfiguration(kind).email,
    baseUrl: emailBaseUrl(),
  });
}

async function deadline<T>(operation: Promise<T>): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      operation,
      new Promise<never>((_, reject) => {
        timer = setTimeout(
          () =>
            reject(new DeliveryFailure("Provider deadline reached", "deadline")),
          9_000,
        );
      }),
    ]);
  } finally {
    clearTimeout(timer);
  }
}

/** One key per enquiry and channel, so a repeated send is not a second message. */
export function deliveryIdempotencyKey(
  kind: LeadKind,
  id: string,
  channel: LeadChannel,
) {
  const environment =
    process.env.VERCEL_ENV?.trim() || process.env.NODE_ENV || "development";
  const branch =
    environment === "preview"
      ? (process.env.VERCEL_GIT_COMMIT_REF ?? "preview")
      : "";
  return `caraway/${fingerprint({ environment, branch }).slice(0, 16)}/${kind}/${id}/${channel}`;
}

export type LeadEmailOutcome =
  | { accepted: true; providerId: string }
  | { accepted: false; failure: string };

/**
 * Sends the notification email for one enquiry. Every call for the same
 * enquiry carries the same provider key, so the worker's retries and the
 * direct send used while storage is unreachable cannot add up to two emails.
 * Never throws: a failure comes back as a code that is safe to log.
 */
export async function sendLeadEmail(
  kind: LeadKind,
  id: string,
  payload: QuoteFormValues | ContactFormValues,
  options: { possibleSpam?: boolean } = {},
): Promise<LeadEmailOutcome> {
  const emailOptions = {
    idempotencyKey: deliveryIdempotencyKey(kind, id, "email"),
    ...(options.possibleSpam ? { possibleSpam: true } : {}),
  };
  try {
    const result = await deadline(
      kind === "quote"
        ? sendQuoteNotificationEmail(payload as QuoteFormValues, emailOptions)
        : sendContactNotificationEmail(
            payload as ContactFormValues,
            emailOptions,
          ),
    );
    return result.sent
      ? { accepted: true, providerId: result.providerId }
      : { accepted: false, failure: "channel_disabled" };
  } catch (error) {
    // The request can have reached the provider before a timeout. The key
    // above is what makes sending again safe.
    return { accepted: false, failure: failureCode(error) };
  }
}

export async function processLead(
  kind: LeadKind,
  id: string,
  store: LeadStore = getLeadStore(),
) {
  const outcomes = await Promise.allSettled(
    (["webhook", "email"] as const).map(async (channel) => {
      const claim = await claimDelivery(
        store,
        kind,
        id,
        channel,
        channelConfigurationHash(kind, channel),
        channel === "email" ? [legacyEmailConfigurationHash(kind)] : [],
      );
      if (!claim) return;
      const { record, token } = claim;
      let accepted = false;
      let providerId: string | undefined;
      // Why the attempt was not accepted, as a code that is safe to log.
      let failure = "not_confirmed";
      if (channel === "email") {
        const outcome = await sendLeadEmail(kind, id, record.payload, {
          possibleSpam: record.possibleSpam,
        });
        accepted = outcome.accepted;
        if (outcome.accepted) providerId = outcome.providerId;
        else failure = outcome.failure;
      } else {
        try {
          const result = await deadline(
            submitForm({
              schema: kind === "quote" ? quoteFormSchema : contactFormSchema,
              data: record.payload,
              endpointEnvVar:
                kind === "quote" ? "QUOTE_ENDPOINT" : "CONTACT_ENDPOINT",
              label: `${kind} delivery`,
              idempotencyKey: deliveryIdempotencyKey(kind, id, channel),
              possibleSpam: record.possibleSpam,
            }),
          );
          accepted = result.success;
          if (!result.success)
            failure =
              "skipped" in result
                ? "channel_skipped"
                : (result.code ?? "not_confirmed");
        } catch (error) {
          // The request can have succeeded before a timeout, and a webhook is
          // never blindly replayed.
          failure = failureCode(error);
        }
      }
      await finishDelivery(store, kind, id, channel, token, {
        accepted,
        providerId,
        retryable: channel === "email",
        reason: `provider_not_confirmed:${failure}`,
      });
      if (!accepted)
        console.error(
          `[lead-delivery] ${kind}/${id}/${channel} provider_not_confirmed ${failure} attempt=${record.channels[channel].attempts}`,
        );
    }),
  );
  if (outcomes.some((result) => result.status === "rejected"))
    throw new Error("Lead state could not be recorded");
}

export async function processPendingLeads(store: LeadStore = getLeadStore()) {
  const due = await store.due(12);
  let cursor = 0;
  let failures = 0;
  await Promise.all(
    Array.from({ length: Math.min(4, due.length) }, async () => {
      while (cursor < due.length) {
        const row = due[cursor++];
        try {
          await processLead(row.kind, row.id, store);
        } catch {
          failures++;
        }
      }
    }),
  );
  return {
    processed: due.length,
    failures,
    ...(await store.health()),
    overdue: (await overdueDeliveries(store)).length,
  };
}
