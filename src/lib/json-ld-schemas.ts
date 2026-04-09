/** Site-wide JSON-LD objects (same semantics as former SEO.tsx global injection). */

import { SITE_URL } from "@/lib/site";
import { reviews } from "@/data/reviews";

const NAP = {
  name: "Caraway — Cash for Cars Brisbane",
  phone: "1800 227 293",
  email: "info@caraway.au",
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

/** Reusable publisher object for BlogPosting / Article schemas. */
export const publisherSchema = {
  "@type": "Organization" as const,
  "@id": `${SITE_URL}/#organization`,
  name: NAP.name,
  url: SITE_URL,
  logo: {
    "@type": "ImageObject" as const,
    url: `${SITE_URL}/images/logo.png`,
    width: 600,
    height: 60,
  },
};

/* ---------- Compute aggregate rating from reviews data ---------- */
const ratingValue = (
  reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
).toFixed(1);

export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "AutoDealer"],
  "@id": `${SITE_URL}/#business`,
  name: NAP.name,
  url: SITE_URL,
  logo: `${SITE_URL}/images/logo.png`,
  image: `${SITE_URL}/images/tow-truck-hero.webp`,
  telephone: NAP.phone,
  email: NAP.email,
  priceRange: "$$",
  currenciesAccepted: "AUD",
  paymentAccepted: "Cash",
  description:
    "Cash for cars Brisbane: Caraway pays cash on pickup for any make or condition — up to $9,999. Free towing and same-day service across Greater Brisbane. Call 1800 227 293.",
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
    reviewCount: String(reviews.length),
    bestRating: "5",
    worstRating: "1",
  },
};

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: NAP.name,
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/images/logo.png`,
    width: 600,
    height: 60,
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
  sameAs: [
    // Add your social / GMB profile URLs here as they become available
    // "https://www.google.com/maps/place/...",
    // "https://www.facebook.com/carawayau",
  ],
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: "Caraway — Cash for Cars Brisbane",
  alternateName: "Caraway Cash for Cars",
  url: SITE_URL,
  description:
    "Cash for cars Brisbane: free quotes, free removal, and cash paid on pickup. Servicing Greater Brisbane 7 days a week.",
  publisher: { "@id": `${SITE_URL}/#organization` },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/?s={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
  inLanguage: "en-AU",
};
