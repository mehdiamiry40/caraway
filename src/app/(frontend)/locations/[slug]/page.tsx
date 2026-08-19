import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbListSchema, serviceSchema } from "@/lib/json-ld-schemas";
import SuburbPageTemplate from "@/components/templates/SuburbPageTemplate";
import { getSuburbBySlug, suburbs } from "@/data/suburbs";
import { SHARED_PICKUP_IMAGE_ALT, SITE_URL } from "@/lib/site";

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
      siteName: "Caraway",
      locale: "en_AU",
      title: suburb.title,
      description: suburb.metaDescription,
      url: `${SITE_URL}/locations/${suburb.slug}`,
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
      title: suburb.title,
      description: suburb.metaDescription,
      images: [
        { url: "/images/og-card.jpg", alt: SHARED_PICKUP_IMAGE_ALT },
      ],
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
    serviceSchema({
      id: `${canonicalUrl}#service`,
      url: canonicalUrl,
      name: `Cash for Cars ${areaName}`,
      description: suburb.metaDescription,
      areaServed: {
        "@type": "Place",
        name: areaName,
      },
      serviceType: "Cash for Cars",
      image: `${SITE_URL}/images/tow-truck-hero.webp`,
    }),
  ];

  return (
    <>
      <JsonLd data={schemas} />
      <SuburbPageTemplate suburb={suburb} />
    </>
  );
}
