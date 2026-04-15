import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Health check — verifies required environment variables are present.
 *
 * Webhook vars (QUOTE_ENDPOINT, CONTACT_ENDPOINT) are critical: without
 * them lead capture is broken end-to-end. Resend vars (RESEND_API_KEY,
 * QUOTE_NOTIFICATION_FROM/TO, CONTACT_NOTIFICATION_FROM/TO) are
 * non-critical: when absent the forms still work via webhook delivery,
 * so we report "degraded" with HTTP 200 instead of failing the check.
 *
 * Intentionally does not make outbound network requests — env-var
 * presence only — to avoid cost and DoS abuse vectors against /api/health.
 */
export async function GET() {
  const isNonEmptyString = (value: unknown): boolean =>
    typeof value === "string" && value.length > 0;

  const quoteEmailOk =
    isNonEmptyString(process.env.RESEND_API_KEY) &&
    isNonEmptyString(process.env.QUOTE_NOTIFICATION_FROM) &&
    isNonEmptyString(process.env.QUOTE_NOTIFICATION_TO);

  const contactEmailOk =
    isNonEmptyString(process.env.RESEND_API_KEY) &&
    isNonEmptyString(process.env.CONTACT_NOTIFICATION_FROM) &&
    isNonEmptyString(process.env.CONTACT_NOTIFICATION_TO);

  const resendOk = quoteEmailOk && contactEmailOk;

  const webhooksOk =
    isNonEmptyString(process.env.QUOTE_ENDPOINT) &&
    isNonEmptyString(process.env.CONTACT_ENDPOINT);

  const checks = { resend: resendOk, webhooks: webhooksOk };

  const headers = {
    "X-Robots-Tag": "noindex",
    "Cache-Control": "no-store",
  } as const;

  if (!webhooksOk) {
    return NextResponse.json(
      { status: "error", checks },
      { status: 503, headers },
    );
  }

  const status = resendOk ? "ok" : "degraded";
  return NextResponse.json({ status, checks }, { status: 200, headers });
}
