import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbListSchema } from "@/lib/json-ld-schemas";
import About from "@/views/About";
import { BUSINESS, SITE_URL, CONTENT_DEPLOY_DATE } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "About Us — Brisbane Cash for Cars Team",
  description: `Meet the Caraway team — a locally owned Brisbane cash for cars service. Fair offers, free towing, and same- or next-day pickup 7 days a week. Call ${BUSINESS.phoneDisplay}.`,
  alternates: { canonical: "/about" },
  openGraph: {
    type: "website",
    url: "/about",
    title: "About Caraway — Brisbane Cash for Cars Team",
    description:
      "Meet the Caraway team — a locally owned Brisbane cash for cars service. Fair offers, free towing, same- or next-day pickup 7 days a week.",
    images: [{ url: "/images/og-card.jpg", width: 1200, height: 630, alt: "Caraway cash for cars Brisbane" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Caraway — Brisbane Cash for Cars Team",
    description:
      "Meet the Caraway team — a locally owned Brisbane cash for cars service. Fair offers, free towing, same- or next-day pickup 7 days a week.",
    images: [{ url: "/images/og-card.jpg", alt: "Caraway cash for cars Brisbane" }],
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
              "Meet the Caraway team — a locally owned Brisbane cash for cars service. Fair offers, free towing, same- or next-day pickup 7 days a week.",
            mainEntity: { "@id": `${SITE_URL}/#organization` },
            isPartOf: { "@id": `${SITE_URL}/#website` },
            inLanguage: "en-AU",
            dateModified: CONTENT_DEPLOY_DATE,
            primaryImageOfPage: {
              "@type": "ImageObject",
              url: `${SITE_URL}/images/tow-truck-hero.webp`,
              width: 1200,
              height: 630,
            },
          },
        ]}
      />
      <About />
    </>
  );
}
