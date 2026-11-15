import { submitForm } from "@/actions/submit-form";
import { sendQuoteNotificationEmail } from "./quote-email";
import { sendContactNotificationEmail } from "./contact-email";
import { getLeadConfiguration, type LeadKind } from "./lead-config";
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
          () => reject(new Error("Provider deadline reached")),
          9_000,
        );
      }),
    ]);
  } finally {
    clearTimeout(timer);
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
      const environment =
        process.env.VERCEL_ENV?.trim() || process.env.NODE_ENV || "development";
      const branch =
        environment === "preview"
          ? (process.env.VERCEL_GIT_COMMIT_REF ?? "preview")
          : "";
      const idempotencyKey = `caraway/${fingerprint({ environment, branch }).slice(0, 16)}/${kind}/${id}/${channel}`;
      let accepted = false;
      let providerId: string | undefined;
      try {
        if (channel === "email") {
          const result = await deadline(
            kind === "quote"
              ? sendQuoteNotificationEmail(record.payload as QuoteFormValues, {
                  idempotencyKey,
                })
              : sendContactNotificationEmail(
                  record.payload as ContactFormValues,
                  { idempotencyKey },
                ),
          );
          accepted = result.sent;
          providerId = result.sent ? result.providerId : undefined;
        } else {
          const result = await deadline(
            submitForm({
              schema: kind === "quote" ? quoteFormSchema : contactFormSchema,
              data: record.payload,
              endpointEnvVar:
                kind === "quote" ? "QUOTE_ENDPOINT" : "CONTACT_ENDPOINT",
              label: `${kind} delivery`,
              idempotencyKey,
            }),
          );
          accepted = result.success;
        }
      } catch {
        // Provider requests can have succeeded before a timeout. Email retries
        // retain the same provider key; a webhook is never blindly replayed.
      }
      await finishDelivery(store, kind, id, channel, token, {
        accepted,
        providerId,
        retryable: channel === "email",
        reason: "provider_not_confirmed",
      });
      if (!accepted)
        console.error(
          `[lead-delivery] ${kind}/${id}/${channel} provider_not_confirmed`,
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
