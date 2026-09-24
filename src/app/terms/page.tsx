import type { Metadata } from "next";
import Terms from "@/views/Terms";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbListSchema } from "@/lib/breadcrumb-schema";
import {
  LEGAL_DATE_ISO,
  OPEN_GRAPH_DEFAULTS,
  SHARED_PICKUP_IMAGE_ALT,
  SITE_URL,
} from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Read the terms governing Caraway vehicle quotes, purchases, collection arrangements, payment, seller responsibilities, and website use in Queensland.",
  alternates: { canonical: "/terms" },
  openGraph: {
    ...OPEN_GRAPH_DEFAULTS,
    type: "website",
    url: "/terms",
    title: "Terms of Service | Caraway",
    description:
      "Terms governing use of the Caraway website and our vehicle purchase and removal services in Queensland, Australia.",
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
    title: "Terms of Service | Caraway",
    description:
      "Terms governing use of the Caraway website and our vehicle purchase and removal services in Queensland, Australia.",
    images: [{ url: "/images/og-card.jpg", alt: SHARED_PICKUP_IMAGE_ALT }],
  },
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
            dateModified: LEGAL_DATE_ISO.termsLastUpdated,
            publisher: { "@id": `${SITE_URL}/#organization` },
            isPartOf: { "@id": `${SITE_URL}/#website` },
            about: { "@id": `${SITE_URL}/#organization` },
          },
        ]}
      />
      <Terms />
    </>
  );
}
