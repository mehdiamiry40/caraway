import type { Metadata } from "next";
import Accessibility from "@/views/Accessibility";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbListSchema } from "@/lib/breadcrumb-schema";
import {
  CONTENT_DEPLOY_DATE,
  OPEN_GRAPH_DEFAULTS,
  SHARED_PICKUP_IMAGE_ALT,
  SITE_URL,
} from "@/lib/site";

export const metadata: Metadata = {
  title: "Accessibility",
  description:
    "Caraway's commitment to making our website accessible to everyone — WCAG 2.1 AA, keyboard navigation, screen-reader support, and how to report issues.",
  alternates: { canonical: "/accessibility" },
  openGraph: {
    ...OPEN_GRAPH_DEFAULTS,
    type: "website",
    url: "/accessibility",
    title: "Accessibility | Caraway",
    description:
      "Caraway's commitment to making our website accessible to everyone — WCAG 2.1 AA, keyboard navigation, and screen-reader support.",
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
    title: "Accessibility | Caraway",
    description:
      "Caraway's commitment to making our website accessible to everyone — WCAG 2.1 AA, keyboard navigation, and screen-reader support.",
    images: [{ url: "/images/og-card.jpg", alt: SHARED_PICKUP_IMAGE_ALT }],
  },
};

const canonical = `${SITE_URL}/accessibility`;
const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "Accessibility" },
];

export default function AccessibilityPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbListSchema(breadcrumbs, canonical),
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "@id": canonical,
            url: canonical,
            name: "Accessibility | Caraway",
            description:
              "Caraway's commitment to making our website accessible to everyone — WCAG 2.1 AA, keyboard navigation, and screen-reader support.",
            inLanguage: "en-AU",
            dateModified: CONTENT_DEPLOY_DATE,
            publisher: { "@id": `${SITE_URL}/#organization` },
            isPartOf: { "@id": `${SITE_URL}/#website` },
            about: { "@id": `${SITE_URL}/#organization` },
          },
        ]}
      />
      <Accessibility />
    </>
  );
}
