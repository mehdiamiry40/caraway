import Link from "next/link";
import {
  ArrowUpRight,
  MapPin,
  Mountain,
  Sailboat,
  Sunrise,
  Sunset,
} from "lucide-react";
import { suburbs } from "@/data/suburbs";
import { BUSINESS } from "@/lib/site";
import { TrackedPhoneLink } from "@/components/layout/TrackedPhoneLink";

type RegionKey = "north" | "south" | "west" | "bayside" | "logan";

interface Region {
  key: RegionKey;
  label: string;
  description: string;
  icon: typeof MapPin;
  slugs: string[];
}

const REGIONS: Region[] = [
  {
    key: "north",
    label: "North & Moreton Bay",
    description: "Redcliffe, Chermside, North Lakes, Caboolture",
    icon: Sunrise,
    slugs: ["redcliffe"],
  },
  {
    key: "south",
    label: "South",
    description: "Moorooka, Rocklea, Sunnybank, Mt Gravatt",
    icon: Sunset,
    slugs: ["moorooka"],
  },
  {
    key: "west",
    label: "West",
    description: "Toowong, Indooroopilly, Kenmore, The Gap",
    icon: Mountain,
    slugs: ["toowong", "kenmore"],
  },
  {
    key: "bayside",
    label: "East & Bayside",
    description: "Capalaba, Wynnum, Manly, Carindale",
    icon: Sailboat,
    slugs: ["capalaba"],
  },
  {
    key: "logan",
    label: "Logan",
    description: "Logan Central, Springwood, Beenleigh, Browns Plains",
    icon: MapPin,
    slugs: ["logan", "springwood", "beenleigh"],
  },
];

function hubsFor(region: Region) {
  return region.slugs
    .map((slug) => suburbs.find((s) => s.slug === slug))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));
}

export function ServiceAreas() {
  return (
    <section
      className="section-y border-b border-border bg-background"
      aria-label="Cash for cars service areas Brisbane"
    >
      <div className="site-container">
        <div className="mb-12 max-w-3xl md:mb-16">
          <p className="eyebrow mb-5">Service areas</p>
          <h2 className="font-display text-[clamp(2.7rem,5vw,4.5rem)] font-semibold leading-[1.02] tracking-display text-foreground">
            Pickup included across
            <br />
            Greater Brisbane when we buy.
          </h2>
          {/* The region list that used to open this line is the grid below. */}
          <p className="mt-5 text-foreground/80 leading-relaxed text-base sm:text-lg max-w-xl">
            If your suburb is not listed, ask. We confirm coverage from the
            exact address, access, vehicle details, and collection schedule.
          </p>
        </div>

        <div>
          <ul className="grid grid-cols-1 gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {REGIONS.map((region) => {
              const Icon = region.icon;
              const hubs = hubsFor(region);
              return (
                <li key={region.key} className="h-full">
                  <article className="group relative flex min-h-64 h-full flex-col overflow-hidden bg-card p-6 transition-colors duration-300 hover:bg-muted sm:p-7">
                    <div className="relative flex items-center justify-between">
                      <span className="flex h-10 w-10 items-center justify-center border border-primary/30 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                        <Icon size={18} strokeWidth={2} aria-hidden="true" />
                      </span>
                      <span className="inline-flex items-center gap-1.5 border border-border bg-background px-2.5 py-1 font-mono text-[0.625rem] font-medium tabular-nums tracking-[0.08em] text-muted-foreground">
                        <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-cta" />
                        {hubs.length} {hubs.length === 1 ? "guide" : "guides"}
                      </span>
                    </div>
                    <h3 className="relative mt-8 font-display text-xl text-foreground sm:text-2xl">
                      {region.label}
                    </h3>
                    <p className="relative mt-1 text-[0.9375rem] text-foreground/80 leading-relaxed">
                      {region.description}
                    </p>
                    <ul className="relative mt-4 hidden flex-wrap gap-1.5 sm:flex">
                      {hubs.map((hub) => (
                        <li key={hub.slug}>
                          <Link
                            href={`/locations/${hub.slug}`}
                            className="inline-flex min-h-11 items-center gap-1 border border-border bg-background px-2.5 py-1 text-xs text-foreground/85 transition-colors hover:border-primary/50 hover:bg-primary/10 hover:text-primary"
                          >
                            {hub.h1.replace("Cash for Cars ", "")}
                          </Link>
                        </li>
                      ))}
                    </ul>
                    {hubs[0] && (
                      <Link
                        href={`/locations/${hubs[0].slug}`}
                        className="relative mt-4 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-primary sm:hidden"
                      >
                        View {region.label} areas
                        <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    )}
                  </article>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3">
          <Link
            href="/locations"
            className="inline-flex items-center gap-1.5 text-sm text-primary link-underline"
          >
            View regional coverage
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </Link>
          <p className="text-xs text-foreground/70 font-medium">
            Not listed?{" "}
            <TrackedPhoneLink
              href={BUSINESS.phoneTel}
              location="service_areas"
              className="rounded-sm text-primary underline decoration-primary/70 underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              ariaLabel={`Call ${BUSINESS.phoneDisplay}`}
            >
              Call {BUSINESS.phoneDisplay}
            </TrackedPhoneLink>{" "}
            — we&apos;ll check availability for your address.
          </p>
        </div>
      </div>
    </section>
  );
}
