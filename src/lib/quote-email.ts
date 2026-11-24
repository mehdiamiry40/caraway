import { Resend, type CreateEmailRequestOptions } from "resend";
import { DeliveryFailure, providerFailureCode } from "./delivery-failure";
import { getLeadConfiguration } from "./lead-config";
import { FORM_FETCH_TIMEOUT_MS } from "@/data/constants";
import { CONDITION_LABELS, type QuoteFormValues } from "./quote-schema";
import {
  POSSIBLE_SPAM_NOTE,
  POSSIBLE_SPAM_SUBJECT_PREFIX,
} from "./possible-spam";

/** Expected price is captured in whole dollars, so no cents are rendered. */
const AUD_FORMATTER = new Intl.NumberFormat("en-AU", {
  style: "currency",
  currency: "AUD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

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
export function buildQuoteEmailContent(
  data: QuoteFormValues,
  options: { possibleSpam?: boolean } = {},
): QuoteEmailContent {
  const safeHeader = (s: string) => s.replace(/[\r\n]+/g, " ");
  const subject = safeHeader(
    `${options.possibleSpam ? POSSIBLE_SPAM_SUBJECT_PREFIX : ""}New quote request — ${data.make} ${data.model} (${data.year})`,
  );

  const conditionLabel = CONDITION_LABELS[data.condition] ?? data.condition;

  const rows: Array<[string, string]> = [
    ["Name", data.name],
    ["Phone", data.phone],
    ["Make", data.make],
    ["Model", data.model],
    ["Year", String(data.year)],
    ["Condition", conditionLabel],
    ["Suburb", data.suburb || "—"],
    [
      "Expected price",
      data.expectedPrice === undefined
        ? "Not supplied"
        : AUD_FORMATTER.format(data.expectedPrice),
    ],
    ...(data.details
      ? ([["Vehicle/access details", data.details]] as Array<[string, string]>)
      : []),
  ];

  const text = [
    "New quote request from caraway.au",
    "",
    ...(options.possibleSpam ? [POSSIBLE_SPAM_NOTE, ""] : []),
    ...rows.map(([key, value]) => `${key}: ${value}`),
  ].join("\n");

  const htmlRows = rows
    .map(
      ([k, v]) =>
        `<tr>` +
        `<td style="border:1px solid #DAD5C8;background:#F1EEE4;font-weight:600;padding:8px 12px">${escapeHtml(k)}</td>` +
        `<td style="border:1px solid #DAD5C8;padding:8px 12px">${escapeHtml(v)}</td>` +
        `</tr>`,
    )
    .join("");

  const html =
    `<!doctype html><html><body style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;color:#18201C;margin:0;padding:24px;background:#FFFFFF">` +
    `<h2 style="margin:0 0 12px;font-size:18px;color:#18201C">New quote request</h2>` +
    `<p style="margin:0 0 16px;color:#576059">Submitted via the caraway.au quote form.</p>` +
    (options.possibleSpam
      ? `<p style="margin:0 0 16px;border:1px solid #DAD5C8;padding:8px 12px">${escapeHtml(POSSIBLE_SPAM_NOTE)}</p>`
      : "") +
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
  options: { idempotencyKey?: string; possibleSpam?: boolean } = {},
): Promise<QuoteEmailResult> {
  const { email } = getLeadConfiguration("quote");
  if (email.status === "disabled") {
    return { sent: false };
  }
  if (email.status === "invalid") {
    throw new DeliveryFailure(
      "Quote email configuration is invalid",
      "configuration_invalid",
    );
  }
  const { apiKey, from, to } = email;

  const { subject, text, html } = buildQuoteEmailContent(data, {
    possibleSpam: options.possibleSpam,
  });

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
    throw new DeliveryFailure(
      "Quote email provider did not confirm acceptance",
      providerFailureCode(result.error),
    );
  }

  const providerId = result.data?.id;
  if (typeof providerId !== "string" || !providerId.trim()) {
    throw new DeliveryFailure(
      "Quote email provider did not return a delivery ID",
      "no_delivery_id",
    );
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
