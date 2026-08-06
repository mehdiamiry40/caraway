import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbListSchema, serviceSchema } from "@/lib/json-ld-schemas";
import ServicePageTemplate from "@/components/templates/ServicePageTemplate";
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
      siteName: "Caraway",
      locale: "en_AU",
      title: service.title,
      description: service.metaDescription,
      url: `${SITE_URL}/${service.slug}`,
      images: [{ url: "/images/og-card.jpg", width: 1200, height: 630, alt: "Caraway cash for cars Brisbane" }],
    },
    twitter: {
      card: "summary_large_image",
      title: service.title,
      description: service.metaDescription,
      images: [{ url: "/images/og-card.jpg", alt: "Caraway cash for cars Brisbane" }],
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
          serviceSchema({
            id: `${canonicalUrl}#service`,
            url: canonicalUrl,
            name: service.h1,
            description: service.metaDescription,
            serviceType: service.slug.includes("removal")
              ? "Vehicle removal service"
              : "Vehicle buying service",
            image: `${SITE_URL}/images/tow-truck-hero.webp`,
          }),
        ]}
      />
      <ServicePageTemplate service={service} />
    </>
  );
}
