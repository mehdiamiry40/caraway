import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { faqs } from "@/data/home-faqs";
import { reviews } from "@/data/reviews";
import { SITE_URL } from "@/lib/site";
import Home from "@/views/Home";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: {
    absolute: "Cash for Cars Brisbane | Caraway — Fast Pickup",
  },
  description:
    "Sell your car for cash in Brisbane today. Caraway pays up to $9,999 with free towing and same- or next-day pickup. Any make, any condition. Call 0481 438 444.",
  alternates: { canonical: "/" },
  openGraph: {
    url: "/",
    type: "website",
    title: "Cash for Cars Brisbane | Caraway — Fast Pickup",
    description:
      "Sell your car for cash in Brisbane today. Caraway pays up to $9,999 with free towing and same- or next-day pickup. Any make, any condition.",
    images: [
      {
        url: "/images/tow-truck-hero.webp",
        width: 1200,
        height: 800,
        alt: "Caraway tow truck — cash for cars Brisbane",
      },
    ],
  },
  twitter: { card: "summary_large_image" },
};

export default function HomePage() {
  const homeStructuredData = [
    {
      "@type": "WebPage",
      "@id": `${SITE_URL}/#webpage`,
      url: `${SITE_URL}/`,
      name: "Cash for Cars Brisbane | Caraway",
      description:
        "Cash for cars Brisbane service: instant quotes, free towing, payment on pickup (usually same- or next-day). We buy damaged, old, scrap, and running vehicles across Greater Brisbane.",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: {
        "@type": "Service",
        name: "Cash for cars Brisbane",
        areaServed: { "@type": "City", name: "Brisbane" },
      },
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: `${SITE_URL}/`,
          },
        ],
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    },
    ...reviews.map((r) => ({
      "@type": "Review" as const,
      author: {
        "@type": "Person" as const,
        name: r.name,
        url: `${SITE_URL}/#reviews`,
      },
      reviewRating: {
        "@type": "Rating" as const,
        ratingValue: r.rating,
        bestRating: 5,
        worstRating: 1,
      },
      reviewBody: r.text,
      datePublished: r.date,
      itemReviewed: {
        "@type": "LocalBusiness" as const,
        "@id": `${SITE_URL}/#business`,
        name: "Caraway — Cash for Cars Brisbane",
      },
    })),
  ];

  return (
    <>
      {/*
       * LCP hero is preloaded automatically by <Image priority> in Hero.tsx.
       * Manual preload removed because it fetched the raw source file rather
       * than the optimizer-served /_next/image URL, creating a duplicate
       * download. Hero.tsx uses priority + fetchPriority="high" which emits
       * the correct preload matching the rendered asset.
       */}
      <JsonLd data={homeStructuredData} />
      <Home />
    </>
  );
}

