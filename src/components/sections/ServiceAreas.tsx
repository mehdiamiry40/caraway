import Link from "next/link";
import { suburbs } from "@/data/suburbs";
import { BUSINESS } from "@/lib/site";
import { TrackedPhoneLink } from "@/components/layout/TrackedPhoneLink";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type RegionKey = "north" | "south" | "west" | "bayside" | "logan";

interface Region {
  key: RegionKey;
  label: string;
  slugs: string[];
}

const REGIONS: Region[] = [
  { key: "north", label: "North & Moreton Bay", slugs: ["redcliffe"] },
  { key: "south", label: "South", slugs: ["moorooka"] },
  { key: "west", label: "West", slugs: ["toowong", "kenmore"] },
  { key: "bayside", label: "East & Bayside", slugs: ["capalaba"] },
  { key: "logan", label: "Logan", slugs: ["logan", "springwood", "beenleigh"] },
];

function hubsFor(region: Region) {
  return region.slugs
    .map((slug) => suburbs.find((s) => s.slug === slug))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));
}

/** Service areas: a centred heading over a green-tick grid of area pages. */
export function ServiceAreas() {
  return (
    <section
      className="section-y bg-secondary"
      aria-label="Cash for cars service areas Brisbane"
    >
      <div className="site-container">
        <div className="section-head">
          <h2 className="type-h2">
            Pickup across Greater Brisbane.
          </h2>
        </div>

        <ul className="grid grid-cols-1 gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-5">
          {REGIONS.map((region) => {
            const hubs = hubsFor(region);
            return (
              <li key={region.key}>
                <h3 className="text-lg font-bold leading-snug text-accent-ink">
                  {region.label}
                </h3>
                <ul className="list-ticks mt-2 !space-y-0">
                  {hubs.map((hub) => (
                    <li key={hub.slug} className="before:!top-[0.6rem]">
                      <Link
                        href={`/locations/${hub.slug}`}
                        className="inline-flex min-h-11 items-center rounded-sm text-[1.0625rem] font-semibold leading-snug text-primary underline decoration-primary/40 decoration-1 underline-offset-4 transition-colors hover:decoration-primary hover:decoration-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-secondary"
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

        <div className="mt-9 flex flex-col items-center gap-x-8 gap-y-3 sm:flex-row sm:justify-center">
          <Link
            href="/locations"
            className={cn(buttonVariants({ variant: "outline" }), "ring-offset-secondary")}
          >
            View all areas
          </Link>
          <TrackedPhoneLink
            href={BUSINESS.phoneTel}
            location="service_areas"
            className="link-arrow text-[1.0625rem] ring-offset-secondary"
            ariaLabel={`Not listed? Call ${BUSINESS.phoneDisplay}`}
          >
            Not listed? Call {BUSINESS.phoneDisplay}
          </TrackedPhoneLink>
        </div>
      </div>
    </section>
  );
}
