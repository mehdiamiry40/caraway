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

/** Service areas as a small directory: region, then the pages for it. */
export function ServiceAreas() {
  return (
    <section
      className="section-y border-y border-border bg-secondary"
      aria-label="Cash for cars service areas Brisbane"
    >
      <div className="site-container">
        <h2 className="type-h2 max-w-[18ch]">
          Pickup across Greater Brisbane.
        </h2>

        <ul className="mt-10 grid grid-cols-1 border-t-2 border-primary sm:grid-cols-2 sm:gap-x-10 lg:grid-cols-5 lg:gap-x-8">
          {REGIONS.map((region) => {
            const hubs = hubsFor(region);
            return (
              <li
                key={region.key}
                className="border-b border-border py-5 lg:border-b-0 lg:pb-0"
              >
                <h3 className="text-[1.0625rem] font-bold leading-snug text-foreground">
                  {region.label}
                </h3>
                <ul className="mt-1.5 flex flex-col items-start">
                  {hubs.map((hub) => (
                    <li key={hub.slug}>
                      <Link
                        href={`/locations/${hub.slug}`}
                        className="inline-flex min-h-11 items-center rounded-sm text-[0.9375rem] leading-snug text-accent-ink underline decoration-accent-ink/40 decoration-1 underline-offset-4 transition-colors hover:text-primary hover:decoration-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-secondary"
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

        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 lg:mt-10">
          <Link
            href="/locations"
            className={cn(buttonVariants({ variant: "outline" }), "ring-offset-secondary")}
          >
            View all areas
          </Link>
          <TrackedPhoneLink
            href={BUSINESS.phoneTel}
            location="service_areas"
            className="link-arrow text-base ring-offset-secondary"
            ariaLabel={`Not listed? Call ${BUSINESS.phoneDisplay}`}
          >
            Not listed? Call {BUSINESS.phoneDisplay}
          </TrackedPhoneLink>
        </div>
      </div>
    </section>
  );
}
