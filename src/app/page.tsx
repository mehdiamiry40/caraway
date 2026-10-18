import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { serviceSchema } from "@/lib/json-ld-schemas";
import {
  BUSINESS,
  HOME_CONTENT_UPDATED,
  OPEN_GRAPH_DEFAULTS,
  SHARED_PICKUP_IMAGE_ALT,
  SITE_URL,
} from "@/lib/site";
import Home from "@/views/Home";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: {
    absolute: "Cash for Cars Brisbane | Written Offer & Pickup | Caraway",
  },
  description: `Cash for cars Brisbane from a local buyer: get a human-reviewed written offer for your car, running or not, with pickup included when we buy. Call ${BUSINESS.phoneDisplay}.`,
  // Canonical is rendered manually in the JSX below. Next.js's metadata
  // resolver strips the trailing slash from root-path canonicals when
  // `trailingSlash: false` (see resolve-url.js: `pathname === '/' ? origin : href`),
  // producing `https://caraway.au` instead of `https://caraway.au/`.
  // That string mismatch is what GSC flags as "Alternative page with proper
  // canonical tag" against the slash-bearing URL Google actually crawls.
  openGraph: {
    ...OPEN_GRAPH_DEFAULTS,
    type: "website",
    title: "Cash for Cars Brisbane | Written Offer & Pickup | Caraway",
    description:
      "Cash for cars Brisbane: a human-reviewed written offer for your car, running or not, with pickup included when Caraway buys across Greater Brisbane.",
    images: [
      {
        url: "/images/og-card.jpg",
        width: 1200,
        height: 630,
        alt: SHARED_PICKUP_IMAGE_ALT,
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
      name: "Cash for Cars Brisbane | Caraway",
      description:
        "Cash for cars Brisbane from Caraway, a Brisbane-based car buyer that reviews each vehicle, confirms a written offer, and includes pickup when it buys across Greater Brisbane.",
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
      name: "Cash for cars Brisbane",
      description:
        "Human-reviewed cash for cars assessments, written offers, and pickup included when Caraway buys vehicles across Greater Brisbane.",
      serviceType: "Cash for cars",
    }),
];

export default function HomePage() {
  return (
    <>
      <link rel="canonical" href={`${SITE_URL}/`} />
      <meta property="og:url" content={`${SITE_URL}/`} />
      <Home />
      <JsonLd data={homeStructuredData} />
    </>
  );
}
