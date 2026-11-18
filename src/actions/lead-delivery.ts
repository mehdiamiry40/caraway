import { headers } from "next/headers";
import { after } from "next/server";
import type { ZodMiniType } from "zod/mini";
import {
  getClientIp,
  leadRateLimit,
  outageRateLimit,
} from "@/lib/rate-limit";
import { getLeadConfiguration, type LeadKind } from "@/lib/lead-config";
import {
  channelConfigurationHash,
  processLead,
  sendLeadEmail,
} from "@/lib/lead-processor";
import {
  fingerprint,
  getLeadStore,
  LEAD_RETENTION_MS,
  MAX_NEW_SUBMISSION_AGE_MS,
  type LeadRecord,
  type LeadStore,
} from "@/lib/lead-store";
import { submissionIssuedAt } from "@/lib/submission-id";
import type { ContactFormValues, QuoteFormValues } from "@/lib/quote-schema";

/**
 * `restart` tells the form that this submission ID can never succeed, so it
 * should fetch a new ID and send the same details again as a new enquiry.
 * Without it the visitor's tab keeps the dead ID and every further attempt
 * ends in the same "please call" message.
 */
export type LeadDeliveryResult =
  | { success: true }
  | { success: false; message: string; restart?: true };

const FAILURE_MESSAGE =
  "We couldn't save your request. Please try again or call Caraway on 0481 438 444.";
const TOO_MANY_MESSAGE =
  "Too many requests from this connection. Please wait a minute and try again, or call Caraway on 0481 438 444.";
const FAILURE: LeadDeliveryResult = { success: false, message: FAILURE_MESSAGE };
const INVALID: LeadDeliveryResult = {
  success: false,
  message: "Invalid form data",
};
// The messages below are what a visitor sees only if the restart also fails.
const UNUSABLE_ID: LeadDeliveryResult = {
  success: false,
  message: "Please refresh the page before submitting your enquiry.",
  restart: true,
};
const EXPIRED_ID: LeadDeliveryResult = {
  success: false,
  message:
    "This enquiry can no longer be retried online. Please call Caraway on 0481 438 444.",
  restart: true,
};
const DETAILS_CHANGED: LeadDeliveryResult = {
  success: false,
  message:
    "This enquiry already contains different details. Please call Caraway on 0481 438 444 to update it.",
  restart: true,
};

export function isHoneypotHit(error: {
  issues: Array<{ path: Array<PropertyKey> }>;
}) {
  return error.issues.some((issue) => issue.path.includes("honeypot"));
}

/**
 * Validates a submission, judging the hidden spam-trap field apart from the
 * real ones.
 *
 * A filled trap used to be dropped without a word, which also dropped a real
 * customer whose browser autofill had filled it. Now the trap only labels the
 * enquiry: when every real field is valid it is delivered as possible spam,
 * and when one is not it is refused like any other invalid submission.
 */
export function parseLead<T>(
  kind: LeadKind,
  schema: ZodMiniType<T>,
  data: unknown,
): { valid: true; payload: T; possibleSpam: boolean } | { valid: false } {
  const parsed = schema.safeParse(data);
  if (parsed.success)
    return { valid: true, payload: parsed.data, possibleSpam: false };
  if (!isHoneypotHit(parsed.error) || !data || typeof data !== "object")
    return { valid: false };
  const withoutTrap = schema.safeParse({ ...data, honeypot: "" });
  console.warn(
    `[honeypot] ${kind} trap filled, ${withoutTrap.success ? "details valid: delivering as possible spam" : "details invalid: refused"}`,
  );
  return withoutTrap.success
    ? { valid: true, payload: withoutTrap.data, possibleSpam: true }
    : { valid: false };
}

/** Validate, then save and deliver. The whole of a form's server action. */
export async function submitLead<T extends QuoteFormValues | ContactFormValues>(
  kind: LeadKind,
  schema: ZodMiniType<T>,
  data: unknown,
  submissionId: unknown,
): Promise<LeadDeliveryResult> {
  const lead = parseLead(kind, schema, data);
  if (!lead.valid) return INVALID;
  return deliverLead(kind, lead.payload, submissionId, {
    possibleSpam: lead.possibleSpam,
  });
}

// The store client never retries on its own, so one dropped request would
// otherwise fail the whole enquiry. Reading and create-if-absent are both safe
// to repeat.
async function twice<T>(operation: () => Promise<T>): Promise<T> {
  try {
    return await operation();
  } catch {
    return operation();
  }
}

async function saveAndSchedule(
  store: LeadStore,
  kind: LeadKind,
  id: string,
  issuedAt: number,
  payload: QuoteFormValues | ContactFormValues,
  possibleSpam: boolean,
): Promise<LeadDeliveryResult> {
  const contentFingerprint = fingerprint({ kind, payload });
  let record = await twice(() => store.read(kind, id));
  if (!record) {
    if (Date.now() - issuedAt > MAX_NEW_SUBMISSION_AGE_MS) return EXPIRED_ID;
    const config = getLeadConfiguration(kind);
    const localMock =
      (process.env.NODE_ENV === "development" ||
        process.env.NODE_ENV === "test") &&
      config.webhook.status === "disabled";
    if (
      !localMock &&
      config.webhook.status !== "ready" &&
      config.email.status !== "ready"
    )
      return FAILURE;
    const now = Date.now();
    const initial: LeadRecord = {
      id,
      kind,
      payload,
      ...(possibleSpam ? { possibleSpam: true as const } : {}),
      fingerprint: contentFingerprint,
      version: 1,
      createdAt: now,
      expiresAt: now + LEAD_RETENTION_MS,
      channels: {
        webhook: {
          state:
            config.webhook.status === "ready" || localMock
              ? "pending"
              : "disabled",
          configurationHash: channelConfigurationHash(kind, "webhook"),
          attempts: 0,
          nextAttemptAt: now,
        },
        email: {
          state: config.email.status === "ready" ? "pending" : "disabled",
          configurationHash: channelConfigurationHash(kind, "email"),
          attempts: 0,
          nextAttemptAt: now,
        },
      },
    };
    record = (await twice(() => store.create(initial)))
      ? initial
      : await twice(() => store.read(kind, id));
  }
  if (!record) return FAILURE;
  if (record.fingerprint !== contentFingerprint) return DETAILS_CHANGED;
  // The cron also drains this saved queue if the process ends before after()
  // runs. Never return success until the capture write has been acknowledged.
  after(async () => {
    try {
      await processLead(kind, id, store);
    } catch {
      console.error(`[lead-delivery] ${kind}/${id} processing_deferred`);
    }
  });
  return { success: true };
}

/**
 * Storage cannot be reached, so the enquiry cannot be saved, queued or
 * retried. It is emailed once, now, and the visitor is told it worked only if
 * the email provider accepts it. The email carries the same provider key the
 * queue would have used, so a write that did land despite the error cannot
 * turn into a second email. The webhook is not attempted: without a saved
 * record nothing would stop it being sent twice.
 */
async function sendWithoutSaving(
  kind: LeadKind,
  id: string,
  issuedAt: number,
  payload: QuoteFormValues | ContactFormValues,
  possibleSpam: boolean,
): Promise<LeadDeliveryResult> {
  // Without the store nobody can tell whether this old ID was already used.
  if (Date.now() - issuedAt > MAX_NEW_SUBMISSION_AGE_MS) return EXPIRED_ID;
  const outcome = await sendLeadEmail(kind, id, payload, { possibleSpam });
  if (outcome.accepted) {
    console.error(
      `[lead-capture] ${kind}/${id} storage_unavailable emailed_without_saving`,
    );
    return { success: true };
  }
  console.error(
    `[lead-capture] ${kind}/${id} storage_unavailable email_not_confirmed ${outcome.failure}`,
  );
  return FAILURE;
}

/**
 * Success means the enquiry is saved, independently of provider availability.
 * The one exception is a storage outage, where success means the email
 * provider accepted it (see sendWithoutSaving).
 */
export async function deliverLead(
  kind: LeadKind,
  payload: QuoteFormValues | ContactFormValues,
  submissionId: unknown,
  options: { possibleSpam?: boolean } = {},
): Promise<LeadDeliveryResult> {
  const issuedAt = submissionIssuedAt(submissionId);
  if (issuedAt === null || issuedAt > Date.now() + 5 * 60_000)
    return UNUSABLE_ID;
  const id = submissionId as string;
  const possibleSpam = options.possibleSpam === true;

  let countersDown: boolean;
  try {
    // The request proxy also limits form posts per visitor, but its matcher
    // skips every request that carries a prefetch header, so that limit alone
    // can be avoided by sending one. This check runs inside the action and
    // comes first, so one sender cannot use up the shared allowance below.
    const visitor = await leadRateLimit(
      "forms",
      `lead:${getClientIp({ headers: await headers() })}`,
    );
    if (!visitor.success)
      return {
        success: false,
        message:
          visitor.mode === "unavailable" ? FAILURE_MESSAGE : TOO_MANY_MESSAGE,
      };
    // Once one check has had to count locally the shared counters are not
    // asked again: each failed call costs the visitor a timeout.
    const admission =
      visitor.mode === "outage"
        ? outageRateLimit("forms-global", "global")
        : await leadRateLimit("forms-global", "global");
    if (!admission.success) return FAILURE;
    countersDown = visitor.mode === "outage" || admission.mode === "outage";
  } catch {
    console.error("[lead-capture] storage_or_admission_unavailable");
    return FAILURE;
  }

  // The counters and the saved enquiries live in one database. When the
  // counters are unreachable, waiting on that database again only delays the
  // visitor, so the enquiry goes straight to the direct send.
  if (!countersDown) {
    let store: LeadStore;
    try {
      store = getLeadStore();
    } catch {
      // Storage that was never configured is a setup mistake, not an outage.
      console.error("[lead-capture] storage_or_admission_unavailable");
      return FAILURE;
    }
    try {
      return await saveAndSchedule(
        store,
        kind,
        id,
        issuedAt,
        payload,
        possibleSpam,
      );
    } catch {
      // Storage failed twice in a row. Fall through to the direct send.
    }
  }
  return sendWithoutSaving(kind, id, issuedAt, payload, possibleSpam);
}
