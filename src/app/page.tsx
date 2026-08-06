import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { serviceSchema } from "@/lib/json-ld-schemas";
import { BUSINESS, HOME_CONTENT_UPDATED, SITE_URL } from "@/lib/site";
import Home from "@/views/Home";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: {
    absolute: "Caraway | Brisbane Vehicle Buyer & Pickup",
  },
  description: `Sell your vehicle to Caraway, a Brisbane-based buyer. Get an estimate, a confirmed offer, and pickup included when we buy. Call ${BUSINESS.phoneDisplay}.`,
  // Canonical is rendered manually in the JSX below. Next.js's metadata
  // resolver strips the trailing slash from root-path canonicals when
  // `trailingSlash: false` (see resolve-url.js: `pathname === '/' ? origin : href`),
  // producing `https://caraway.au` instead of `https://caraway.au/`.
  // That string mismatch is what GSC flags as "Alternative page with proper
  // canonical tag" against the slash-bearing URL Google actually crawls.
  openGraph: {
    url: `${SITE_URL}/`,
    type: "website",
    title: "Caraway | Brisbane Vehicle Buyer & Pickup",
    description:
      "Get a vehicle estimate, a confirmed offer, and pickup included when Caraway buys across Greater Brisbane.",
    images: [
      {
        url: "/images/og-card.jpg",
        width: 1200,
        height: 630,
        alt: "Caraway vehicle pickup in Brisbane",
      },
    ],
  },
  twitter: { card: "summary_large_image" },
};

export const homeStructuredData = [
    {
      "@type": "WebPage",
      "@id": `${SITE_URL}/#webpage`,
      url: `${SITE_URL}/`,
      name: "Caraway | Brisbane Vehicle Buyer",
      description:
        "Caraway is a Brisbane-based vehicle buyer offering estimates, confirmed offers, and pickup across Greater Brisbane.",
      dateModified: HOME_CONTENT_UPDATED,
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${SITE_URL}/#vehicle-buying-service` },
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
    serviceSchema({
      id: `${SITE_URL}/#vehicle-buying-service`,
      url: `${SITE_URL}/`,
      name: "Caraway vehicle buying and pickup",
      description:
        "Vehicle estimates, confirmed offers, and pickup when Caraway buys across Greater Brisbane.",
      serviceType: "Vehicle buying and pickup",
    }),
];

export default function HomePage() {
  return (
    <>
      <link rel="canonical" href={`${SITE_URL}/`} />
      <Home />
      <JsonLd data={homeStructuredData} />
    </>
  );
}
