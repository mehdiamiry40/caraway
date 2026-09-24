import { after } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { getLeadConfiguration, type LeadKind } from "@/lib/lead-config";
import { channelConfigurationHash, processLead } from "@/lib/lead-processor";
import {
  fingerprint,
  getLeadStore,
  LEAD_RETENTION_MS,
  MAX_NEW_SUBMISSION_AGE_MS,
  type LeadRecord,
} from "@/lib/lead-store";
import { submissionIssuedAt } from "@/lib/submission-id";
import type { ContactFormValues, QuoteFormValues } from "@/lib/quote-schema";

export type LeadDeliveryResult =
  { success: true } | { success: false; message: string };
const FAILURE_MESSAGE =
  "We couldn't save your request. Please try again or call Caraway on 0481 438 444.";

export function isHoneypotHit(error: {
  issues: Array<{ path: Array<PropertyKey> }>;
}) {
  return error.issues.some((issue) => issue.path.includes("honeypot"));
}

export function rejectInvalidLead(
  formName: string,
  error: { issues: Array<{ path: Array<PropertyKey> }> },
): LeadDeliveryResult {
  if (isHoneypotHit(error)) {
    console.warn(`[honeypot] ${formName} spam detected`, {
      ts: new Date().toISOString(),
    });
    return { success: true };
  }
  return { success: false, message: "Invalid form data" };
}

/** Success means the enquiry is saved, independently of provider availability. */
export async function deliverLead(
  kind: LeadKind,
  payload: QuoteFormValues | ContactFormValues,
  submissionId: unknown,
): Promise<LeadDeliveryResult> {
  const issuedAt = submissionIssuedAt(submissionId);
  if (issuedAt === null || issuedAt > Date.now() + 5 * 60_000) {
    return {
      success: false,
      message: "Please refresh the page before submitting your enquiry.",
    };
  }
  const id = submissionId as string;
  const contentFingerprint = fingerprint({ kind, payload });
  try {
    const admission = await rateLimit("forms-global", "global");
    if (!admission.success) return { success: false, message: FAILURE_MESSAGE };
    const store = getLeadStore();
    let record = await store.read(kind, id);
    if (!record) {
      if (Date.now() - issuedAt > MAX_NEW_SUBMISSION_AGE_MS)
        return {
          success: false,
          message:
            "This enquiry can no longer be retried online. Please call Caraway on 0481 438 444.",
        };
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
        return { success: false, message: FAILURE_MESSAGE };
      const now = Date.now();
      const initial: LeadRecord = {
        id,
        kind,
        payload,
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
      record = (await store.create(initial))
        ? initial
        : await store.read(kind, id);
    }
    if (!record) return { success: false, message: FAILURE_MESSAGE };
    if (record.fingerprint !== contentFingerprint)
      return {
        success: false,
        message:
          "This enquiry already contains different details. Please call Caraway on 0481 438 444 to update it.",
      };
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
  } catch {
    console.error("[lead-capture] storage_or_admission_unavailable");
    return { success: false, message: FAILURE_MESSAGE };
  }
}
