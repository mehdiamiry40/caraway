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
      className="section-y bg-primary text-on-dark-hi"
      aria-label="Cash for cars service areas Brisbane"
    >
      <div className="site-container">
        <div className="mb-12 flex flex-col gap-6 md:mb-16 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <h2 className="max-w-2xl font-display text-[clamp(2rem,3.4vw,2.9rem)] leading-[1.15] text-on-dark-hi text-balance">
            Pickup included across Greater Brisbane when we buy.
          </h2>
          {/* The region list that used to open this line is the grid below. */}
          <p className="max-w-md text-[0.9375rem] leading-relaxed text-on-dark-hi/85">
            If your suburb is not listed, ask. We confirm coverage from the
            exact address, access, vehicle details, and collection schedule.
          </p>
        </div>

        <ul className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-8">
          {REGIONS.map((region) => {
            const Icon = region.icon;
            const hubs = hubsFor(region);
            return (
              <li key={region.key} className="flex flex-col">
                <h3 className="flex items-center gap-2.5 border-b border-accent pb-4 font-display text-[1.25rem] leading-snug text-on-dark-hi">
                  <Icon size={18} strokeWidth={1.75} className="shrink-0 text-cta-bright" aria-hidden="true" />
                  {region.label}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-on-dark-hi/80">
                  {region.description}
                </p>
                <ul className="mt-3 flex flex-col">
                  {hubs.map((hub) => (
                    <li key={hub.slug}>
                      <Link
                        href={`/locations/${hub.slug}`}
                        className="inline-flex min-h-11 items-center gap-1 text-sm text-on-dark-hi underline decoration-on-dark-hi/30 underline-offset-4 transition-colors hover:text-cta-bright hover:decoration-cta-bright"
                      >
                        {hub.h1.replace("Cash for Cars ", "")}
                        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>

        <div className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-on-dark-hi/20 pt-8">
          <Link
            href="/locations"
            className="inline-flex min-h-11 items-center gap-1.5 text-sm text-on-dark-hi underline decoration-accent underline-offset-4 hover:text-cta-bright"
          >
            View regional coverage
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </Link>
          <p className="text-sm text-on-dark-hi/80">
            Not listed?{" "}
            <TrackedPhoneLink
              href={BUSINESS.phoneTel}
              location="service_areas"
              className="rounded-sm text-on-dark-hi underline decoration-accent underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-on-dark-hi/70"
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
