import { Resend, type CreateEmailRequestOptions } from "resend";
import { getLeadConfiguration } from "./lead-config";
import { FORM_FETCH_TIMEOUT_MS } from "@/data/constants";
import type { ContactFormValues } from "./quote-schema";

/**
 * Outcome of an email notification attempt.
 *
 * - `sent: true`  → Resend accepted the message.
 * - `sent: false` → Email delivery was intentionally skipped because the
 *                   CONTACT_NOTIFICATION_* addresses are not configured.
 *                   This is not an error — the webhook
 *                   channel may still be delivering the lead.
 *
 * Invalid configuration and hard failures are thrown so the caller can
 * decide how to log them alongside the webhook channel.
 */
export type ContactEmailResult =
  | { sent: true; providerId: string }
  | { sent: false };

interface ContactEmailContent {
  subject: string;
  text: string;
  html: string;
}

/**
 * Pure, side-effect-free builder for the contact notification email body.
 * Extracted so we can unit-test the formatting without mocking Resend.
 */
export function buildContactEmailContent(data: ContactFormValues): ContactEmailContent {
  const safeHeader = (s: string) => s.replace(/[\r\n]+/g, " ");
  const subject = safeHeader(`New contact message — ${data.name}`);

  const rows: Array<[string, string]> = [
    ["Name", data.name],
    ["Email", data.email],
    ["Phone", data.phone || "—"],
    ["Marketing consent", data.marketingConsent ? "opted in" : "no"],
  ];

  const text = [
    "New contact message from caraway.au",
    "",
    ...rows.map(([k, v]) => `${k.padEnd(18)}${v}`),
    "",
    "Message:",
    data.message,
  ].join("\n");

  const htmlRows = rows
    .map(
      ([k, v]) =>
        `<tr>` +
        `<td style="border:1px solid #D9D1C7;background:#EBE6E0;font-weight:600;padding:8px 12px">${escapeHtml(k)}</td>` +
        `<td style="border:1px solid #D9D1C7;padding:8px 12px">${escapeHtml(v)}</td>` +
        `</tr>`,
    )
    .join("");

  const messageHtml = escapeHtml(data.message).replace(/\n/g, "<br>");

  const html =
    `<!doctype html><html><body style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;color:#1E2B45;margin:0;padding:24px;background:#FFFFFF">` +
    `<h2 style="margin:0 0 12px;font-size:18px;color:#041C44">New contact message</h2>` +
    `<p style="margin:0 0 16px;color:#5A6275">Submitted via the caraway.au contact form.</p>` +
    `<table cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:14px;margin-bottom:16px">` +
    htmlRows +
    `</table>` +
    `<h3 style="margin:0 0 8px;font-size:15px">Message</h3>` +
    `<div style="white-space:pre-wrap;border:1px solid #D9D1C7;background:#FFFFFF;padding:12px;border-radius:4px;font-size:14px;line-height:1.5">` +
    messageHtml +
    `</div>` +
    `</body></html>`;

  return { subject, text, html };
}

/**
 * Send the contact notification email to the business inbox via Resend.
 *
 * No notification addresses means `{ sent: false }`. Partial or malformed
 * configuration is rejected before sending; provider acceptance requires an ID.
 */
export async function sendContactNotificationEmail(
  data: ContactFormValues,
  options: { idempotencyKey?: string } = {},
): Promise<ContactEmailResult> {
  const { email } = getLeadConfiguration("contact");
  if (email.status === "disabled") {
    return { sent: false };
  }
  if (email.status === "invalid") {
    throw new Error("Contact email configuration is invalid");
  }
  const { apiKey, from, to } = email;

  const { subject, text, html } = buildContactEmailContent(data);

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
    replyTo: data.email,
  }, requestOptions);

  if (result.error) {
    throw new Error("Contact email provider did not confirm acceptance");
  }

  const providerId = result.data?.id;
  if (typeof providerId !== "string" || !providerId.trim()) {
    throw new Error("Contact email provider did not return a delivery ID");
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
