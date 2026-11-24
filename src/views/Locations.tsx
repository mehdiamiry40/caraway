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
          <Link href="/#quote-form" className="text-accent-ink font-medium link-underline">request a quote</Link>.
          Pickup is included when Caraway buys.
        </p>
      }
    >
      <div className="site-container py-12 sm:py-16 lg:py-20">
        <LocationsFilter items={locationItems} />

        <section className="mt-16 sm:mt-20" aria-labelledby="regional-coverage-heading">
          <h2 id="regional-coverage-heading" className="type-h2">
            Suburb not listed? Check your region.
          </h2>
          <div className="mt-8 border-t-2 border-primary">
            {coverageRegions.map(({ title, areas, links }) => (
              <article
                key={title}
                className="grid grid-cols-1 gap-x-10 gap-y-2 border-b border-border py-6 lg:grid-cols-12"
              >
                <h3 className="text-lg font-bold leading-snug text-foreground lg:col-span-4">{title}</h3>
                <div className="lg:col-span-8">
                  <ul className="list-inline text-base leading-7 text-foreground/80" aria-label={`Areas in ${title}`}>
                    {areas.map((area) => (
                      <li key={area}>{area}</li>
                    ))}
                  </ul>
                  <ul className="mt-1 flex flex-wrap gap-x-7">
                    {links.map((link) => (
                      <li key={link.href}>
                        <Link href={link.href} className="link-arrow text-[0.9375rem]">
                          {link.label}
                          <ArrowRight aria-hidden="true" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className="mt-14 max-w-2xl">
          <h2 className="type-h2">Still not sure?</h2>
          <p className="mt-3 text-[1.0625rem] text-foreground/80">
            Send the exact address. We'll confirm coverage.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/#quote-form"
              className={cn(buttonVariants({ variant: "default" }), "w-full sm:w-auto")}
            >
              Get my quote
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <a
              href={BUSINESS.phoneTel}
              className={cn(buttonVariants({ variant: "outline" }), "w-full sm:w-auto")}
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
