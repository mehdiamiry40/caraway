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
      className="section-y bg-secondary/60"
      aria-label="Cash for cars service areas Brisbane"
    >
      <div className="site-container">
        <div className="mb-10 max-w-3xl md:mb-14">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">Service areas</p>
          <h2 className="font-display text-[2rem] font-medium leading-[1.15] text-foreground sm:text-5xl sm:leading-[3.5rem] text-balance">
            Pickup across Greater Brisbane.
          </h2>
        </div>

        <ul className="grid grid-cols-2 gap-px bg-border lg:grid-cols-5">
          {REGIONS.map((region) => {
            const Icon = region.icon;
            const hubs = hubsFor(region);
            return (
              <li
                key={region.key}
                className="flex h-full flex-col items-start bg-background p-6 last:col-span-2 lg:last:col-span-1"
              >
                <Icon className="h-7 w-7 text-foreground" strokeWidth={1.5} aria-hidden="true" />
                <h3 className="mt-5 font-display text-lg font-medium text-foreground sm:text-xl">
                  {region.label}
                </h3>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {hubs.map((hub) => (
                    <li key={hub.slug}>
                      <Link
                        href={`/locations/${hub.slug}`}
                        className="inline-flex min-h-11 items-center bg-secondary px-3 py-1 text-sm text-foreground transition-colors hover:bg-foreground hover:text-background"
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

        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-[0.9375rem]">
          <Link
            href="/locations"
            className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-accent-ink link-underline"
          >
            <MapPin className="h-4 w-4" aria-hidden="true" />
            View all areas
          </Link>
          <TrackedPhoneLink
            href={BUSINESS.phoneTel}
            location="service_areas"
            className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-accent-ink link-underline"
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
