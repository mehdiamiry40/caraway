/** Canonical public site origin (matches the live production redirect target). */
export const SITE_URL = "https://caraway.au";

/** Google Ads (gtag.js) conversion-measurement tag. This is a public
 *  identifier — it ships in client HTML by design. Loaded only on the live
 *  production site (see RootLayout / GoogleTag) so preview and local builds
 *  don't fire real conversions. The gtag domains are allow-listed in the CSP
 *  (next.config.ts). */
export const GOOGLE_ADS_TAG_ID = "AW-856495318";

/** Centralised business contact details — import these instead of hard-coding. */
export const BUSINESS = {
  name: "Caraway",
  legalName: "Mehdi Emir",
  businessStructure: "Sole trader",
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
export const PRICE_RANGE_LABEL = "Up to $9,999 for selected vehicles";

export const LEGAL_DATE_ISO = {
  privacyLastUpdated: "2026-06-01",
  termsLastUpdated: "2026-06-01",
} as const;

const LEGAL_MONTH_LABELS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

function legalDateLabel(iso: string): string {
  const [year, month] = iso.split("-");
  const monthLabel = LEGAL_MONTH_LABELS[Number(month) - 1];
  return monthLabel && year ? `${monthLabel} ${year}` : iso;
}

export const LEGAL_DATES = {
  privacyLastUpdated: legalDateLabel(LEGAL_DATE_ISO.privacyLastUpdated),
  termsLastUpdated: legalDateLabel(LEGAL_DATE_ISO.termsLastUpdated),
} as const;

/** The date the current content was deployed / last structurally changed.
 *  Shared by sitemap and JSON-LD so `dateModified` stays stable across
 *  builds instead of drifting to "today" on every deploy. */
export const CONTENT_DEPLOY_DATE = "2026-04-15";

export const PROMISE_POINTS = [
  "Fair offer based on details",
  "Same- or next-day pickup",
  "Free towing always",
  "Cars assessed as-is",
  "All makes & models",
  "7 days a week",
] as const;
