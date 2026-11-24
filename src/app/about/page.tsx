import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbListSchema } from "@/lib/json-ld-schemas";
import About from "@/views/About";
import {
  ABOUT_CONTENT_UPDATED,
  BUSINESS,
  OPEN_GRAPH_DEFAULTS,
  SHARED_PICKUP_IMAGE_ALT,
  SITE_URL,
} from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "About Caraway — Brisbane Vehicle Buyer" },
  description: `Caraway is the registered Brisbane vehicle-buying business operated by ${BUSINESS.legalName}. See who runs it and how quotes, pickup, payment and receipts work.`,
  alternates: { canonical: "/about" },
  openGraph: {
    ...OPEN_GRAPH_DEFAULTS,
    type: "website",
    url: "/about",
    title: "About Caraway — Brisbane Vehicle Buyer",
    description:
      "Who runs Caraway, and how its quotes, pickup, payment and receipts work.",
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
    title: "About Caraway — Brisbane Vehicle Buyer",
    description:
      "Who runs Caraway, and how its quotes, pickup, payment and receipts work.",
    images: [{ url: "/images/og-card.jpg", alt: SHARED_PICKUP_IMAGE_ALT }],
  },
};

export default function AboutPage() {
  const canonical = `${SITE_URL}/about`;
  return (
    <>
      <JsonLd
        data={[
          breadcrumbListSchema([
            { name: "Home", item: `${SITE_URL}/` },
            { name: "About Caraway", item: canonical },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "AboutPage",
            url: canonical,
            name: "About Caraway",
            description:
              "Who runs Caraway, and how its quotes, pickup, payment and receipts work.",
            mainEntity: { "@id": `${SITE_URL}/#organization` },
            isPartOf: { "@id": `${SITE_URL}/#website` },
            inLanguage: "en-AU",
            dateModified: ABOUT_CONTENT_UPDATED,
            primaryImageOfPage: {
              "@type": "ImageObject",
              url: `${SITE_URL}/images/tow-truck-hero.webp`,
              width: 800,
              height: 800,
            },
          },
        ]}
      />
      <About />
    </>
  );
}
