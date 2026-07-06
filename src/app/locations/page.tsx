import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import Locations from "@/views/Locations";
import { suburbs } from "@/data/suburbs";
import { breadcrumbListSchema } from "@/lib/breadcrumb-schema";
import { SITE_URL, CONTENT_DEPLOY_DATE } from "@/lib/site";

export const revalidate = 3600;

const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "Locations" },
];

export const metadata: Metadata = {
  title: "Cash for Cars Brisbane — All Suburbs Serviced",
  description:
    "Caraway services all Brisbane suburbs for cash for cars. Find your area — North Brisbane, South Brisbane, Logan, Ipswich, Redcliffe and more.",
  alternates: { canonical: `${SITE_URL}/locations` },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/locations`,
    title: "Cash for Cars Brisbane — All Suburbs Serviced | Caraway",
    description:
      "Caraway services all Brisbane suburbs for cash for cars. Find your area — North Brisbane, South Brisbane, Logan, Ipswich, Redcliffe and more.",
    images: [{ url: "/images/og-card.jpg", width: 1200, height: 630, alt: "Caraway cash for cars Brisbane" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cash for Cars Brisbane — All Suburbs | Caraway",
    description:
      "Caraway services all Brisbane suburbs for cash for cars. Find your area — North Brisbane, South Brisbane, Logan, Ipswich, Redcliffe and more.",
    images: [{ url: "/images/og-card.jpg", alt: "Caraway cash for cars Brisbane" }],
  },
};

export default function LocationsPage() {
  const canonical = `${SITE_URL}/locations`;
  return (
    <>
      <JsonLd
        data={[
          breadcrumbListSchema(breadcrumbs, canonical),
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Cash for Cars Brisbane Locations",
            description:
              "Caraway services all Brisbane suburbs for cash for cars. Find your area.",
            url: canonical,
            isPartOf: { "@id": `${SITE_URL}/#website` },
            inLanguage: "en-AU",
            dateModified: CONTENT_DEPLOY_DATE,
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
        ]}
      />
      <Locations />
    </>
  );
}
