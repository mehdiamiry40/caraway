import { Resend, type CreateEmailRequestOptions } from "resend";
import { getLeadConfiguration } from "./lead-config";
import { FORM_FETCH_TIMEOUT_MS } from "@/data/constants";
import { CONDITION_LABELS, type QuoteFormValues } from "./quote-schema";

/**
 * Outcome of an email notification attempt.
 *
 * - `sent: true`  → Resend accepted the message.
 * - `sent: false` → Email delivery was intentionally skipped because the
 *                   QUOTE_NOTIFICATION_* addresses are not configured.
 *                   This is not an error — the webhook channel
 *                   may still be delivering the lead.
 *
 * Invalid configuration and hard failures are thrown so the caller can
 * decide how to log them alongside the webhook channel.
 */
export type QuoteEmailResult =
  | { sent: true; providerId: string }
  | { sent: false };

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

  const rows: Array<[string, string]> = [
    ["Name", data.name],
    ["Phone", data.phone],
    ["Make", data.make],
    ["Model", data.model],
    ["Year", String(data.year)],
    ["Condition", conditionLabel],
    ["Address", data.address || "—"],
    ...(data.details
      ? ([["Vehicle/access details", data.details]] as Array<[string, string]>)
      : []),
  ];

  const text = [
    "New quote request from caraway.au",
    "",
    ...rows.map(([key, value]) => `${key}: ${value}`),
  ].join("\n");

  const htmlRows = rows
    .map(
      ([k, v]) =>
        `<tr>` +
        `<td style="border:1px solid #D4D9DD;background:#EBF5FA;font-weight:600;padding:8px 12px">${escapeHtml(k)}</td>` +
        `<td style="border:1px solid #D4D9DD;padding:8px 12px">${escapeHtml(v)}</td>` +
        `</tr>`,
    )
    .join("");

  const html =
    `<!doctype html><html><body style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;color:#303030;margin:0;padding:24px;background:#FFFFFF">` +
    `<h2 style="margin:0 0 12px;font-size:18px;color:#2C5696">New quote request</h2>` +
    `<p style="margin:0 0 16px;color:#59636E">Submitted via the caraway.au quote form.</p>` +
    `<table cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:14px">` +
    htmlRows +
    `</table>` +
    `</body></html>`;

  return { subject, text, html };
}

/**
 * Send the quote notification email to the business inbox via Resend.
 *
 * No notification addresses means `{ sent: false }`. Partial or malformed
 * configuration is rejected before sending; provider acceptance requires an ID.
 */
export async function sendQuoteNotificationEmail(
  data: QuoteFormValues,
  options: { idempotencyKey?: string } = {},
): Promise<QuoteEmailResult> {
  const { email } = getLeadConfiguration("quote");
  if (email.status === "disabled") {
    return { sent: false };
  }
  if (email.status === "invalid") {
    throw new Error("Quote email configuration is invalid");
  }
  const { apiKey, from, to } = email;

  const { subject, text, html } = buildQuoteEmailContent(data);

  const resend = new Resend(apiKey);
  // The installed SDK forwards request options to fetch, although its public
  // type currently omits RequestInit.signal.
  const requestOptions: CreateEmailRequestOptions & Pick<RequestInit, "signal"> = {
    idempotencyKey: options.idempotencyKey,
    signal: AbortSignal.timeout(FORM_FETCH_TIMEOUT_MS),
  };
  const result = await resend.emails.send({
    from,
    to,
    subject,
    text,
    html,
  }, requestOptions);

  if (result.error) {
    throw new Error("Quote email provider did not confirm acceptance");
  }

  const providerId = result.data?.id;
  if (typeof providerId !== "string" || !providerId.trim()) {
    throw new Error("Quote email provider did not return a delivery ID");
  }
  return { sent: true, providerId };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
