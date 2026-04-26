import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbListSchema, faqPageSchema } from "@/lib/json-ld-schemas";
import ServicePageTemplate from "@/components/templates/ServicePageTemplate";
import { reviews } from "@/data/reviews";
import { getServiceBySlug, services } from "@/data/services";
import { SITE_URL } from "@/lib/site";

export const revalidate = 86400;
export const dynamicParams = false;

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
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
  return {
    title: service.title,
    description: service.metaDescription,
    alternates: { canonical: `${SITE_URL}/${service.slug}` },
    openGraph: {
      type: "website",
      title: service.title,
      description: service.metaDescription,
      url: `${SITE_URL}/${service.slug}`,
      images: [{ url: "/images/tow-truck-hero.webp", width: 1200, height: 800, alt: "Caraway cash for cars Brisbane" }],
    },
    twitter: {
      card: "summary_large_image",
      title: service.title,
      description: service.metaDescription,
      images: [{ url: "/images/tow-truck-hero.webp", alt: "Caraway cash for cars Brisbane" }],
    },
  };
}

export default async function ServiceSlugPage({ params }: Props) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const canonicalUrl = `${SITE_URL}/${service.slug}`;

  return (
    <>
      <JsonLd
        data={[
          breadcrumbListSchema([
            { name: "Home", item: `${SITE_URL}/` },
            { name: service.h1, item: canonicalUrl },
          ]),
          faqPageSchema(service.faqs),
          {
            "@type": "Service",
            name: service.h1,
            description: service.metaDescription,
            provider: {
              "@type": "LocalBusiness",
              "@id": `${SITE_URL}/#business`,
              name: "Caraway — Cash for Cars Brisbane",
            },
            areaServed: { "@type": "City", name: "Brisbane" },
            serviceType: "Cash for Cars",
            url: canonicalUrl,
            image: `${SITE_URL}/images/tow-truck-hero.webp`,
            offers: {
              "@type": "AggregateOffer",
              priceCurrency: "AUD",
              lowPrice: "200",
              highPrice: "9999",
              description: "Offer depends on vehicle details, condition, completeness, location, and current market demand. Free car removal and towing included.",
              availability: "https://schema.org/InStock",
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10,
              reviewCount: reviews.length,
              bestRating: 5,
              worstRating: 1,
            },
          },
        ]}
      />
      <ServicePageTemplate service={service} />
    </>
  );
}
