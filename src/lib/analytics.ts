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

export function trackEvent(name: EventName, props?: Record<string, AllowedValue>) {
  void name;
  void props;
}
