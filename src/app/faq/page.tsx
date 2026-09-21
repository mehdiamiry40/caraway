import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbListSchema } from "@/lib/json-ld-schemas";
import FAQPage from "@/views/FAQPage";
import {
  BUSINESS,
  OPEN_GRAPH_DEFAULTS,
  SHARED_PICKUP_IMAGE_ALT,
  SITE_URL,
} from "@/lib/site";

export const metadata: Metadata = {
  title: "Vehicle Selling FAQs for Brisbane",
  description: `Find practical answers about vehicle quotes, collection terms, payment records, and Queensland seller paperwork. Call ${BUSINESS.phoneDisplay} for help.`,
  alternates: { canonical: "/faq" },
  openGraph: {
    ...OPEN_GRAPH_DEFAULTS,
    type: "website",
    url: "/faq",
    title: "Vehicle Selling FAQs for Brisbane | Caraway",
    description:
      "Practical answers about vehicle quotes, collection terms, payment records, and Queensland seller paperwork.",
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
    title: "Vehicle Selling FAQs for Brisbane | Caraway",
    description:
      "Practical answers about vehicle quotes, collection terms, payment records, and Queensland seller paperwork.",
    images: [{ url: "/images/og-card.jpg", alt: SHARED_PICKUP_IMAGE_ALT }],
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
