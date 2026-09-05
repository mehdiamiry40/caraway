import { NextResponse } from "next/server";
import {
  isDistributedRateLimitConfigured,
  isLocalRateLimitFallbackAllowed,
} from "@/lib/rate-limit";
import { getLeadConfiguration } from "@/lib/lead-config";

export const dynamic = "force-dynamic";

/**
 * Health check — verifies each public form has at least one working
 * delivery channel configured.
 *
 * Each form (quote, contact) can deliver via two parallel channels:
 *   - webhook  → QUOTE_ENDPOINT / CONTACT_ENDPOINT
 *   - email    → RESEND_API_KEY + (QUOTE|CONTACT)_NOTIFICATION_FROM/TO
 *
 * A form is available if *either* channel is configured. If a form has
 * zero channels the lead capture is broken end-to-end and we fail the
 * check with HTTP 503. Optional failover coverage is reported separately
 * through `fullyRedundant`; lacking a backup channel does not make an
 * otherwise operational service unhealthy. Deployed runtimes also require the
 * distributed limiter because accepted leads and paid upstream calls fail
 * closed when shared enforcement is unavailable.
 *
 * Intentionally does not make outbound network requests — configuration
 * validation only — to avoid cost and DoS abuse vectors against /api/health.
 */
export async function GET() {
  const contactConfiguration = getLeadConfiguration("contact");
  const quoteConfiguration = getLeadConfiguration("quote");
  const contactChannels = {
    webhook: contactConfiguration.webhook.status === "ready",
    email: contactConfiguration.email.status === "ready",
  };
  const quoteChannels = {
    webhook: quoteConfiguration.webhook.status === "ready",
    email: quoteConfiguration.email.status === "ready",
  };

  const contactOk = contactChannels.webhook || contactChannels.email;
  const quoteOk = quoteChannels.webhook || quoteChannels.email;

  const fullyRedundant =
    contactChannels.webhook &&
    contactChannels.email &&
    quoteChannels.webhook &&
    quoteChannels.email;
  const distributedRateLimitConfigured = isDistributedRateLimitConfigured();
  const distributedRateLimitRequired = !isLocalRateLimitFallbackAllowed();
  const leadMonitorEnabled =
    process.env.LEAD_MONITOR_ENABLED === "1" &&
    Boolean(process.env.CRON_SECRET?.trim());

  const isProduction = process.env.VERCEL_ENV === "production";

  // Public callers in production only see the overall status — channel-by-channel
  // details (which integrations are wired up) are ops metadata, not lead-safety
  // signals, so we withhold them from unauthenticated traffic. Preview and
  // development environments still return the full breakdown for debugging.
  const body = (status: "ok" | "error") =>
    isProduction
      ? {
          status,
          checkType: "configuration" as const,
          fullyRedundant,
          distributedRateLimitConfigured,
          leadCaptureConfigured: distributedRateLimitConfigured,
          leadMonitorEnabled,
        }
      : {
          status,
          checkType: "configuration" as const,
          fullyRedundant,
          distributedRateLimitConfigured,
          leadCaptureConfigured: distributedRateLimitConfigured,
          leadMonitorEnabled,
          checks: { contact: contactChannels, quote: quoteChannels },
        };

  const headers = {
    "X-Robots-Tag": "noindex",
    "Cache-Control": "no-store",
  } as const;

  if (
    !contactOk ||
    !quoteOk ||
    (distributedRateLimitRequired && !distributedRateLimitConfigured)
  ) {
    return NextResponse.json(body("error"), { status: 503, headers });
  }

  return NextResponse.json(body("ok"), { status: 200, headers });
}
