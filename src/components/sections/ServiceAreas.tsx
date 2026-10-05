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
      className="section-y bg-background"
      aria-label="Cash for cars service areas Brisbane"
    >
      <div className="site-container">
        <div className="mb-10 text-center md:mb-12">
          <p className="eyebrow mb-4">Service areas</p>
          <h2 className="text-3xl sm:text-4xl md:text-[2.5rem] font-display font-bold text-primary leading-[1.1] text-balance">
            Pickup across Greater Brisbane.
          </h2>
        </div>

        <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
          {REGIONS.map((region) => {
            const Icon = region.icon;
            const hubs = hubsFor(region);
            return (
              <li
                key={region.key}
                className="flex h-full flex-col items-center border border-border bg-card p-5 text-center last:col-span-2 lg:last:col-span-1"
              >
                <span className="flex h-14 w-14 items-center justify-center bg-secondary text-primary">
                  <Icon className="h-7 w-7" strokeWidth={1.75} aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-display text-base font-semibold text-foreground sm:text-lg">
                  {region.label}
                </h3>
                <ul className="mt-3 flex flex-wrap justify-center gap-1.5">
                  {hubs.map((hub) => (
                    <li key={hub.slug}>
                      <Link
                        href={`/locations/${hub.slug}`}
                        className="inline-flex min-h-11 items-center rounded-none border border-border bg-secondary px-3 py-1 text-xs text-foreground/85 transition-colors hover:border-primary/50 hover:bg-primary/10 hover:text-primary"
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

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm">
          <Link
            href="/locations"
            className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-primary link-underline"
          >
            <MapPin className="h-4 w-4" aria-hidden="true" />
            View all areas
          </Link>
          <TrackedPhoneLink
            href={BUSINESS.phoneTel}
            location="service_areas"
            className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-primary link-underline"
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
