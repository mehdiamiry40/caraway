// Server-side webhook delivery helper, called only from the submitQuote /
// submitContact server actions. Deliberately NOT a "use server" module: that
// directive would register submitForm itself as a client-invocable action
// endpoint, and it has no reason to be reachable from the browser. The
// schema re-parse below stays as an internal invariant — it produces the
// transformed payload that gets POSTed and keeps this safe to call from
// any future code path.

import type { ZodMiniType } from "zod/mini";
import { FORM_FETCH_TIMEOUT_MS, FORM_MOCK_DELAY_MS } from "@/data/constants";
import { getLeadConfiguration } from "@/lib/lead-config";

const ALLOWED_ENDPOINTS = ["QUOTE_ENDPOINT", "CONTACT_ENDPOINT"] as const;
type AllowedEndpoint = (typeof ALLOWED_ENDPOINTS)[number];

export interface SubmitFormOptions {
  schema: ZodMiniType;
  data: unknown;
  endpointEnvVar: AllowedEndpoint;
  label: string;
  idempotencyKey?: string;
}

/**
 * Result of a single webhook delivery attempt.
 *
 * - `{ success: true }` — webhook (or dev mock) accepted the payload.
 * - `{ success: false, skipped: true }` — the webhook env var isn't set
 *   in production. Treated as "channel intentionally not configured",
 *   not as a failure: the parent action should try other delivery
 *   channels (e.g. Resend email) before surfacing any error to the user,
 *   and should NOT emit an ops error log for this case.
 * - `{ success: false, message }` — a real failure (schema rejection,
 *   allowlist violation, network/HTTP error). The parent action should
 *   log and fall back if possible, or surface the error.
 * - `ambiguous: true` means a request was attempted without a confirmed
 *   acceptance. Retry with the same idempotency key; a receiver may have
 *   processed the payload even when its response failed.
 */
export async function submitForm({
  schema,
  data,
  endpointEnvVar,
  label,
  idempotencyKey,
}: SubmitFormOptions): Promise<
  | { success: true }
  | { success: false; skipped: true; ambiguous: false }
  | { success: false; message: string; ambiguous: boolean }
> {
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    const honeypotHit = parsed.error.issues.some((i) =>
      i.path.includes("honeypot"),
    );
    if (honeypotHit) {
      console.warn(`[honeypot] ${label} spam detected`, {
        ts: new Date().toISOString(),
      });
    }
    return { success: false, message: "Invalid form data", ambiguous: false };
  }

  if (!ALLOWED_ENDPOINTS.includes(endpointEnvVar)) {
    return { success: false, message: "Invalid endpoint", ambiguous: false };
  }

  const { webhook } = getLeadConfiguration(
    endpointEnvVar === "QUOTE_ENDPOINT" ? "quote" : "contact",
  );
  const isDev = process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test";

  if (webhook.status === "disabled") {
    if (isDev) {
      // Dev mock mode: no endpoint configured → fake success so local
      // testing works without a real webhook URL.
      console.warn(
        `[submit-form] ${label}: running in MOCK mode (no ${endpointEnvVar} configured — dev only). Form will fake success without delivering.`,
      );
      await new Promise((resolve) => setTimeout(resolve, FORM_MOCK_DELAY_MS));
      return { success: true };
    }
    // Production without endpoint → channel is intentionally not
    // configured (operator chose email-only delivery). Quiet skip with
    // no error log — the parent action will try the email channel
    // before surfacing an error to the user.
    return { success: false, skipped: true, ambiguous: false };
  }

  if (webhook.status === "invalid") {
    console.error(`[submit-form] ${label} endpoint configuration is invalid`);
    return {
      success: false,
      message: "We couldn't send your request. Please try again or use the form below.",
      ambiguous: false,
    };
  }

  try {
    const response = await fetch(webhook.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(idempotencyKey ? { "Idempotency-Key": idempotencyKey } : {}),
      },
      body: JSON.stringify(parsed.data),
      signal: AbortSignal.timeout(FORM_FETCH_TIMEOUT_MS),
      redirect: "error",
    });

    if (!response.ok) {
      throw new Error(`${label} failed with status ${response.status}`);
    }

    return { success: true };
  } catch {
    // Upstream exception text can contain URLs or submitted data. The caller
    // receives the delivery state; logs retain only the channel label.
    console.error(`[submit-form] ${label} failed after a delivery attempt`);
    return {
      success: false,
      message: `We couldn't send your request. Please try again or use the form below.`,
      ambiguous: true,
    };
  }
}
