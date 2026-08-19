import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbListSchema, serviceSchema } from "@/lib/json-ld-schemas";
import ServicePageTemplate from "@/components/templates/ServicePageTemplate";
import {
  getServiceBySlug,
  getServicePreferredImage,
  services,
  type ServicePage,
} from "@/data/services";
import { SHARED_PICKUP_IMAGE_ALT, SITE_URL } from "@/lib/site";

export const revalidate = 86400;
export const dynamicParams = false;

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export function buildServiceStructuredData(service: ServicePage) {
  const canonicalUrl = `${SITE_URL}/${service.slug}`;
  const serviceId = `${canonicalUrl}#service`;
  const preferredImage = getServicePreferredImage(service);
  const preferredImageUrl = preferredImage
    ? `${SITE_URL}${preferredImage.src}`
    : undefined;

  return [
    breadcrumbListSchema([
      { name: "Home", item: `${SITE_URL}/` },
      { name: "Services", item: `${SITE_URL}/services` },
      { name: service.h1, item: canonicalUrl },
    ]),
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${canonicalUrl}#webpage`,
      url: canonicalUrl,
      name: service.h1,
      description: service.metaDescription,
      isPartOf: { "@id": `${SITE_URL}/#website` },
      breadcrumb: { "@id": `${canonicalUrl}#breadcrumbs` },
      mainEntity: { "@id": serviceId },
      inLanguage: "en-AU",
      ...(service.updatedAt ? { dateModified: service.updatedAt } : {}),
      ...(preferredImage && preferredImageUrl
        ? {
            primaryImageOfPage: {
              "@type": "ImageObject",
              "@id": `${canonicalUrl}#primaryimage`,
              url: preferredImageUrl,
              contentUrl: preferredImageUrl,
              width: preferredImage.width,
              height: preferredImage.height,
              caption: preferredImage.caption,
              representativeOfPage: true,
            },
            thumbnailUrl: preferredImageUrl,
          }
        : {}),
    },
    serviceSchema({
      id: serviceId,
      url: canonicalUrl,
      name: service.h1,
      description: service.metaDescription,
      serviceType: service.serviceType,
      image: preferredImageUrl,
    }),
  ];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) {
    return {
      title: { absolute: "Page not found — Caraway" },
      robots: { index: false, follow: false },
      openGraph: null,
      twitter: null,
    };
  }
  const preferredImage = getServicePreferredImage(service);
  const metadataImage = preferredImage ?? {
    src: "/images/og-card.jpg",
    width: 1200,
    height: 630,
    alt: SHARED_PICKUP_IMAGE_ALT,
  };
  return {
    title: service.title,
    description: service.metaDescription,
    alternates: { canonical: `${SITE_URL}/${service.slug}` },
    openGraph: {
      type: "website",
      siteName: "Caraway",
      locale: "en_AU",
      title: service.title,
      description: service.metaDescription,
      url: `${SITE_URL}/${service.slug}`,
      images: [
        {
          url: metadataImage.src,
          width: metadataImage.width,
          height: metadataImage.height,
          alt: metadataImage.alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: service.title,
      description: service.metaDescription,
      images: [{ url: metadataImage.src, alt: metadataImage.alt }],
    },
  };
}

export default async function ServiceSlugPage({ params }: Props) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  return (
    <>
      <JsonLd data={buildServiceStructuredData(service)} />
      <ServicePageTemplate service={service} />
    </>
  );
}
