import type { Metadata } from "next";
import Terms from "@/views/Terms";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbListSchema } from "@/lib/breadcrumb-schema";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Read the terms of service for Caraway's website and our vehicle purchase and removal services in Queensland, Australia. Updated March 2026.",
  alternates: { canonical: "/terms" },
  openGraph: {
    url: "/terms",
    title: "Terms of Service | Caraway",
    description:
      "Terms governing use of the Caraway website and our vehicle purchase and removal services in Queensland, Australia.",
    images: [{ url: "/images/tow-truck-hero.webp", width: 1200, height: 800, alt: "Caraway cash for cars Brisbane" }],
  },
  twitter: { card: "summary_large_image" },
};

const canonical = `${SITE_URL}/terms`;
const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "Terms of Service" },
];

export default function TermsPage() {
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
            name: "Terms of Service | Caraway",
            description:
              "Terms governing use of the Caraway website and our vehicle purchase and removal services in Queensland, Australia.",
            inLanguage: "en-AU",
          },
        ]}
      />
      <Terms />
    </>
  );
}
