import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbListSchema } from "@/lib/json-ld-schemas";
import About from "@/views/About";
import { SITE_URL } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "About Us — Brisbane Cash for Cars Team",
  description:
    "Meet the Caraway team — a locally owned Brisbane cash for cars service. Fair offers, free towing, and same- or next-day pickup 7 days a week. Call 0481 438 444.",
  alternates: { canonical: "/about" },
  openGraph: {
    type: "website",
    url: "/about",
    title: "About Caraway — Brisbane Cash for Cars Team",
    description:
      "Meet the Caraway team — a locally owned Brisbane cash for cars service. Fair offers, free towing, same- or next-day pickup 7 days a week.",
    images: [{ url: "/images/tow-truck-hero.webp", width: 1200, height: 800, alt: "Caraway cash for cars Brisbane" }],
  },
  twitter: { card: "summary_large_image" },
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
            dateModified: new Date().toISOString().split("T")[0],
            primaryImageOfPage: {
              "@type": "ImageObject",
              url: `${SITE_URL}/images/tow-truck-hero.webp`,
              width: 1200,
              height: 800,
            },
          },
        ]}
      />
      <About />
    </>
  );
}
