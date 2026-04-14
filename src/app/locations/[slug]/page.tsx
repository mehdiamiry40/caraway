import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import SuburbPageTemplate from "@/components/templates/SuburbPageTemplate";
import { reviews } from "@/data/reviews";
import { getSuburbBySlug, suburbs } from "@/data/suburbs";
import { breadcrumbListSchema } from "@/lib/breadcrumb-schema";
import { SITE_URL } from "@/lib/site";

export const revalidate = 86400;

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return suburbs.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const suburb = getSuburbBySlug(slug);
  if (!suburb) {
    return {
      title: "Page not found | Caraway",
      robots: { index: false, follow: false },
    };
  }
  return {
    title: suburb.title,
    description: suburb.metaDescription,
    alternates: { canonical: `${SITE_URL}/locations/${suburb.slug}` },
    openGraph: {
      type: "website",
      title: suburb.title,
      description: suburb.metaDescription,
      url: `${SITE_URL}/locations/${suburb.slug}`,
      images: [{ url: "/images/tow-truck-hero.webp", width: 1200, height: 800, alt: "Caraway cash for cars Brisbane" }],
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function SuburbSlugPage({ params }: Props) {
  const { slug } = await params;
  const suburb = getSuburbBySlug(slug);
  if (!suburb) notFound();

  const canonicalUrl = `${SITE_URL}/locations/${suburb.slug}`;
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Locations", href: "/locations" },
    { label: suburb.h1 },
  ];

  const areaName = suburb.h1.replace("Cash for Cars ", "");
  const pageStructuredData = [
    {
      "@type": "Service",
      name: `Cash for Cars ${areaName}`,
      description: suburb.metaDescription,
      provider: {
        "@type": "LocalBusiness",
        "@id": `${SITE_URL}/#business`,
        name: "Caraway — Cash for Cars Brisbane",
      },
      areaServed: {
        "@type": "Place",
        name: areaName,
        containedInPlace: { "@type": "City", name: "Brisbane" },
      },
      serviceType: "Cash for Cars",
      url: canonicalUrl,
      image: `${SITE_URL}/images/tow-truck-hero.webp`,
      offers: {
        "@type": "Offer",
        priceCurrency: "AUD",
        price: "0",
        description: "Free car removal and towing included",
        availability: "https://schema.org/InStock",
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10,
        reviewCount: reviews.length,
        bestRating: 5,
        worstRating: 1,
      },
      hoursAvailable: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "07:00",
        closes: "19:00",
      },
    },
    breadcrumbListSchema(breadcrumbs, canonicalUrl),
  ];

  return (
    <>
      <JsonLd data={pageStructuredData} />
      <SuburbPageTemplate suburb={suburb} />
    </>
  );
}
