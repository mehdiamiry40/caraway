import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import Locations from "@/views/Locations";
import { suburbs } from "@/data/suburbs";
import { breadcrumbListSchema } from "@/lib/breadcrumb-schema";
import {
  LOCATIONS_CONTENT_UPDATED,
  OPEN_GRAPH_DEFAULTS,
  SHARED_PICKUP_IMAGE_ALT,
  SITE_URL,
} from "@/lib/site";

const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "Locations" },
];

export const metadata: Metadata = {
  title: "Greater Brisbane Vehicle Pickup Areas",
  description:
    "See Caraway's Greater Brisbane vehicle pickup areas. We confirm coverage, access, and timing for your exact address before pickup.",
  alternates: { canonical: `${SITE_URL}/locations` },
  openGraph: {
    ...OPEN_GRAPH_DEFAULTS,
    type: "website",
    url: `${SITE_URL}/locations`,
    title: "Greater Brisbane Vehicle Pickup Areas | Caraway",
    description:
      "See Caraway's Greater Brisbane vehicle pickup areas and the details we need to confirm pickup at your address.",
    images: [
      {
        url: "/images/og-card.jpg",
        width: 1200,
        height: 630,
        alt: SHARED_PICKUP_IMAGE_ALT,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Greater Brisbane Vehicle Pickup Areas | Caraway",
    description:
      "See Caraway's Greater Brisbane vehicle pickup areas and check coverage for your exact address.",
    images: [{ url: "/images/og-card.jpg", alt: SHARED_PICKUP_IMAGE_ALT }],
  },
};

const canonical = `${SITE_URL}/locations`;

export const locationsStructuredData = [
  breadcrumbListSchema(breadcrumbs, canonical),
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Caraway Greater Brisbane vehicle pickup areas",
    description:
      "A regional guide to Caraway vehicle pickup coverage across Greater Brisbane.",
    url: canonical,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    inLanguage: "en-AU",
    dateModified: LOCATIONS_CONTENT_UPDATED,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: suburbs.length,
      itemListElement: suburbs.map((s, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        name: s.h1,
        url: `${SITE_URL}/locations/${s.slug}`,
      })),
    },
    hasPart: suburbs.map((s) => ({
      "@type": "WebPage",
      name: s.h1,
      url: `${SITE_URL}/locations/${s.slug}`,
    })),
  },
];

export default function LocationsPage() {
  return (
    <>
      <JsonLd data={locationsStructuredData} />
      <Locations />
    </>
  );
}
