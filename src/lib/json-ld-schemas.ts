/** Site-wide JSON-LD objects (same semantics as former SEO.tsx global injection). */

import { SITE_URL, BUSINESS } from "@/lib/site";

const NAP = {
  name: `${BUSINESS.name} — Cash for Cars Brisbane`,
  phone: BUSINESS.phoneDisplay,
  email: BUSINESS.email,
  addressLocality: BUSINESS.addressSuburb,
  addressRegion: BUSINESS.addressState,
  addressCountry: "AU",
  /** Brisbane CBD reference point; serviceArea below covers pickup radius. */
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
  priceRange: "$200–$9,999",
  currenciesAccepted: "AUD",
  paymentAccepted: "Cash, Bank Transfer",
  description: `Cash for cars Brisbane: Caraway gives fair cash offers based on vehicle details, with free towing and payment on pickup. Selected vehicles may receive offers up to $9,999. Call ${BUSINESS.phoneDisplay}.`,
  // City-level address only; pickups happen at the customer's property (serviceArea).
  address: {
    "@type": "PostalAddress",
    addressLocality: NAP.addressLocality,
    addressRegion: NAP.addressRegion,
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
  slogan: "Cash for cars Brisbane — paid on pickup, free towing, any condition.",
  knowsAbout: [
    "Cash for cars Brisbane",
    "Free car removal",
    "Vehicle valuation",
    "Scrap car buyers",
    "Damaged car removal",
  ],
  keywords: "cash for cars Brisbane, sell my car Brisbane, free car removal, scrap car buyers Brisbane",
  sameAs: SAME_AS,
};

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: NAP.name,
  legalName: BUSINESS.legalName,
  taxID: BUSINESS.abn,
  slogan: "Cash for cars Brisbane — paid on pickup, free towing, any condition.",
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
    "Cash for cars Brisbane: free quotes, free removal, and cash paid on pickup — usually same- or next-day. Servicing Greater Brisbane 7 days a week.",
  keywords: "cash for cars Brisbane, sell my car Brisbane, free car removal Brisbane, scrap car buyers Brisbane",
  publisher: { "@id": `${SITE_URL}/#organization` },
  inLanguage: "en-AU",
  // SearchAction removed: LocationsFilter uses client-side state only and
  // does not support a ?q= query parameter.
};

/* ---------- Schema builders for call sites ---------- */

export function breadcrumbListSchema(
  items: Array<{ name: string; item: string }>,
) {
  // The last crumb is the current page; anchor the list's @id to it so every
  // page emits the same BreadcrumbList shape (see src/lib/breadcrumb-schema.ts,
  // which adapts {label, href} call sites onto this builder).
  const currentPageUrl = items[items.length - 1]?.item;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    ...(currentPageUrl ? { "@id": `${currentPageUrl}#breadcrumbs` } : {}),
    numberOfItems: items.length,
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.item,
    })),
  };
}

export function faqPageSchema(
  faqs: Array<{ question: string; answer: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

type HowToStep = { name: string; text: string; url?: string };

export function howToSchema(params: {
  name: string;
  description: string;
  totalTime?: string;
  estimatedCost?: { currency: string; value: string };
  steps: HowToStep[];
  supply?: string[];
  tool?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: params.name,
    description: params.description,
    ...(params.totalTime ? { totalTime: params.totalTime } : {}),
    ...(params.estimatedCost
      ? {
          estimatedCost: {
            "@type": "MonetaryAmount",
            currency: params.estimatedCost.currency,
            value: params.estimatedCost.value,
          },
        }
      : {}),
    step: params.steps.map((s) => ({
      "@type": "HowToStep",
      name: s.name,
      text: s.text,
      ...(s.url ? { url: s.url } : {}),
    })),
    ...(params.supply
      ? {
          supply: params.supply.map((name) => ({
            "@type": "HowToSupply",
            name,
          })),
        }
      : {}),
    ...(params.tool
      ? {
          tool: params.tool.map((name) => ({
            "@type": "HowToTool",
            name,
          })),
        }
      : {}),
  };
}
