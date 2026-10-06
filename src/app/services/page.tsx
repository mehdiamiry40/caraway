import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, LayoutGrid } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { PageShell } from "@/components/layout/PageShell";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { breadcrumbListSchema } from "@/lib/json-ld-schemas";
import { serviceIcon } from "@/lib/service-icons";
import { services } from "@/data/services";
import {
  BUSINESS,
  OPEN_GRAPH_DEFAULTS,
  SERVICES_CONTENT_UPDATED,
  SHARED_PICKUP_IMAGE_ALT,
  SITE_URL,
} from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Vehicle Buying Services in Brisbane",
  description: `Browse Caraway's Brisbane vehicle-buying options for used, unwanted, damaged, scrap, hail-damaged, and unregistered vehicles. Call ${BUSINESS.phoneDisplay}.`,
  alternates: { canonical: "/services" },
  openGraph: {
    ...OPEN_GRAPH_DEFAULTS,
    type: "website",
    url: "/services",
    title: "Vehicle Buying Services in Brisbane | Caraway",
    description:
      "Browse Caraway's Brisbane vehicle-buying options for used, unwanted, damaged, scrap, hail-damaged, and unregistered vehicles.",
    images: [
      {
        url: "/images/tow-truck-hero.webp",
        width: 800,
        height: 800,
        alt: SHARED_PICKUP_IMAGE_ALT,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vehicle Buying Services in Brisbane | Caraway",
    description:
      "Browse Caraway's Brisbane vehicle-buying options for used, unwanted, damaged, scrap, hail-damaged, and unregistered vehicles.",
    images: [
      {
        url: "/images/tow-truck-hero.webp",
        alt: SHARED_PICKUP_IMAGE_ALT,
      },
    ],
  },
};

const canonical = `${SITE_URL}/services`;
export const SERVICE_HUB_HEADING = "Vehicle buying options across Brisbane.";

export default function ServicesPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbListSchema([
            { name: "Home", item: `${SITE_URL}/` },
            { name: "Services", item: canonical },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "@id": `${canonical}#webpage`,
            url: canonical,
            name: "Caraway vehicle buying services",
            description:
              "Browse Caraway's vehicle-buying and collection options across Greater Brisbane.",
            isPartOf: { "@id": `${SITE_URL}/#website` },
            dateModified: SERVICES_CONTENT_UPDATED,
            mainEntity: {
              "@type": "ItemList",
              itemListElement: services.map((service, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: service.h1,
                url: `${SITE_URL}/${service.slug}`,
              })),
            },
          },
        ]}
      />
      <PageShell
        icon={LayoutGrid}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Services" },
        ]}
        eyebrow="Services"
        title={SERVICE_HUB_HEADING}
        subtitle={
          <p>Pick the option that fits your vehicle.</p>
        }
      >
        <section className="bg-background py-12 sm:py-16 lg:py-20">
          <div className="site-container">
            <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {services.map((service) => {
                const Icon = serviceIcon(service.slug);
                return (
                  <li key={service.slug}>
                    <Link
                      href={`/${service.slug}`}
                      className="group flex h-full flex-col items-center gap-4 border border-border bg-card px-3 py-7 text-center card-lift hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:px-5 sm:py-9"
                    >
                      <span className="flex h-16 w-16 items-center justify-center bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground sm:h-20 sm:w-20">
                        <Icon className="h-8 w-8 sm:h-10 sm:w-10" strokeWidth={1.5} aria-hidden="true" />
                      </span>
                      <h2 className="font-display text-sm font-semibold leading-snug text-primary text-balance sm:text-base">
                        {service.h1.split(" — ")[0]}
                      </h2>
                      <ArrowRight
                        className="mt-auto h-4 w-4 text-accent-ink transition-transform group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
        <FinalCTA />
      </PageShell>
    </>
  );
}
