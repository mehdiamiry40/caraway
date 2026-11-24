import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { LocationsFilter } from "@/components/sections/LocationsFilter";
import { suburbs } from "@/data/suburbs";
import { BUSINESS } from "@/lib/site";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "Locations" }
];

const coverageRegions = [
  {
    title: "Inner west and western Brisbane",
    areas: ["Auchenflower", "Taringa", "St Lucia", "Indooroopilly", "Paddington", "Chapel Hill", "Fig Tree Pocket", "Brookfield", "Bellbowrie", "The Gap"],
    links: [
      { label: "Toowong and inner west", href: "/locations/toowong" },
      { label: "Kenmore and western Brisbane", href: "/locations/kenmore" },
    ],
  },
  {
    title: "South Brisbane and south-west",
    areas: ["Annerley", "Rocklea", "Sunnybank", "Mount Gravatt"],
    links: [
      { label: "Moorooka and South Brisbane", href: "/locations/moorooka" },
    ],
  },
  {
    title: "Logan corridor",
    areas: ["Central Logan", "North-east Logan", "Southern Logan"],
    links: [
      { label: "Logan", href: "/locations/logan" },
      { label: "Springwood", href: "/locations/springwood" },
      { label: "Beenleigh", href: "/locations/beenleigh" },
    ],
  },
  {
    title: "North Brisbane and Moreton Bay",
    areas: ["Chermside", "Nundah", "Stafford", "Everton Park", "Ascot", "Clayfield", "New Farm", "Newstead", "North Lakes", "Caboolture"],
    links: [
      { label: "Redcliffe and Moreton Bay", href: "/locations/redcliffe" },
    ],
  },
  {
    title: "East Brisbane, Redlands, and bayside",
    areas: ["Alexandra Hills", "Birkdale", "Wynnum", "Manly", "Carindale", "Bulimba", "Hawthorne"],
    links: [
      { label: "Capalaba and Brisbane bayside", href: "/locations/capalaba" },
    ],
  },
];

export default function Locations() {
  const locationItems = suburbs.map((suburb) => ({
    slug: suburb.slug,
    h1: suburb.h1,
    nearbyAreaNames: suburb.nearbyAreaNames,
  }));

  return (
    <PageShell
      breadcrumbs={breadcrumbs}
      title="Vehicle pickup areas across Greater Brisbane."
      subtitle={
        <p>
          Find your area, or{" "}
          <Link href="/#quote-form">get a free quote</Link>.
          Towing is free when we buy your car.
        </p>
      }
    >
      <div className="site-container py-10 sm:py-12 lg:py-16">
        <LocationsFilter items={locationItems} />

        <section className="mt-14" aria-labelledby="regional-coverage-heading">
          <div className="section-head">
            <h2 id="regional-coverage-heading" className="type-h2">
              Suburb not listed? Check your region.
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {coverageRegions.map(({ title, areas, links }) => (
              <article
                key={title}
                className="rounded-md border border-border border-t-4 border-t-accent px-5 pb-3 pt-4"
              >
                <h3 className="text-xl font-bold leading-snug text-primary">{title}</h3>
                <ul className="list-ticks mt-3 grid grid-cols-2 gap-x-6 gap-y-2.5 !space-y-0 text-base text-foreground sm:grid-cols-3" aria-label={`Areas in ${title}`}>
                  {areas.map((area) => (
                    <li key={area}>{area}</li>
                  ))}
                </ul>
                <ul className="mt-3 flex flex-wrap gap-x-7 border-t border-border pt-1">
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="link-arrow text-base">
                        {link.label}
                        <ArrowRight aria-hidden="true" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <div className="on-band mt-12 rounded-md bg-primary px-6 py-8 text-center text-on-dark-hi sm:px-8">
          <h2 className="type-h2 text-on-dark-hi">Still not sure?</h2>
          <p className="mt-2 text-lg text-on-dark-hi">
            Send the exact address. We'll confirm coverage.
          </p>
          <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/#quote-form"
              className={cn(buttonVariants({ variant: "outlineOnDark" }), "w-full ring-offset-primary sm:w-auto")}
            >
              Get my quote
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <a
              href={BUSINESS.phoneTel}
              className={cn(buttonVariants({ variant: "default" }), "w-full ring-offset-primary sm:w-auto")}
              aria-label={`Call ${BUSINESS.phoneDisplay}`}
            >
              <Phone className="h-4 w-4" aria-hidden />
              Call {BUSINESS.phoneDisplay}
            </a>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
