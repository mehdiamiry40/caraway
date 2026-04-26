/** Canonical public site origin (matches the live production redirect target). */
export const SITE_URL = "https://www.caraway.au";

/** Centralised business contact details — import these instead of hard-coding. */
export const BUSINESS = {
  name: "Caraway",
  legalName: "Caraway Pty Ltd",
  abn: "62 351 619 456",
  foundingYear: 2025,
  founder: "Mehdi Emir",
  phoneDisplay: "0481 438 444",
  phoneTel: "tel:0481438444",
  email: "info@caraway.au",
  emailHref: "mailto:info@caraway.au",
  /** City-level NAP — we don't operate a public yard; pickups happen at the
   *  customer's location, so we don't publish a street address. */
  addressSuburb: "Brisbane",
  addressState: "QLD",
  addressFormatted: "Brisbane, QLD",
  /** Metro label — used with "Greater …" service-area copy. */
  location: "Brisbane, QLD",
  locationDetail: "Including Logan, Ipswich, Moreton Bay & Redland Bay",
  hours: "7:00 AM – 7:00 PM",
  /** Phone and quotes — pickup times are booked separately (see FAQ). */
  hoursDetail:
    "Seven days for calls and quotes. Pickup is usually same- or next-day (subject to truck availability) — we confirm when you book.",
  insured: true,
  googleBusinessUrl: "https://share.google/n0D0gZyISx3hMNECL",
} as const;

export const MIN_PRICE = 200;
export const MAX_PRICE = 9999;
export const PRICE_RANGE_LABEL = "Up to $9,999";

export const LEGAL_DATES = {
  privacyLastUpdated: "April 2026",
  termsLastUpdated: "March 2026",
} as const;

/** The date the current content was deployed / last structurally changed.
 *  Shared by sitemap and JSON-LD so `dateModified` stays stable across
 *  builds instead of drifting to "today" on every deploy. */
export const CONTENT_DEPLOY_DATE = "2026-04-15";

export const PROMISE_POINTS = [
  "Fair offer based on details",
  "Same- or next-day pickup",
  "Free towing always",
  "No RWC needed",
  "All makes & models",
  "7 days a week",
] as const;
