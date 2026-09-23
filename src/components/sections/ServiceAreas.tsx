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
  description: string;
  slugs: string[];
}

const REGIONS: Region[] = [
  {
    key: "north",
    label: "North & Moreton Bay",
    description: "Redcliffe, Chermside, North Lakes, Caboolture",
    slugs: ["redcliffe"],
  },
  {
    key: "south",
    label: "South",
    description: "Moorooka, Rocklea, Sunnybank, Mt Gravatt",
    slugs: ["moorooka"],
  },
  {
    key: "west",
    label: "West",
    description: "Toowong, Indooroopilly, Kenmore, The Gap",
    slugs: ["toowong", "kenmore"],
  },
  {
    key: "bayside",
    label: "East & Bayside",
    description: "Capalaba, Wynnum, Manly, Carindale",
    slugs: ["capalaba"],
  },
  {
    key: "logan",
    label: "Logan",
    description: "Logan Central, Springwood, Beenleigh, Browns Plains",
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
      className="section-y border-t border-border"
      aria-label="Cash for cars service areas Brisbane"
    >
      <div className="site-container grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <p className="eyebrow mb-4">Service areas</p>
          <h2 className="text-3xl font-semibold leading-[1.15] tracking-[-0.02em] text-foreground text-balance">
            Pickup included across Greater Brisbane when we buy.
          </h2>
          <p className="mt-5 text-base text-muted-foreground">
            Not listed?{" "}
            <TrackedPhoneLink
              href={BUSINESS.phoneTel}
              location="service_areas"
              className="rounded-sm text-foreground tabular-nums underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              ariaLabel={`Call ${BUSINESS.phoneDisplay}`}
            >
              Call {BUSINESS.phoneDisplay}
            </TrackedPhoneLink>{" "}
            and we&apos;ll check your address.
          </p>
        </div>

        <div className="lg:col-span-8">
          <ul className="grid grid-cols-1 gap-x-10 gap-y-8 border-t border-border pt-8 sm:grid-cols-2 md:grid-cols-3">
            {REGIONS.map((region) => {
              const hubs = hubsFor(region);
              return (
                <li key={region.key}>
                  <h3 className="text-base font-semibold text-foreground">{region.label}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{region.description}</p>
                  <ul className="mt-2">
                    {hubs.map((hub) => (
                      <li key={hub.slug}>
                        <Link
                          href={`/locations/${hub.slug}`}
                          className="inline-flex min-h-11 items-center rounded-sm text-sm text-primary underline decoration-primary/35 underline-offset-4 transition-colors duration-150 hover:decoration-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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

          <Link href="/locations" className={cn(buttonVariants({ variant: "link" }), "mt-8")}>
            View regional coverage
          </Link>
        </div>
      </div>
    </section>
  );
}
