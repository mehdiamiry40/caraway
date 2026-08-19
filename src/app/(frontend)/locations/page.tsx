import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import Locations from "@/views/Locations";
import { suburbs } from "@/data/suburbs";
import { breadcrumbListSchema } from "@/lib/breadcrumb-schema";
import {
  LOCATIONS_CONTENT_UPDATED,
  SHARED_PICKUP_IMAGE_ALT,
  SITE_URL,
} from "@/lib/site";

export const revalidate = 3600;

const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "Locations" },
];

export const metadata: Metadata = {
  title: "Greater Brisbane Vehicle Pickup Areas",
  description:
    "Explore Caraway's Greater Brisbane vehicle pickup areas. Coverage, access, and timing are confirmed for your exact address before collection.",
  alternates: { canonical: `${SITE_URL}/locations` },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/locations`,
    title: "Greater Brisbane Vehicle Pickup Areas | Caraway",
    description:
      "Explore Caraway's Greater Brisbane vehicle pickup areas and the details needed to confirm collection for your address.",
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
      "Explore Caraway's Greater Brisbane vehicle pickup areas and confirm coverage for your exact address.",
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
