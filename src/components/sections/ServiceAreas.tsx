import Link from "next/link";
import {
  ArrowUpRight,
  Compass,
  MapPin,
  Mountain,
  Sailboat,
  Sunrise,
  Sunset,
} from "lucide-react";
import { suburbs } from "@/data/suburbs";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/motion";

type RegionKey = "north" | "south" | "east" | "west" | "bayside" | "logan";

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
    label: "North",
    description: "Chermside, Redcliffe, North Lakes, Caboolture",
    icon: Sunrise,
    slugs: ["north-brisbane", "chermside", "north-lakes", "redcliffe", "caboolture"],
  },
  {
    key: "south",
    label: "South",
    description: "Moorooka, Sunnybank, Mt Gravatt, Woolloongabba",
    icon: Sunset,
    slugs: ["south-brisbane", "moorooka", "sunnybank", "mount-gravatt"],
  },
  {
    key: "east",
    label: "East",
    description: "Carindale, Carina, Tingalpa",
    icon: Compass,
    slugs: ["carindale"],
  },
  {
    key: "west",
    label: "West",
    description: "Toowong, Indooroopilly, Kenmore, The Gap",
    icon: Mountain,
    slugs: ["toowong", "indooroopilly", "kenmore", "the-gap"],
  },
  {
    key: "bayside",
    label: "Bayside",
    description: "Wynnum, Manly, Cleveland, Capalaba",
    icon: Sailboat,
    slugs: ["bayside-brisbane", "capalaba"],
  },
  {
    key: "logan",
    label: "Logan & Ipswich",
    description: "Logan, Ipswich, Springwood, Browns Plains, Beenleigh",
    icon: MapPin,
    slugs: ["logan", "ipswich", "springwood", "browns-plains", "beenleigh"],
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
      className="section-y bg-secondary border-t border-b border-border"
      aria-label="Cash for cars service areas Brisbane"
    >
      <div className="site-container">
        <Reveal className="max-w-2xl mb-12 md:mb-16">
          <p className="eyebrow mb-5">Service areas</p>
          <h2 className="text-3xl sm:text-4xl md:text-[2.5rem] font-display text-foreground leading-[1.1] text-balance">
            Free pickup across
            <br />
            Greater Brisbane.
          </h2>
          <p className="mt-5 text-foreground/80 leading-relaxed text-base sm:text-lg max-w-xl">
            Brisbane, Ipswich, Logan, Redlands, and the Moreton Bay region.
            If you&apos;re a bit further out, ask — we usually make it work.
          </p>
        </Reveal>

        <RevealGroup>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {REGIONS.map((region) => {
              const Icon = region.icon;
              const hubs = hubsFor(region);
              return (
                <RevealItem key={region.key} className="h-full">
                  <article className="group relative flex h-full flex-col rounded-2xl border border-border bg-card p-6 sm:p-7 transition-[transform,box-shadow,border-color] duration-300 ease-[var(--ease-out-quint)] hover:-translate-y-1 hover:shadow-[0_1px_2px_hsl(var(--shadow-color)/0.06),0_8px_16px_hsl(var(--shadow-color)/0.08),0_32px_64px_-12px_hsl(var(--shadow-color)/0.14)] hover:border-primary/40">
                    <div className="flex items-center justify-between">
                      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary transition-colors duration-300 group-hover:bg-primary/20">
                        <Icon size={18} strokeWidth={2} aria-hidden="true" />
                      </span>
                      <span className="font-mono text-xs tabular-nums tracking-[0.08em] text-foreground/70">
                        {String(hubs.length).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="mt-5 font-display text-lg sm:text-xl text-foreground">
                      {region.label}
                    </h3>
                    <p className="mt-1 text-[0.9375rem] text-foreground/80 leading-relaxed">
                      {region.description}
                    </p>
                    <ul className="mt-5 flex flex-wrap gap-1.5">
                      {hubs.map((hub) => (
                        <li key={hub.slug}>
                          <Link
                            href={`/locations/${hub.slug}`}
                            className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-2.5 py-1 text-xs text-foreground/85 transition-colors hover:border-primary/50 hover:bg-primary/10 hover:text-primary"
                          >
                            {hub.h1.replace("Cash for Cars ", "")}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </article>
                </RevealItem>
              );
            })}
          </ul>
        </RevealGroup>

        <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3">
          <Link
            href="/locations"
            className="inline-flex items-center gap-1.5 text-sm text-primary link-underline"
          >
            View every suburb we cover
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </Link>
          <p className="text-xs text-foreground/70 font-medium">
            Not listed? Call us — we cover most of South-East Queensland.
          </p>
        </div>
      </div>
    </section>
  );
}
