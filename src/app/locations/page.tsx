import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import Locations from "@/views/Locations";
import { suburbs } from "@/data/suburbs";
import { breadcrumbListSchema } from "@/lib/breadcrumb-schema";
import { SITE_URL } from "@/lib/site";

const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "Locations" },
];

export const metadata: Metadata = {
  title: "Cash for Cars Brisbane — All Suburbs Serviced",
  description:
    "Caraway services all Brisbane suburbs for cash for cars. Find your area — North Brisbane, South Brisbane, Logan, Ipswich, Redcliffe and more. Free removal, same-day pickup.",
  alternates: { canonical: "/locations" },
  openGraph: {
    url: "/locations",
    title: "Cash for Cars Brisbane — All Suburbs Serviced | Caraway",
    description:
      "Caraway services all Brisbane suburbs for cash for cars. Find your area — North Brisbane, South Brisbane, Logan, Ipswich, Redcliffe and more.",
    images: [{ url: "/images/tow-truck-hero.webp", width: 1200, height: 800, alt: "Caraway cash for cars Brisbane" }],
  },
  twitter: { card: "summary_large_image" },
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
