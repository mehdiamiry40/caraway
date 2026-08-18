import { track } from "@vercel/analytics";

type EventName =
  | "cta_click"
  | "quote_form_submitted"
  | "contact_form_submitted"
  | "lead_submitted"
  | "phone_click"
  | "email_click"
  | "location_viewed"
  | "faq_opened"
  | "internal_link_click"
  | "hero_cta_click"
  | "scroll_to_quote_click"
  | "google_business_click"
  | "authority_link_click"
  | "chat_opened"
  | "chat_message_sent";

type AllowedValue = string | number | boolean | null;

/**
 * Custom-event bridge to Vercel Web Analytics. The beacon posts to
 * `/_vercel/insights/*` on our own origin, so the strict
 * `connect-src 'self'` CSP in next.config.ts needs no carve-out.
 * `track` is a safe no-op outside the Vercel runtime (e.g. local dev).
 */
export function trackEvent(name: EventName, props?: Record<string, AllowedValue>) {
  try {
    track(name, props);
  } catch {
    // Analytics must never break the UI.
  }
}
