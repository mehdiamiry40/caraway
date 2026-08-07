/** Canonical public site origin (matches the live production redirect target). */
export const SITE_URL = "https://caraway.au";

/** Centralised business contact details — import these instead of hard-coding. */
export const BUSINESS = {
  name: "Caraway",
  legalName: "Mehdi Emir",
  businessStructure: "Sole trader",
  abn: "62 351 619 456",
  abrUrl: "https://abr.business.gov.au/ABN/View?abn=62351619456",
  foundingYear: 2025,
  founder: "Mehdi Emir",
  phoneDisplay: "0481 438 444",
  phoneE164: "+61481438444",
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
  locationDetail: "Including Logan, Ipswich, Moreton Bay & Redlands",
  hours: "7:00 AM – 7:00 PM",
  /** Phone and quotes — pickup times are booked separately (see FAQ). */
  hoursDetail:
    "Seven days for calls and quotes. Collection timing is confirmed for each accepted job.",
  googleBusinessUrl: "https://share.google/n0D0gZyISx3hMNECL",
} as const;

export const MIN_PRICE = 200;
export const MAX_PRICE = 9999;
export const PRICE_RANGE_LABEL = "Vehicle-specific quotes";

export const LEGAL_DATE_ISO = {
  privacyLastUpdated: "2026-06-11",
  termsLastUpdated: "2026-08-07",
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

/** Homepage metadata, H1, and entity focus were retargeted to a brand hub so
 *  the dedicated service pages can own the two primary commercial queries. */
export const HOME_CONTENT_UPDATED = "2026-08-07";

/** Business identity and operating-terms copy materially reviewed in August 2026. */
export const ABOUT_CONTENT_UPDATED = "2026-08-07";

/** FAQ metadata and collection/payment wording materially reviewed in August 2026. */
export const FAQ_CONTENT_UPDATED = "2026-08-07";

/** /how-it-works was rewritten with page-unique content in July 2026 after
 *  GSC clustered it as a duplicate of the homepage ("Google chose different
 *  canonical than user"). Shared by the sitemap entry and the page's
 *  WebPage.dateModified so the recrawl signal is honest and consistent. */
export const HOW_IT_WORKS_CONTENT_UPDATED = "2026-08-07";

/** Service catalogue materially consolidated and retitled in August 2026. */
export const SERVICES_CONTENT_UPDATED = "2026-08-07";

export const PROMISE_POINTS = [
  "Offer based on supplied details",
  "Collection window confirmed",
  "Pickup included when we buy",
  "Vehicle checked before loading",
  "Payment arrangement confirmed",
  "Receipt and buyer details",
] as const;
