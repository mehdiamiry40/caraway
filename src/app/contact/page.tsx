import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbListSchema } from "@/lib/json-ld-schemas";
import Contact from "@/views/Contact";
import { BUSINESS, SITE_URL, CONTENT_DEPLOY_DATE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us — Free Cash for Cars Quote Brisbane",
  description: `Contact Caraway for a free cash quote on your car. Call ${BUSINESS.phoneDisplay} or use our online form. Brisbane-wide, 7 days — pickup usually same- or next-day.`,
  alternates: { canonical: "/contact" },
  openGraph: {
    type: "website",
    url: "/contact",
    title: "Contact Us — Free Cash for Cars Quote Brisbane | Caraway",
    description: `Contact Caraway for a free cash quote on your car. Call ${BUSINESS.phoneDisplay} or use our online form. Brisbane-wide, 7 days — pickup usually same- or next-day.`,
    images: [{ url: "/images/og-card.jpg", width: 1200, height: 630, alt: "Caraway cash for cars Brisbane" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Caraway — Free Cash for Cars Quote Brisbane",
    description: `Contact Caraway for a free cash quote on your car. Call ${BUSINESS.phoneDisplay} or use our online form. Brisbane-wide, 7 days — pickup usually same- or next-day.`,
    images: [{ url: "/images/og-card.jpg", alt: "Caraway cash for cars Brisbane" }],
  },
};

export default function ContactPage() {
  const canonical = `${SITE_URL}/contact`;
  return (
    <>
      <JsonLd
        data={[
          breadcrumbListSchema([
            { name: "Home", item: `${SITE_URL}/` },
            { name: "Contact Us", item: canonical },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "ContactPage",
            url: canonical,
            name: "Contact Caraway",
            description: `Contact Caraway for a free cash quote on your car. Call ${BUSINESS.phoneDisplay} or fill out our form.`,
            mainEntity: { "@id": `${SITE_URL}/#business` },
            isPartOf: { "@id": `${SITE_URL}/#website` },
            inLanguage: "en-AU",
            dateModified: CONTENT_DEPLOY_DATE,
            about: {
              "@type": "LocalBusiness",
              "@id": `${SITE_URL}/#business`,
            },
            contactPoint: [
              {
                "@type": "ContactPoint",
                contactType: "customer service",
                telephone: BUSINESS.phoneDisplay,
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
        ]}
      />
      <Contact />
    </>
  );
}
