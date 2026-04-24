import { NextResponse } from "next/server";
import { validateEndpoint } from "@/lib/validate-endpoint";

export const dynamic = "force-dynamic";

/**
 * Health check — verifies each public form has at least one working
 * delivery channel configured.
 *
 * Each form (quote, contact) can deliver via two parallel channels:
 *   - webhook  → QUOTE_ENDPOINT / CONTACT_ENDPOINT
 *   - email    → RESEND_API_KEY + (QUOTE|CONTACT)_NOTIFICATION_FROM/TO
 *
 * A form is "ok" if *either* channel is configured. If a form has zero
 * channels the lead capture is broken end-to-end and we fail the check
 * with HTTP 503. If both forms have at least one channel but aren't
 * fully redundant (missing webhook OR email on any form), we report
 * "degraded" with HTTP 200 so uptime monitors stay green while still
 * signalling to ops that redundancy is incomplete.
 *
 * Intentionally does not make outbound network requests — configuration
 * validation only — to avoid cost and DoS abuse vectors against /api/health.
 */
export async function GET() {
  const has = (value: unknown): value is string =>
    typeof value === "string" && value.length > 0;
  const isValidEmail = (value: unknown): boolean =>
    has(value) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const isValidWebhook = (value: unknown): boolean =>
    has(value) && validateEndpoint(value);

  const resendApiKeyOk = has(process.env.RESEND_API_KEY);

  const contactChannels = {
    webhook: isValidWebhook(process.env.CONTACT_ENDPOINT),
    email:
      resendApiKeyOk &&
      has(process.env.CONTACT_NOTIFICATION_FROM) &&
      isValidEmail(process.env.CONTACT_NOTIFICATION_TO),
  };
  const quoteChannels = {
    webhook: isValidWebhook(process.env.QUOTE_ENDPOINT),
    email:
      resendApiKeyOk &&
      has(process.env.QUOTE_NOTIFICATION_FROM) &&
      isValidEmail(process.env.QUOTE_NOTIFICATION_TO),
  };

  const contactOk = contactChannels.webhook || contactChannels.email;
  const quoteOk = quoteChannels.webhook || quoteChannels.email;

  const fullyRedundant =
    contactChannels.webhook &&
    contactChannels.email &&
    quoteChannels.webhook &&
    quoteChannels.email;

  const isProduction = process.env.VERCEL_ENV === "production";

  // Public callers in production only see the overall status — channel-by-channel
  // details (which integrations are wired up) are ops metadata, not lead-safety
  // signals, so we withhold them from unauthenticated traffic. Preview and
  // development environments still return the full breakdown for debugging.
  const body = (status: "ok" | "degraded" | "error") =>
    isProduction
      ? { status, fullyRedundant }
      : { status, fullyRedundant, checks: { contact: contactChannels, quote: quoteChannels } };

  const headers = {
    "X-Robots-Tag": "noindex",
    "Cache-Control": "no-store",
  } as const;

  if (!contactOk || !quoteOk) {
    return NextResponse.json(body("error"), { status: 503, headers });
  }

  return NextResponse.json(
    body(fullyRedundant ? "ok" : "degraded"),
    { status: 200, headers },
  );
}
