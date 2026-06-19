import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CarFront, Truck, Wrench } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { PageShell } from "@/components/layout/PageShell";
import { breadcrumbListSchema } from "@/lib/json-ld-schemas";
import { services } from "@/data/services";
import { BUSINESS, CONTENT_DEPLOY_DATE, SITE_URL } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Cash for Cars Services Brisbane",
  description: `Browse Caraway's Brisbane cash-for-cars services, including free car removal, damaged cars, old cars, scrap cars, unregistered cars, utes, 4WDs, and popular models. Call ${BUSINESS.phoneDisplay}.`,
  alternates: { canonical: "/services" },
  openGraph: {
    type: "website",
    url: "/services",
    title: "Cash for Cars Services Brisbane | Caraway",
    description:
      "Browse Caraway's Brisbane cash-for-cars services, from free car removal to damaged, scrap, old, and unregistered vehicles.",
    images: [
      {
        url: "/images/tow-truck-hero.webp",
        width: 1200,
        height: 800,
        alt: "Caraway cash for cars Brisbane services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cash for Cars Services Brisbane | Caraway",
    description:
      "Browse Caraway's Brisbane cash-for-cars services, from free car removal to damaged, scrap, old, and unregistered vehicles.",
    images: [
      {
        url: "/images/tow-truck-hero.webp",
        alt: "Caraway cash for cars Brisbane services",
      },
    ],
  },
};

const canonical = `${SITE_URL}/services`;

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
            name: "Cash for Cars Services Brisbane",
            description:
              "Browse Caraway's Brisbane vehicle buying, free towing, and cash-for-cars services.",
            isPartOf: { "@id": `${SITE_URL}/#website` },
            dateModified: CONTENT_DEPLOY_DATE,
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
        title="Cash-for-cars services across Brisbane."
        subtitle={
          <p>
            Find the right service for damaged, unwanted, old, scrap,
            unregistered, or model-specific vehicles.
          </p>
        }
      >
        <section className="bg-background py-12 sm:py-16 lg:py-20">
          <div className="site-container">
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => {
                const Icon = iconForService(service.slug);
                return (
                  <li key={service.slug}>
                    <Link
                      href={`/${service.slug}`}
                      className="group flex h-full flex-col border border-border bg-card p-5 transition-[border-color,box-shadow] duration-300 hover:border-primary/50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:p-6"
                    >
                      <span className="flex h-11 w-11 items-center justify-center bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <h2 className="mt-5 font-display text-lg font-semibold leading-snug text-primary">
                        {service.h1}
                      </h2>
                      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                        {service.intro}
                      </p>
                      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
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
      </PageShell>
    </>
  );
}
