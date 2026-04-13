/** Site-wide JSON-LD objects (same semantics as former SEO.tsx global injection). */

import { SITE_URL, BUSINESS } from "@/lib/site";
import { reviews } from "@/data/reviews";

const NAP = {
  name: `${BUSINESS.name} — Cash for Cars Brisbane`,
  phone: BUSINESS.phone,
  email: BUSINESS.email,
  addressLocality: "Brisbane",
  addressRegion: "QLD",
  postalCode: "4000",
  addressCountry: "AU",
  latitude: -27.4698,
  longitude: 153.0251,
};

const openingHours = {
  "@type": "OpeningHoursSpecification" as const,
  dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
  opens: "07:00",
  closes: "19:00",
};

const SAME_AS = [
  BUSINESS.googleBusinessUrl,
];

/* ---------- Compute aggregate rating from reviews data ---------- */
const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
const ratingValue = Math.round(avg * 10) / 10;

export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "AutomotiveBusiness"],
  "@id": `${SITE_URL}/#business`,
  name: NAP.name,
  legalName: BUSINESS.legalName,
  taxID: BUSINESS.abn,
  foundingDate: String(BUSINESS.foundingYear),
  founder: {
    "@type": "Person" as const,
    name: BUSINESS.founder,
  },
  url: SITE_URL,
  logo: {
    "@type": "ImageObject" as const,
    url: `${SITE_URL}/images/logo.webp`,
    width: 512,
    height: 279,
  },
  image: `${SITE_URL}/images/tow-truck-hero.webp`,
  telephone: NAP.phone,
  email: NAP.email,
  priceRange: "$$",
  currenciesAccepted: "AUD",
  paymentAccepted: "Cash, Bank Transfer",
  description:
    "Cash for cars Brisbane: Caraway pays cash on pickup for any make or condition — up to $9,999. Free towing and same-day service across Greater Brisbane. Call 1800 227 293.",
  // Caraway is a service-area business with no physical retail storefront.
  // We declare locality-level address only (no streetAddress) and rely on
  // serviceArea / areaServed to describe the coverage footprint.
  address: {
    "@type": "PostalAddress",
    addressLocality: NAP.addressLocality,
    addressRegion: NAP.addressRegion,
    postalCode: NAP.postalCode,
    addressCountry: NAP.addressCountry,
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: NAP.latitude,
    longitude: NAP.longitude,
  },
  serviceArea: {
    "@type": "GeoCircle",
    geoMidpoint: {
      "@type": "GeoCoordinates",
      latitude: NAP.latitude,
      longitude: NAP.longitude,
    },
    geoRadius: 100000,
  },
  areaServed: [
    { "@type": "City", name: "Brisbane" },
    { "@type": "City", name: "Ipswich" },
    { "@type": "City", name: "Logan" },
    { "@type": "City", name: "Redland Bay" },
    { "@type": "City", name: "Moreton Bay" },
  ],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: NAP.phone,
    contactType: "customer service",
    areaServed: "AU",
    availableLanguage: "English",
    hoursAvailable: openingHours,
  },
  openingHoursSpecification: [openingHours],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Cash for Cars Services",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Cash for Cars Brisbane" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Free Car Removal Brisbane" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Scrap Car Buyers Brisbane" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Damaged Car Buyers Brisbane" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Unwanted Car Removal Brisbane" } },
    ],
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue,
    reviewCount: reviews.length,
    bestRating: 5,
    worstRating: 1,
  },
  sameAs: SAME_AS,
};

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: NAP.name,
  legalName: BUSINESS.legalName,
  taxID: BUSINESS.abn,
  foundingDate: String(BUSINESS.foundingYear),
  founder: {
    "@type": "Person" as const,
    name: BUSINESS.founder,
  },
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/images/logo.webp`,
    width: 512,
    height: 279,
  },
  telephone: NAP.phone,
  email: NAP.email,
  contactPoint: {
    "@type": "ContactPoint",
    telephone: NAP.phone,
    contactType: "customer service",
    areaServed: "AU",
    availableLanguage: "English",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: NAP.addressLocality,
    addressRegion: NAP.addressRegion,
    postalCode: NAP.postalCode,
    addressCountry: NAP.addressCountry,
  },
  sameAs: SAME_AS,
};

/** Reusable publisher object for BlogPosting / Article schemas. */
export const publisherSchema = {
  "@type": "Organization" as const,
  "@id": `${SITE_URL}/#organization`,
  name: NAP.name,
  url: SITE_URL,
  logo: {
    "@type": "ImageObject" as const,
    url: `${SITE_URL}/images/logo.webp`,
    width: 512,
    height: 279,
  },
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: `${BUSINESS.name} — Cash for Cars Brisbane`,
  alternateName: "Caraway Cash for Cars",
  url: SITE_URL,
  description:
    "Cash for cars Brisbane: free quotes, free removal, and cash paid on pickup. Servicing Greater Brisbane 7 days a week.",
  publisher: { "@id": `${SITE_URL}/#organization` },
  inLanguage: "en-AU",
  // SearchAction removed: LocationsFilter uses client-side state only and
  // does not support a ?q= query parameter.
};
