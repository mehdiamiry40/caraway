import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbListSchema, faqPageSchema } from "@/lib/json-ld-schemas";
import SuburbPageTemplate from "@/components/templates/SuburbPageTemplate";
import { getSuburbBySlug, suburbs } from "@/data/suburbs";
import { SITE_URL } from "@/lib/site";

export const revalidate = 86400;
export const dynamicParams = false;

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return suburbs.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const suburb = getSuburbBySlug(slug);
  if (!suburb) {
    return {
      title: { absolute: "Page not found — Caraway" },
      robots: { index: false, follow: false },
      openGraph: null,
      twitter: null,
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
    twitter: {
      card: "summary_large_image",
      title: suburb.title,
      description: suburb.metaDescription,
      images: [{ url: "/images/tow-truck-hero.webp", alt: "Caraway cash for cars Brisbane" }],
    },
  };
}

export default async function SuburbSlugPage({ params }: Props) {
  const { slug } = await params;
  const suburb = getSuburbBySlug(slug);
  if (!suburb) notFound();

  const canonicalUrl = `${SITE_URL}/locations/${suburb.slug}`;

  const areaName = suburb.regionName ?? suburb.h1.replace("Cash for Cars ", "");
  const schemas = [
    breadcrumbListSchema([
      { name: "Home", item: `${SITE_URL}/` },
      { name: "Locations", item: `${SITE_URL}/locations` },
      { name: suburb.h1, item: canonicalUrl },
    ]),
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
      hoursAvailable: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "07:00",
        closes: "19:00",
      },
    },
    ...(suburb.localFaqs?.length ? [faqPageSchema(suburb.localFaqs)] : []),
  ];

  return (
    <>
      <JsonLd data={schemas} />
      <SuburbPageTemplate suburb={suburb} />
    </>
  );
}
