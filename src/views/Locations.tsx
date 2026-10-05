import Link from "next/link";
import { ArrowRight, MapPin, Mountain, Phone, Sailboat, Sunrise, Sunset } from "lucide-react";
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
    icon: Mountain,
    areas: ["Auchenflower", "Taringa", "St Lucia", "Indooroopilly", "Paddington", "Chapel Hill", "Fig Tree Pocket", "Brookfield", "Bellbowrie", "The Gap"],
    links: [
      { label: "Toowong and inner west", href: "/locations/toowong" },
      { label: "Kenmore and western Brisbane", href: "/locations/kenmore" },
    ],
  },
  {
    title: "South Brisbane and south-west",
    icon: Sunset,
    areas: ["Annerley", "Rocklea", "Sunnybank", "Mount Gravatt"],
    links: [
      { label: "Moorooka and South Brisbane", href: "/locations/moorooka" },
    ],
  },
  {
    title: "Logan corridor",
    icon: MapPin,
    areas: ["Central Logan", "North-east Logan", "Southern Logan"],
    links: [
      { label: "Logan", href: "/locations/logan" },
      { label: "Springwood", href: "/locations/springwood" },
      { label: "Beenleigh", href: "/locations/beenleigh" },
    ],
  },
  {
    title: "North Brisbane and Moreton Bay",
    icon: Sunrise,
    areas: ["Chermside", "Nundah", "Stafford", "Everton Park", "Ascot", "Clayfield", "New Farm", "Newstead", "North Lakes", "Caboolture"],
    links: [
      { label: "Redcliffe and Moreton Bay", href: "/locations/redcliffe" },
    ],
  },
  {
    title: "East Brisbane, Redlands, and bayside",
    icon: Sailboat,
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
      icon={MapPin}
      breadcrumbs={breadcrumbs}
      eyebrow="Locations"
      title="Vehicle pickup areas across Greater Brisbane."
      subtitle={
        <p>
          Find your area, or{" "}
          <Link href="/#quote-form" className="text-primary font-medium link-underline">request a quote</Link>.
          Pickup is included when Caraway buys.
        </p>
      }
    >
      <div className="site-container py-14 sm:py-20 lg:py-24">
        <LocationsFilter items={locationItems} />

        <section className="mt-16 sm:mt-20" aria-labelledby="regional-coverage-heading">
          <h2
            id="regional-coverage-heading"
            className="text-2xl sm:text-3xl font-display text-foreground mb-8"
            style={{ letterSpacing: "var(--tracking-tight)" }}
          >
            Suburb not listed? Check your region.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {coverageRegions.map(({ title, icon: Icon, areas, links }) => (
              <article key={title} className="border border-border bg-card p-5 sm:p-6">
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center bg-secondary text-primary">
                    <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <h3 className="font-display text-lg text-foreground">{title}</h3>
                </div>
                <ul className="mb-4 flex flex-wrap gap-1.5" aria-label={`Areas in ${title}`}>
                  {areas.map((area) => (
                    <li key={area} className="bg-secondary px-2.5 py-1 text-xs text-foreground/80">
                      {area}
                    </li>
                  ))}
                </ul>
                <ul className="flex flex-wrap gap-x-5 gap-y-1">
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-primary link-underline">
                        {link.label}
                        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <div className="mt-16 mx-auto flex max-w-2xl flex-col items-center border border-border bg-secondary p-6 text-center sm:p-10">
          <span className="flex h-14 w-14 items-center justify-center bg-primary text-primary-foreground">
            <Phone className="h-7 w-7" strokeWidth={1.75} aria-hidden="true" />
          </span>
          <h2 className="mt-4 text-xl sm:text-2xl font-display text-foreground mb-2" style={{ letterSpacing: "var(--tracking-tight)" }}>Still not sure?</h2>
          <p className="text-muted-foreground mb-7">
            Send the exact address. We'll confirm coverage.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
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
              <Phone className="h-4 w-4" strokeWidth={1.5} aria-hidden />
              Call {BUSINESS.phoneDisplay}
            </a>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
