import { Resend } from "resend";
import { getEnv } from "./env";
import { CONDITION_LABELS, type QuoteFormValues } from "./quote-schema";

/**
 * Outcome of an email notification attempt.
 *
 * - `sent: true`  → Resend accepted the message.
 * - `sent: false` → Email delivery was intentionally skipped because the
 *                   RESEND_API_KEY / QUOTE_NOTIFICATION_* env vars are not
 *                   configured. This is not an error — the webhook channel
 *                   may still be delivering the lead.
 *
 * Hard failures (API errors, network errors) are thrown so the caller can
 * decide how to log them alongside the webhook channel.
 */
export type QuoteEmailResult = { sent: boolean };

interface QuoteEmailContent {
  subject: string;
  text: string;
  html: string;
}

/**
 * Pure, side-effect-free builder for the quote notification email body.
 * Extracted so we can unit-test the formatting without mocking Resend.
 */
export function buildQuoteEmailContent(data: QuoteFormValues): QuoteEmailContent {
  const safeHeader = (s: string) => s.replace(/[\r\n]+/g, " ");
  const subject = safeHeader(
    `New quote request — ${data.make} ${data.model} (${data.year})`,
  );

  const conditionLabel = CONDITION_LABELS[data.condition] ?? data.condition;
  const quoteAmountLabel =
    typeof data.quoteAmount === "number"
      ? `$${data.quoteAmount.toLocaleString()}`
      : null;

  const rows: Array<[string, string]> = [
    ["Name", data.name],
    ["Phone", data.phone],
    ["Make", data.make],
    ["Model", data.model],
    ["Year", String(data.year)],
    ["Condition", conditionLabel],
    ...(quoteAmountLabel
      ? ([["Estimated quote", quoteAmountLabel]] as Array<[string, string]>)
      : []),
    ["Address", data.address || "—"],
    ["Marketing consent", data.marketingConsent ? "opted in" : "no"],
  ];

  const text = [
    "New quote request from caraway.au",
    "",
    ...rows.map(([k, v]) => `${k.padEnd(18)}${v}`),
  ].join("\n");

  const htmlRows = rows
    .map(
      ([k, v]) =>
        `<tr>` +
        `<td style="border:1px solid #E2E8F0;background:#E0F2FE;font-weight:600;padding:8px 12px">${escapeHtml(k)}</td>` +
        `<td style="border:1px solid #E2E8F0;padding:8px 12px">${escapeHtml(v)}</td>` +
        `</tr>`,
    )
    .join("");

  const html =
    `<!doctype html><html><body style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;color:#0F172A;margin:0;padding:24px">` +
    `<h2 style="margin:0 0 12px;font-size:18px;color:#0369A1">New quote request</h2>` +
    `<p style="margin:0 0 16px;color:#475569">Submitted via the caraway.au quote form.</p>` +
    `<table cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:14px">` +
    htmlRows +
    `</table>` +
    `</body></html>`;

  return { subject, text, html };
}

/**
 * Send the quote notification email to the business inbox via Resend.
 *
 * If email delivery is not configured (missing RESEND_API_KEY /
 * QUOTE_NOTIFICATION_FROM / QUOTE_NOTIFICATION_TO), this resolves with
 * `{ sent: false }` instead of throwing — dev mode and webhook-only
 * deployments should continue to work unchanged.
 */
export async function sendQuoteNotificationEmail(
  data: QuoteFormValues,
): Promise<QuoteEmailResult> {
  const env = getEnv();
  const apiKey = env.RESEND_API_KEY;
  const from = env.QUOTE_NOTIFICATION_FROM;
  const to = env.QUOTE_NOTIFICATION_TO;

  if (!apiKey || !from || !to) {
    return { sent: false };
  }

  const { subject, text, html } = buildQuoteEmailContent(data);

  const resend = new Resend(apiKey);
  const result = await resend.emails.send({
    from,
    to,
    subject,
    text,
    html,
  });

  if (result.error) {
    const message =
      typeof result.error === "object" && result.error !== null && "message" in result.error
        ? String((result.error as { message: unknown }).message)
        : String(result.error);
    throw new Error(`Resend error: ${message}`);
  }

  return { sent: true };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
