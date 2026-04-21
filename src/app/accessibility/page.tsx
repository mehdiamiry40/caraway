import type { Metadata } from "next";
import Accessibility from "@/views/Accessibility";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbListSchema } from "@/lib/breadcrumb-schema";
import { SITE_URL, CONTENT_DEPLOY_DATE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Accessibility",
  description:
    "Caraway's commitment to making our website accessible to everyone — WCAG 2.1 AA, keyboard navigation, screen-reader support, and how to report issues.",
  alternates: { canonical: "/accessibility" },
  openGraph: {
    type: "website",
    url: "/accessibility",
    title: "Accessibility | Caraway",
    description:
      "Caraway's commitment to making our website accessible to everyone — WCAG 2.1 AA, keyboard navigation, and screen-reader support.",
    images: [{ url: "/images/tow-truck-hero.webp", width: 1200, height: 800, alt: "Caraway cash for cars Brisbane" }],
  },
  twitter: { card: "summary_large_image" },
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
