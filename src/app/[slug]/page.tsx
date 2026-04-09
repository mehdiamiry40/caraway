import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import ServicePageTemplate from "@/components/templates/ServicePageTemplate";
import { getServiceBySlug, services } from "@/data/services";
import { breadcrumbListSchema } from "@/lib/breadcrumb-schema";
import { SITE_URL } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) {
    return {
      title: "Page not found | Caraway",
      robots: { index: false, follow: false },
    };
  }
  return {
    title: service.title,
    description: service.metaDescription,
    alternates: { canonical: `/${service.slug}` },
    openGraph: {
      title: service.title,
      description: service.metaDescription,
      url: `/${service.slug}`,
      images: [{ url: "/images/tow-truck-hero.webp", width: 1200, height: 800, alt: "Caraway cash for cars Brisbane" }],
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function ServiceSlugPage({ params }: Props) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const canonicalUrl = `${SITE_URL}/${service.slug}`;
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: service.h1 },
  ];

  const pageStructuredData = [
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
        "@type": "Offer",
        priceCurrency: "AUD",
        price: "0",
        description: "Free car removal and towing included",
        availability: "https://schema.org/InStock",
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: service.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    },
    breadcrumbListSchema(breadcrumbs, canonicalUrl),
  ];

  return (
    <>
      <JsonLd data={pageStructuredData} />
      <ServicePageTemplate service={service} />
    </>
  );
}
