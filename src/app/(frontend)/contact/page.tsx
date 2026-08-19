import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbListSchema } from "@/lib/json-ld-schemas";
import Contact from "@/views/Contact";
import {
  BUSINESS,
  CONTENT_DEPLOY_DATE,
  SHARED_PICKUP_IMAGE_ALT,
  SITE_URL,
} from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Caraway | Phone, Email and Quote Enquiries",
  description: `Contact Caraway by phone, email or online form for vehicle quote and pickup enquiries. Call ${BUSINESS.phoneDisplay} or send the vehicle and collection details online.`,
  alternates: { canonical: "/contact" },
  openGraph: {
    type: "website",
    url: "/contact",
    title: "Contact Caraway | Phone, Email and Quote Enquiries",
    description: `Contact Caraway by phone, email or online form for vehicle quote and pickup enquiries. Call ${BUSINESS.phoneDisplay} or send the vehicle and collection details online.`,
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
    title: "Contact Caraway | Phone, Email and Quote Enquiries",
    description: `Contact Caraway by phone, email or online form for vehicle quote and pickup enquiries. Call ${BUSINESS.phoneDisplay} or send the vehicle and collection details online.`,
    images: [{ url: "/images/og-card.jpg", alt: SHARED_PICKUP_IMAGE_ALT }],
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
            description: `Contact Caraway about a vehicle quote or pickup enquiry. Call ${BUSINESS.phoneDisplay} or fill out the online form.`,
            mainEntity: { "@id": `${SITE_URL}/#organization` },
            isPartOf: { "@id": `${SITE_URL}/#website` },
            inLanguage: "en-AU",
            dateModified: CONTENT_DEPLOY_DATE,
            about: { "@id": `${SITE_URL}/#organization` },
          },
        ]}
      />
      <Contact />
    </>
  );
}
