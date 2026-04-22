import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { faqPageSchema, howToSchema } from "@/lib/json-ld-schemas";
import { faqs } from "@/data/home-faqs";
import { reviews } from "@/data/reviews";
import { SITE_URL } from "@/lib/site";
import Home from "@/views/Home";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: {
    absolute: "Cash for Cars Brisbane | Sell My Car for Cash Today — Caraway",
  },
  description:
    "Cash for cars Brisbane: sell your car for up to $9,999 with free car removal and same-day pickup. Any make, any condition. Trusted Brisbane car buyers — call 0481 438 444.",
  // Canonical is rendered manually in the JSX below. Next.js's metadata
  // resolver strips the trailing slash from root-path canonicals when
  // `trailingSlash: false` (see resolve-url.js: `pathname === '/' ? origin : href`),
  // producing `https://www.caraway.au` instead of `https://www.caraway.au/`.
  // That string mismatch is what GSC flags as "Alternative page with proper
  // canonical tag" against the slash-bearing URL Google actually crawls.
  openGraph: {
    url: `${SITE_URL}/`,
    type: "website",
    title: "Cash for Cars Brisbane | Sell My Car for Cash Today — Caraway",
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
      <link rel="canonical" href={`${SITE_URL}/`} />
      <JsonLd
        data={[
          faqPageSchema(faqs),
          howToSchema({
            name: "How to Sell Your Car for Cash in Brisbane",
            description:
              "Three simple steps to get cash for your car with Caraway in Brisbane: get a quote, accept the offer, and get paid on pickup.",
            totalTime: "PT1D",
            estimatedCost: { currency: "AUD", value: "0" },
            steps: [
              {
                name: "Tell us about your car",
                text: "Use our online quote tool — make, model, year, condition, suburb. Photos help if you have them.",
                url: `${SITE_URL}/#how-it-works`,
              },
              {
                name: "Confirm your quote",
                text: "We send a firm number straight back through the quote tool. Lock it in and book a pickup time that suits you.",
                url: `${SITE_URL}/#how-it-works`,
              },
              {
                name: "We pick up, you get paid",
                text: "Our truck arrives at the booked slot. Cash (or agreed payment method) before the vehicle leaves your place.",
                url: `${SITE_URL}/#how-it-works`,
              },
            ],
            supply: ["Vehicle details (make, model, year, condition)"],
            tool: ["Caraway online quote tool"],
          }),
          ...homeStructuredData,
        ]}
      />
      <Home />
    </>
  );
}

