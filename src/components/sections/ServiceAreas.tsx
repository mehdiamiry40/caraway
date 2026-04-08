import Link from "next/link";
import { MapPin, ArrowRight, Phone } from "lucide-react";
import { suburbs } from "@/data/suburbs";
import { BUSINESS } from "@/lib/site";

const areaRowClassName =
  "group flex min-h-11 items-center gap-2.5 rounded-xl border border-border/50 bg-white px-3.5 py-2.5 text-left text-xs sm:text-sm font-medium text-foreground transition-all duration-200 hover:border-primary hover:bg-primary hover:text-primary-foreground hover:shadow-sm hover:shadow-primary/10 touch-manipulation";

const areaIconWrapClassName =
  "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-b from-muted to-muted/60 text-primary/50 group-hover:bg-white/15 group-hover:text-primary-foreground transition-all duration-200";

const additionalAreas = [
  "Brisbane CBD", "Fortitude Valley", "West End", "Paddington",
  "Kelvin Grove", "Newstead", "New Farm", "Kangaroo Point",
  "Aspley", "Stafford", "Kedron", "Nundah", "Clayfield",
  "Sandgate", "Brighton", "Bracken Ridge", "North Lakes",
  "Holland Park", "Calamvale", "Runcorn",
  "Loganholme", "Beenleigh",
  "Tingalpa", "Wynnum", "Manly", "Cleveland",
  "Redland Bay", "Victoria Point", "Capalaba",
  "Inala", "Forest Lake", "Richlands",
  "Oxley", "Darra", "Goodna", "Springfield",
];

export function ServiceAreas() {
  return (
    <section
      className="section-y bg-muted/40"
      aria-label="Cash for cars service areas Brisbane"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10 lg:mb-12">
          <div className="max-w-2xl">
            <h2 className="text-xl sm:text-3xl md:text-4xl font-display font-bold text-primary leading-tight text-balance">
              Cash for Cars Brisbane Service Areas
            </h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              We collect from Brisbane, Ipswich, Logan, Redland Bay, Moreton Bay, and nearby areas. Remote or unusual access? Say so when you call — we&apos;ll be honest about trucks.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <a
              href={BUSINESS.phoneHref}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary min-h-11 px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 touch-manipulation"
            >
              <Phone className="h-4 w-4 shrink-0" />
              {BUSINESS.phoneFriendly}
            </a>
            <Link
              href="/locations"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-white min-h-11 px-5 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground hover:border-primary touch-manipulation"
            >
              All locations
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-border/40 bg-white p-4 sm:p-6 lg:p-8 shadow-sm shadow-black/[0.02]">
          <h3 className="font-display text-sm font-bold text-primary mb-5 uppercase tracking-wider">
            Browse by area
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
            {suburbs.map((suburb) => (
              <li key={suburb.slug} className="min-w-0">
                <Link href={`/locations/${suburb.slug}`} className={areaRowClassName}>
                  <span className={areaIconWrapClassName} aria-hidden>
                    <MapPin className="h-3 w-3" strokeWidth={2.5} />
                  </span>
                  <span className="leading-snug break-words">
                    {suburb.h1.replace("Cash for Cars ", "")}
                  </span>
                </Link>
              </li>
            ))}
            {additionalAreas.map((area) => (
              <li key={`area-${area}`} className="min-w-0">
                <Link
                  href="/locations"
                  className={areaRowClassName}
                  title={`${area} — view all locations`}
                >
                  <span className={areaIconWrapClassName} aria-hidden>
                    <MapPin className="h-3 w-3" strokeWidth={2.5} />
                  </span>
                  <span className="leading-snug break-words">{area}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 max-w-3xl mx-auto rounded-2xl border border-primary/10 bg-gradient-to-b from-primary/[0.04] to-transparent px-4 py-6 text-center sm:px-10 sm:py-8">
          <p className="font-display font-bold text-lg text-primary leading-snug">
            Not in the list?
          </p>
          <p className="mt-3 text-muted-foreground text-sm leading-relaxed break-words">
            <strong className="text-foreground font-semibold">We likely still service your area.</strong>{" "}
            Call{" "}
            <a
              href={BUSINESS.phoneHref}
              className="font-semibold text-primary underline-offset-2 hover:underline whitespace-nowrap"
            >
              {BUSINESS.phoneFriendly}
            </a>{" "}
            to confirm same-day availability at your location.
          </p>
        </div>
      </div>
    </section>
  );
}
