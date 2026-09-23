import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CarFront, Truck, Wrench } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { PageShell } from "@/components/layout/PageShell";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { breadcrumbListSchema } from "@/lib/json-ld-schemas";
import { cn } from "@/lib/utils";
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

const iconForService = (slug: string) => {
  if (slug.includes("removal") || slug.includes("scrap") || slug.includes("junk")) {
    return Truck;
  }
  if (slug.includes("damaged") || slug.includes("accident") || slug.includes("write-off")) {
    return Wrench;
  }
  return CarFront;
};

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
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Services" },
        ]}
        eyebrow="Services"
        title={SERVICE_HUB_HEADING}
        subtitle={
          <p>
            Find the right assessment path for a used, unwanted, damaged,
            scrap, hail-damaged, or unregistered vehicle.
          </p>
        }
      >
        <section className="bg-background py-12 sm:py-16 lg:py-20">
          <div className="site-container">
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service, index) => {
                const Icon = iconForService(service.slug);
                // The first (primary) service spans two columns on desktop as
                // a dark feature card; with eight services that also fills
                // the 3-column grid's last row.
                const featured = index === 0;
                return (
                  <li key={service.slug} className={featured ? "lg:col-span-2" : undefined}>
                    <Link
                      href={`/${service.slug}`}
                      className={cn(
                        "group flex h-full flex-col border p-5 card-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:p-6",
                        featured
                          ? "border-primary bg-primary text-on-dark-hi lg:p-8"
                          : "border-border bg-card hover:border-primary/50",
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-11 w-11 items-center justify-center rounded-xl transition-colors",
                          featured
                            ? "bg-cta text-cta-foreground"
                            : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground",
                        )}
                      >
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <h2
                        className={cn(
                          "mt-5 font-display font-semibold leading-snug",
                          featured ? "text-xl text-on-dark-hi sm:text-2xl" : "text-lg text-primary",
                        )}
                      >
                        {service.h1}
                      </h2>
                      <p
                        className={cn(
                          "mt-3 text-sm leading-relaxed",
                          featured
                            ? "line-clamp-4 max-w-2xl text-on-dark-hi/85 sm:text-base"
                            : "line-clamp-3 text-muted-foreground",
                        )}
                      >
                        {service.intro}
                      </p>
                      <span
                        className={cn(
                          "mt-5 inline-flex items-center gap-1.5 text-sm font-semibold",
                          featured ? "text-cta-bright" : "text-primary",
                        )}
                      >
                        View service
                        <ArrowRight
                          className="h-4 w-4 transition-transform group-hover:translate-x-1"
                          aria-hidden="true"
                        />
                      </span>
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
