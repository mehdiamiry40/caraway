import type { Metadata } from "next";
import Privacy from "@/views/Privacy";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbListSchema } from "@/lib/breadcrumb-schema";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how Caraway collects, uses, and protects your personal information. Read our privacy policy for our Brisbane cash for cars and vehicle removal services.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    type: "website",
    url: "/privacy",
    title: "Privacy Policy | Caraway",
    description:
      "Learn how Caraway collects, uses, and protects your personal information for our Brisbane cash for cars services.",
    images: [{ url: "/images/tow-truck-hero.webp", width: 1200, height: 800, alt: "Caraway cash for cars Brisbane" }],
  },
  twitter: { card: "summary_large_image" },
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
          },
        ]}
      />
      <Privacy />
    </>
  );
}
