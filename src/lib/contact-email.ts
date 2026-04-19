import { Resend } from "resend";
import { getEnv } from "./env";
import type { ContactFormValues } from "./quote-schema";

/**
 * Outcome of an email notification attempt.
 *
 * - `sent: true`  → Resend accepted the message.
 * - `sent: false` → Email delivery was intentionally skipped because the
 *                   RESEND_API_KEY / CONTACT_NOTIFICATION_* env vars are
 *                   not configured. This is not an error — the webhook
 *                   channel may still be delivering the lead.
 *
 * Hard failures (API errors, network errors) are thrown so the caller can
 * decide how to log them alongside the webhook channel.
 */
export type ContactEmailResult = { sent: boolean };

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
        `<td style="border:1px solid #E2E8F0;background:#E0F2FE;font-weight:600;padding:8px 12px">${escapeHtml(k)}</td>` +
        `<td style="border:1px solid #E2E8F0;padding:8px 12px">${escapeHtml(v)}</td>` +
        `</tr>`,
    )
    .join("");

  const messageHtml = escapeHtml(data.message).replace(/\n/g, "<br>");

  const html =
    `<!doctype html><html><body style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;color:#0F172A;margin:0;padding:24px">` +
    `<h2 style="margin:0 0 12px;font-size:18px;color:#0369A1">New contact message</h2>` +
    `<p style="margin:0 0 16px;color:#475569">Submitted via the caraway.au contact form.</p>` +
    `<table cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:14px;margin-bottom:16px">` +
    htmlRows +
    `</table>` +
    `<h3 style="margin:0 0 8px;font-size:15px">Message</h3>` +
    `<div style="white-space:pre-wrap;border:1px solid #E2E8F0;background:#E0F2FE;padding:12px;border-radius:6px;font-size:14px;line-height:1.5">` +
    messageHtml +
    `</div>` +
    `</body></html>`;

  return { subject, text, html };
}

/**
 * Send the contact notification email to the business inbox via Resend.
 *
 * If email delivery is not configured (missing RESEND_API_KEY /
 * CONTACT_NOTIFICATION_FROM / CONTACT_NOTIFICATION_TO), this resolves
 * with `{ sent: false }` instead of throwing — dev mode and webhook-only
 * deployments should continue to work unchanged.
 */
export async function sendContactNotificationEmail(
  data: ContactFormValues,
): Promise<ContactEmailResult> {
  const env = getEnv();
  const apiKey = env.RESEND_API_KEY;
  const from = env.CONTACT_NOTIFICATION_FROM;
  const to = env.CONTACT_NOTIFICATION_TO;

  if (!apiKey || !from || !to) {
    return { sent: false };
  }

  const { subject, text, html } = buildContactEmailContent(data);

  const resend = new Resend(apiKey);
  const result = await resend.emails.send({
    from,
    to,
    subject,
    text,
    html,
    replyTo: data.email,
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
