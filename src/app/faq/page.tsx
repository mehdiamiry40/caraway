import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import FAQPage from "@/views/FAQPage";
import { allFaqs } from "@/lib/faq-data";
import { breadcrumbListSchema } from "@/lib/breadcrumb-schema";
import { SITE_URL } from "@/lib/site";

const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "FAQ" },
];

export const metadata: Metadata = {
  title: "Cash for Cars Brisbane FAQ — Questions Answered",
  description:
    "Got questions about selling your car for cash in Brisbane? Find answers on pricing, towing, paperwork, and same-day pickup. Call 1800 227 293 for help.",
  alternates: { canonical: "/faq" },
  openGraph: {
    type: "website",
    url: "/faq",
    title: "Cash for Cars Brisbane FAQ — Questions Answered | Caraway",
    description:
      "Got questions about selling your car for cash in Brisbane? Find answers on pricing, towing, paperwork, and same-day pickup.",
    images: [{ url: "/images/tow-truck-hero.webp", width: 1200, height: 800, alt: "Caraway cash for cars Brisbane" }],
  },
  twitter: { card: "summary_large_image" },
};

export default function FaqRoutePage() {
  const canonical = `${SITE_URL}/faq`;
  const faqStructuredData = [
    {
      "@type": "FAQPage",
      url: canonical,
      name: "Cash for Cars Brisbane FAQ",
      description:
        "Got questions about selling your car for cash in Brisbane? Find answers on pricing, towing, paperwork, and same-day pickup.",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      mainEntity: allFaqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    },
    breadcrumbListSchema(breadcrumbs, canonical),
  ];

  return (
    <>
      <JsonLd data={faqStructuredData} />
      <FAQPage />
    </>
  );
}
