import type { Metadata } from "next";
import Privacy from "@/views/Privacy";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbListSchema } from "@/lib/breadcrumb-schema";
import {
  LEGAL_DATE_ISO,
  OPEN_GRAPH_DEFAULTS,
  SHARED_PICKUP_IMAGE_ALT,
  SITE_URL,
} from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how Caraway collects, uses, and protects your personal information. Read our privacy policy for our Brisbane cash for cars and vehicle removal services.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    ...OPEN_GRAPH_DEFAULTS,
    type: "website",
    url: "/privacy",
    title: "Privacy Policy | Caraway",
    description:
      "Learn how Caraway collects, uses, and protects your personal information for our Brisbane cash for cars services.",
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
    title: "Privacy Policy | Caraway",
    description:
      "Learn how Caraway collects, uses, and protects your personal information for our Brisbane cash for cars services.",
    images: [{ url: "/images/og-card.jpg", alt: SHARED_PICKUP_IMAGE_ALT }],
  },
};

const canonical = `${SITE_URL}/privacy`;
const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "Privacy Policy" },
];

export default function PrivacyPage() {
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
            name: "Privacy Policy | Caraway",
            description:
              "Learn how Caraway collects, uses, and protects your personal information for our Brisbane cash for cars services.",
            inLanguage: "en-AU",
            dateModified: LEGAL_DATE_ISO.privacyLastUpdated,
            publisher: { "@id": `${SITE_URL}/#organization` },
            isPartOf: { "@id": `${SITE_URL}/#website` },
            about: { "@id": `${SITE_URL}/#organization` },
          },
        ]}
      />
      <Privacy />
    </>
  );
}
