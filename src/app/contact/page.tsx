import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import Contact from "@/views/Contact";
import { breadcrumbListSchema } from "@/lib/breadcrumb-schema";
import { BUSINESS, SITE_URL } from "@/lib/site";

const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "Contact Us" },
];

export const metadata: Metadata = {
  title: "Contact Us — Free Cash for Cars Quote Brisbane",
  description:
    "Contact Caraway for a free cash quote on your car. Call 1800 227 293 or use our online form. Brisbane-wide service, 7 days a week, same-day pickup available.",
  alternates: { canonical: "/contact" },
  openGraph: {
    type: "website",
    url: "/contact",
    title: "Contact Us — Free Cash for Cars Quote Brisbane | Caraway",
    description:
      "Contact Caraway for a free cash quote on your car. Call 1800 227 293 or use our online form. Brisbane-wide, 7 days a week.",
    images: [{ url: "/images/tow-truck-hero.webp", width: 1200, height: 800, alt: "Caraway cash for cars Brisbane" }],
  },
  twitter: { card: "summary_large_image" },
};

export default function ContactPage() {
  const canonical = `${SITE_URL}/contact`;
  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "ContactPage",
            url: canonical,
            name: "Contact Caraway",
            description:
              "Contact Caraway for a free cash quote on your car. Call 1800 227 293 or fill out our form.",
            mainEntity: { "@id": `${SITE_URL}/#business` },
            isPartOf: { "@id": `${SITE_URL}/#website` },
            inLanguage: "en-AU",
            dateModified: new Date().toISOString().split("T")[0],
            about: {
              "@type": "LocalBusiness",
              "@id": `${SITE_URL}/#business`,
            },
            contactPoint: [
              {
                "@type": "ContactPoint",
                contactType: "customer service",
                telephone: BUSINESS.phone,
                email: BUSINESS.email,
                areaServed: "AU",
                availableLanguage: "English",
                hoursAvailable: {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                  opens: "07:00",
                  closes: "19:00",
                },
              },
            ],
          },
          breadcrumbListSchema(breadcrumbs, canonical),
        ]}
      />
      <Contact />
    </>
  );
}
