/** Canonical public site origin (matches former SEO.tsx and breadcrumb-schema). */
export const SITE_URL = "https://caraway.au";

/** Centralised business contact details — import these instead of hard-coding. */
export const BUSINESS = {
  name: "Caraway",
  phone: "1800 227 293",
  phoneFriendly: "1800 CAR AWAY",
  phoneHref: "tel:1800227293",
  email: "info@caraway.au",
  emailHref: "mailto:info@caraway.au",
  location: "Brisbane, QLD",
  locationDetail: "Including Logan, Ipswich, Moreton Bay & Redland Bay",
  hours: "7:00 AM – 7:00 PM",
  hoursDetail: "Monday to Sunday, 7 days a week",
} as const;
