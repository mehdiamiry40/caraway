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
        title={SERVICE_HUB_HEADING}
        subtitle={
          <p>Pick the option that fits your vehicle.</p>
        }
      >
        <section className="bg-background py-10 sm:py-14 lg:py-20">
          <div className="site-container">
            {/* A numbered index rather than a wall of tiles: each service is
                one line, and the whole line is the link. */}
            <ul className="grid grid-cols-1 border-t-2 border-primary [counter-reset:service] lg:grid-cols-2 lg:gap-x-16">
              {services.map((service) => (
                <li key={service.slug} className="border-b border-border [counter-increment:service]">
                  <Link
                    href={`/${service.slug}`}
                    className="group grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-x-3 py-5 before:font-display before:text-xl before:font-semibold before:tabular-nums before:text-accent before:content-[counter(service)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:grid-cols-[3rem_1fr_auto] sm:py-6 sm:before:text-[1.375rem]"
                  >
                    <h2 className="font-display text-[1.375rem] font-semibold leading-tight tracking-[-0.02em] text-primary decoration-cta decoration-2 underline-offset-[6px] group-hover:underline sm:text-[1.5rem]">
                      {service.h1.split(" — ")[0]}
                    </h2>
                    <ArrowRight
                      className="h-5 w-5 self-center text-primary/45 transition-[transform,color] group-hover:translate-x-1 group-hover:text-primary"
                      aria-hidden="true"
                    />
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
