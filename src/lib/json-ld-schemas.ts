/** Site-wide JSON-LD objects (same semantics as former SEO.tsx global injection). */

import { SITE_URL, BUSINESS } from "@/lib/site";

const openingHours = {
  "@type": "OpeningHoursSpecification" as const,
  dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
  opens: "07:00",
  closes: "19:00",
};

const SAME_AS = [BUSINESS.googleBusinessUrl, BUSINESS.abrUrl];

export const serviceAreas = [
  { "@type": "City" as const, name: "Brisbane" },
  { "@type": "City" as const, name: "Ipswich" },
  { "@type": "City" as const, name: "Logan" },
  { "@type": "AdministrativeArea" as const, name: "Redlands" },
  { "@type": "AdministrativeArea" as const, name: "Moreton Bay" },
];

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: BUSINESS.name,
  legalName: BUSINESS.legalName,
  taxID: BUSINESS.abn,
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
  telephone: BUSINESS.phoneE164,
  email: BUSINESS.email,
  areaServed: serviceAreas,
  contactPoint: {
    "@type": "ContactPoint",
    telephone: BUSINESS.phoneE164,
    contactType: "customer service",
    areaServed: serviceAreas,
    availableLanguage: "English",
    hoursAvailable: openingHours,
  },
  sameAs: SAME_AS,
};

/** Reusable publisher object for BlogPosting / Article schemas. */
export const publisherSchema = {
  "@type": "Organization" as const,
  "@id": `${SITE_URL}/#organization`,
  name: BUSINESS.name,
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
  name: BUSINESS.name,
  url: SITE_URL,
  description:
    "Caraway is a Brisbane vehicle buyer offering quotes and pickup across Greater Brisbane.",
  publisher: { "@id": `${SITE_URL}/#organization` },
  inLanguage: "en-AU",
  // SearchAction removed: LocationsFilter uses client-side state only and
  // does not support a ?q= query parameter.
};

/* ---------- Schema builders for call sites ---------- */

type ServiceArea =
  | { "@type": "City" | "AdministrativeArea" | "Place"; name: string }
  | Array<{ "@type": "City" | "AdministrativeArea" | "Place"; name: string }>;

export function serviceSchema(params: {
  id: string;
  url: string;
  name: string;
  description: string;
  serviceType: string;
  areaServed?: ServiceArea;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": params.id,
    url: params.url,
    name: params.name,
    description: params.description,
    serviceType: params.serviceType,
    provider: { "@id": `${SITE_URL}/#organization` },
    areaServed: params.areaServed ?? serviceAreas,
    ...(params.image ? { image: params.image } : {}),
  };
}

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
