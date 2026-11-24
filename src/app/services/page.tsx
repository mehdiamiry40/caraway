import type { Metadata } from "next";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Car, CarFront, CloudHail, FileX2, Recycle, Truck, Wrench } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { PageShell } from "@/components/layout/PageShell";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { breadcrumbListSchema } from "@/lib/json-ld-schemas";
import { services } from "@/data/services";
import {
  BUSINESS,
  OPEN_GRAPH_DEFAULTS,
  SERVICES_CONTENT_UPDATED,
  SHARED_PICKUP_IMAGE_ALT,
  SITE_URL,
} from "@/lib/site";

export const metadata: Metadata = {
  title: "Vehicle Buying Services in Brisbane",
  description: `Selling a used, unwanted, damaged, scrap, hail-damaged or unregistered car in Brisbane? Pick the Caraway service that fits. Call ${BUSINESS.phoneDisplay}.`,
  alternates: { canonical: "/services" },
  openGraph: {
    ...OPEN_GRAPH_DEFAULTS,
    type: "website",
    url: "/services",
    title: "Vehicle Buying Services in Brisbane | Caraway",
    description:
      "Selling a used, unwanted, damaged, scrap, hail-damaged or unregistered car in Brisbane? Pick the Caraway service that fits.",
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
      "Selling a used, unwanted, damaged, scrap, hail-damaged or unregistered car in Brisbane? Pick the Caraway service that fits.",
    images: [
      {
        url: "/images/tow-truck-hero.webp",
        alt: SHARED_PICKUP_IMAGE_ALT,
      },
    ],
  },
};

const canonical = `${SITE_URL}/services`;

const SERVICE_ICONS: Record<string, LucideIcon> = {
  "car-removal-brisbane": Truck,
  "sell-my-car-brisbane": CarFront,
  "scrap-car-removal-brisbane": Recycle,
  "damaged-cars-brisbane": Wrench,
  "unregistered-cars-brisbane": FileX2,
  "hail-damaged-cars-brisbane": CloudHail,
  "sell-toyota-hilux-brisbane": Car,
};
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
              "Caraway's car-buying and pickup services across Greater Brisbane.",
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
        title={SERVICE_HUB_HEADING}
        subtitle={
          <p>Pick the option that fits your car.</p>
        }
      >
        <section className="bg-background py-10 sm:py-12 lg:py-16">
          <div className="site-container">
            {/* One outlined box per service, each with a line icon; the whole
                box is the link. */}
            <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
              {services.map((service) => {
                const Icon = SERVICE_ICONS[service.slug] ?? CarFront;
                return (
                  <li key={service.slug}>
                    <Link
                      href={`/${service.slug}`}
                      className="group flex h-full flex-col items-center gap-3 rounded-sm border-2 border-accent px-3 py-7 text-center transition-colors duration-150 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:px-5"
                    >
                      <Icon className="h-12 w-12 text-accent group-hover:text-accent-foreground sm:h-14 sm:w-14" strokeWidth={1.5} aria-hidden="true" />
                      <h2 className="text-lg font-bold leading-snug text-primary text-balance group-hover:text-accent-foreground sm:text-xl">
                        {service.h1.split(" — ")[0]}
                      </h2>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
        <FinalCTA tone="green" />
      </PageShell>
    </>
  );
}
