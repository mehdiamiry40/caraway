/** Canonical public site origin (matches former SEO.tsx and breadcrumb-schema). */
export const SITE_URL = "https://caraway.au";

/** Centralised business contact details — import these instead of hard-coding. */
export const BUSINESS = {
  name: "Caraway",
  legalName: "Caraway Pty Ltd",
  abn: "62 351 619 456",
  foundingYear: 2025,
  founder: "Mehdi Emir",
  phone: "0481 438 444",
  phoneFriendly: "0481 438 444",
  phoneHref: "tel:0481438444",
  email: "info@caraway.au",
  emailHref: "mailto:info@caraway.au",
  /** Street address for NAP / footer (pickups are at the customer's location). */
  streetAddress: "20 Bonemill Rd",
  addressSuburb: "Runcorn",
  addressState: "QLD",
  postalCode: "4113",
  addressFormatted: "20 Bonemill Rd, Runcorn QLD 4113",
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

export const MIN_PRICE = 300;
export const MAX_PRICE = 9999;
export const PRICE_RANGE_LABEL = "$300–$9,999";

export const LEGAL_DATES = {
  privacyLastUpdated: "April 2026",
  termsLastUpdated: "March 2026",
} as const;

export const PROMISE_POINTS = [
  "$300–$9,999 cash",
  "Same- or next-day pickup",
  "Free towing always",
  "No RWC needed",
  "All makes & models",
  "7 days a week",
] as const;
