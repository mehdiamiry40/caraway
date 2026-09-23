import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
        <section className="py-16 sm:py-20 lg:py-28">
          <div className="site-container">
            <ul className="grid grid-cols-1 gap-x-10 md:grid-cols-2">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/${service.slug}`}
                    className="group flex h-full flex-col border-t border-border py-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <div className="flex items-baseline justify-between gap-4">
                      <h2 className="text-lg font-semibold text-foreground underline decoration-transparent underline-offset-4 transition-colors duration-150 group-hover:decoration-foreground/40">
                        {service.h1}
                      </h2>
                      <ArrowRight
                        className="h-4 w-4 shrink-0 translate-y-0.5 text-muted-foreground transition-colors duration-150 group-hover:text-foreground"
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                    </div>
                    <p className="mt-2 line-clamp-2 max-w-[60ch] text-sm text-muted-foreground">
                      {service.intro}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
        <FinalCTA />
      </PageShell>
    </>
  );
}
