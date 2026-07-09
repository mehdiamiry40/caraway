import { track } from "@vercel/analytics";

type EventName =
  | "cta_click"
  | "estimator_started"
  | "estimator_step_completed"
  | "estimator_quote_shown"
  | "estimator_submitted"
  | "estimator_submit_failed"
  | "estimator_abandoned"
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
  | "authority_link_click";

type AllowedValue = string | number | boolean | null;

/** Event names that static markup may request via `data-track-event`.
 *  Kept as an allowlist so arbitrary DOM content can't mint event names. */
const DATA_ATTRIBUTE_EVENTS = new Set<EventName>([
  "cta_click",
  "hero_cta_click",
  "google_business_click",
  "authority_link_click",
  "internal_link_click",
]);

export function isDataAttributeEvent(name: string): name is EventName {
  return DATA_ATTRIBUTE_EVENTS.has(name as EventName);
}

/** Send a conversion-funnel event to Vercel Web Analytics.
 *  Must never throw — analytics failures cannot break the UI. */
export function trackEvent(name: EventName, props?: Record<string, AllowedValue>) {
  if (typeof window === "undefined") return;
  try {
    track(name, props);
  } catch {
    // Swallow: an ad blocker or unloaded script is not an app error.
  }
}
