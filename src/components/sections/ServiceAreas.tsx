import Link from "next/link";
import {
  MapPin,
  Phone,
  Mountain,
  Sailboat,
  Sunrise,
  Sunset,
} from "lucide-react";
import { suburbs } from "@/data/suburbs";
import { BUSINESS } from "@/lib/site";
import { TrackedPhoneLink } from "@/components/layout/TrackedPhoneLink";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type RegionKey = "north" | "south" | "west" | "bayside" | "logan";

interface Region {
  key: RegionKey;
  label: string;
  icon: typeof MapPin;
  slugs: string[];
}

const REGIONS: Region[] = [
  {
    key: "north",
    label: "North & Moreton Bay",
    icon: Sunrise,
    slugs: ["redcliffe"],
  },
  {
    key: "south",
    label: "South",
    icon: Sunset,
    slugs: ["moorooka"],
  },
  {
    key: "west",
    label: "West",
    icon: Mountain,
    slugs: ["toowong", "kenmore"],
  },
  {
    key: "bayside",
    label: "East & Bayside",
    icon: Sailboat,
    slugs: ["capalaba"],
  },
  {
    key: "logan",
    label: "Logan",
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
      className="section-y border-y border-border bg-secondary"
      aria-label="Cash for cars service areas Brisbane"
    >
      <div className="site-container">
        <div className="mb-10 max-w-3xl md:mb-12">
          <p className="eyebrow">Service areas</p>
          <h2 className="display-impact mt-4 text-[2.5rem] text-foreground sm:text-[3.5rem]">
            Pickup across Greater Brisbane.
          </h2>
        </div>

        <ul className="grid grid-cols-2 gap-px border border-border bg-border lg:grid-cols-5">
          {REGIONS.map((region) => {
            const Icon = region.icon;
            const hubs = hubsFor(region);
            return (
              <li
                key={region.key}
                className="flex h-full flex-col items-start bg-card p-5 last:col-span-2 sm:p-6 lg:last:col-span-1"
              >
                <span className="flex h-11 w-11 items-center justify-center bg-ink text-cta-bright">
                  <Icon className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-display text-2xl font-bold leading-[1.1] text-foreground">
                  {region.label}
                </h3>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {hubs.map((hub) => (
                    <li key={hub.slug}>
                      <Link
                        href={`/locations/${hub.slug}`}
                        className="inline-flex min-h-11 items-center border border-border bg-secondary px-3 py-1 text-sm font-medium text-foreground transition-colors hover:border-cta hover:bg-cta hover:text-cta-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        {hub.h1.replace("Cash for Cars ", "")}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>

        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 text-[0.9375rem]">
          <Link
            href="/locations"
            className={cn(buttonVariants({ variant: "primary" }), "group")}
          >
            <MapPin className="h-5 w-5 text-cta-bright" aria-hidden="true" />
            View all areas
          </Link>
          <TrackedPhoneLink
            href={BUSINESS.phoneTel}
            location="service_areas"
            className="inline-flex min-h-11 items-center gap-1.5 text-base font-semibold text-accent-ink link-underline"
            ariaLabel={`Not listed? Call ${BUSINESS.phoneDisplay}`}
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            Not listed? Call {BUSINESS.phoneDisplay}
          </TrackedPhoneLink>
        </div>
      </div>
    </section>
  );
}
