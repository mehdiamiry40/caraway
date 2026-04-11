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
  | "phone_click"
  | "faq_opened"
  | "internal_link_click"
  | "hero_cta_click";

type AllowedValue = string | number | boolean | null;

export function trackEvent(name: EventName, props?: Record<string, AllowedValue>) {
  try {
    track(name, props);
  } catch {
    // swallow in SSR / when analytics blocked
  }
}
