import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbListSchema, serviceSchema } from "@/lib/json-ld-schemas";
import SuburbPageTemplate from "@/components/templates/SuburbPageTemplate";
import {
  getSuburbBySlug,
  suburbs,
  type SuburbPage,
} from "@/data/suburbs";
import {
  CONTENT_DEPLOY_DATE,
  SHARED_PICKUP_IMAGE_ALT,
  SITE_URL,
} from "@/lib/site";

export const revalidate = 86400;
export const dynamicParams = false;

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return suburbs.map((s) => ({ slug: s.slug }));
}

export function buildSuburbStructuredData(suburb: SuburbPage) {
  const canonicalUrl = `${SITE_URL}/locations/${suburb.slug}`;
  const serviceId = `${canonicalUrl}#service`;
  const primaryImageUrl = `${SITE_URL}/images/tow-truck-hero.webp`;
  const areaName = suburb.regionName ?? suburb.h1.replace("Cash for Cars ", "");

  return [
    breadcrumbListSchema([
      { name: "Home", item: `${SITE_URL}/` },
      { name: "Locations", item: `${SITE_URL}/locations` },
      { name: suburb.h1, item: canonicalUrl },
    ]),
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${canonicalUrl}#webpage`,
      url: canonicalUrl,
      name: suburb.h1,
      description: suburb.metaDescription,
      isPartOf: { "@id": `${SITE_URL}/#website` },
      breadcrumb: { "@id": `${canonicalUrl}#breadcrumbs` },
      mainEntity: { "@id": serviceId },
      inLanguage: "en-AU",
      dateModified: suburb.updatedAt ?? CONTENT_DEPLOY_DATE,
      primaryImageOfPage: {
        "@type": "ImageObject",
        "@id": `${canonicalUrl}#primaryimage`,
        url: primaryImageUrl,
        contentUrl: primaryImageUrl,
        width: 800,
        height: 800,
        caption: SHARED_PICKUP_IMAGE_ALT,
        representativeOfPage: true,
      },
      thumbnailUrl: primaryImageUrl,
    },
    serviceSchema({
      id: serviceId,
      url: canonicalUrl,
      name: `Cash for Cars ${areaName}`,
      description: suburb.metaDescription,
      areaServed: {
        "@type": "Place",
        name: areaName,
      },
      serviceType: "Cash for Cars",
      image: primaryImageUrl,
    }),
  ];
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

  const schemas = buildSuburbStructuredData(suburb);

  return (
    <>
      <JsonLd data={schemas} />
      <SuburbPageTemplate suburb={suburb} />
    </>
  );
}
