/** Canonical public site origin (matches former SEO.tsx and breadcrumb-schema). */
export const SITE_URL = "https://caraway.au";

/** Centralised business contact details — import these instead of hard-coding. */
export const BUSINESS = {
  name: "Caraway",
  legalName: "Caraway Pty Ltd",
  abn: "62 351 619 456",
  foundingYear: 2025,
  founder: "Mehdi Emir",
  phone: "1800 227 293",
  phoneFriendly: "1800 CAR AWAY",
  phoneHref: "tel:1800227293",
  email: "info@caraway.au",
  emailHref: "mailto:info@caraway.au",
  location: "Brisbane, QLD",
  locationDetail: "Including Logan, Ipswich, Moreton Bay & Redland Bay",
  hours: "7:00 AM – 7:00 PM",
  hoursDetail: "Monday to Sunday, 7 days a week",
  insured: true,
  googleBusinessUrl: "https://share.google/GXr35RvJCZVi0B2mF",
} as const;

export const MIN_PRICE = 300;
export const MAX_PRICE = 9999;
export const PRICE_RANGE_LABEL = "$300–$9,999";

export const PROMISE_POINTS = [
  "$300–$9,999 cash",
  "Same-day pickup",
  "Free towing always",
  "No RWC needed",
  "All makes & models",
  "7 days a week",
] as const;
