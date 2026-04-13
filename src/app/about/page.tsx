import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import About from "@/views/About";
import { breadcrumbListSchema } from "@/lib/breadcrumb-schema";
import { SITE_URL } from "@/lib/site";

export const revalidate = 3600;

const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "About Caraway" },
];

export const metadata: Metadata = {
  title: "About Us — Brisbane Cash for Cars Team",
  description:
    "Meet the Caraway team — a locally owned Brisbane cash for cars service. Fair offers, free towing, and same-day pickup 7 days a week. Call 1800 227 293.",
  alternates: { canonical: "/about" },
  openGraph: {
    type: "website",
    url: "/about",
    title: "About Caraway — Brisbane Cash for Cars Team",
    description:
      "Meet the Caraway team — a locally owned Brisbane cash for cars service. Fair offers, free towing, same-day pickup 7 days a week.",
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
          breadcrumbListSchema(breadcrumbs, canonical),
          {
            "@context": "https://schema.org",
            "@type": "AboutPage",
            url: canonical,
            name: "About Caraway",
            description:
              "Meet the Caraway team — a locally owned Brisbane cash for cars service. Fair offers, free towing, same-day pickup 7 days a week.",
            mainEntity: { "@id": `${SITE_URL}/#organization` },
            isPartOf: { "@id": `${SITE_URL}/#website` },
          },
        ]}
      />
      <About />
    </>
  );
}
