import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbListSchema } from "@/lib/json-ld-schemas";
import FAQPage from "@/views/FAQPage";
import { BUSINESS, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Cash for Cars Brisbane FAQ — Questions Answered",
  description: `Got questions about selling your car for cash in Brisbane? Find answers on pricing, towing, paperwork, and same- or next-day pickup. Call ${BUSINESS.phoneDisplay} for help.`,
  alternates: { canonical: "/faq" },
  openGraph: {
    type: "website",
    url: "/faq",
    title: "Cash for Cars Brisbane FAQ — Questions Answered | Caraway",
    description:
      "Got questions about selling your car for cash in Brisbane? Find answers on pricing, towing, paperwork, and same- or next-day pickup.",
    images: [{ url: "/images/og-card.jpg", width: 1200, height: 630, alt: "Caraway cash for cars Brisbane" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cash for Cars Brisbane FAQ — Caraway",
    description:
      "Got questions about selling your car for cash in Brisbane? Find answers on pricing, towing, paperwork, and same- or next-day pickup.",
    images: [{ url: "/images/og-card.jpg", alt: "Caraway cash for cars Brisbane" }],
  },
};

export default function FaqRoutePage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbListSchema([
            { name: "Home", item: `${SITE_URL}/` },
            { name: "FAQ", item: `${SITE_URL}/faq` },
          ]),
        ]}
      />
      <FAQPage />
    </>
  );
}
