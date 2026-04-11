"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, ArrowRight, ChevronDown } from "lucide-react";
import { suburbs } from "@/data/suburbs";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const additionalAreas = [
  "Brisbane CBD", "Fortitude Valley", "West End", "Paddington",
  "Kelvin Grove", "Newstead", "New Farm", "Kangaroo Point",
  "Aspley", "Stafford", "Kedron", "Nundah", "Clayfield",
  "Sandgate", "Brighton", "Bracken Ridge",
  "Holland Park", "Calamvale", "Runcorn",
  "Loganholme", "Tingalpa",
  "Redland Bay", "Victoria Point",
  "Inala", "Forest Lake", "Richlands",
  "Oxley", "Darra", "Goodna", "Springfield",
  "Strathpine", "Kallangur", "Petrie",
  "Eagleby", "Holmview", "Waterford",
];

export function ServiceAreas() {
  const [showMore, setShowMore] = useState(false);

  return (
    <section
      className="section-y bg-muted"
      aria-label="Cash for cars service areas Brisbane"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-foreground leading-tight">
            Cash for Cars Brisbane Service Areas
          </h2>
          <p className="mt-3 text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
            Free pickup across Brisbane, Ipswich, Logan, Redland Bay, Moreton Bay, and surrounding areas.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {suburbs.map((suburb) => (
            <Link
              key={suburb.slug}
              href={`/locations/${suburb.slug}`}
              className={cn(
                "group flex items-center gap-3 rounded-lg border border-border/60 bg-white p-3 sm:p-4",
                "hover:border-primary hover:shadow-md hover:-translate-y-0.5",
                "transition-all duration-200 touch-manipulation min-h-[44px]"
              )}
            >
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-muted text-primary/60 group-hover:bg-primary group-hover:text-white transition-all duration-200 shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-tight">
                {suburb.h1.replace("Cash for Cars ", "")}
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-6">
          <button
            type="button"
            onClick={() => setShowMore(!showMore)}
            className="mx-auto flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors min-h-[44px] touch-manipulation"
            aria-expanded={showMore}
          >
            {showMore ? "Show fewer areas" : `+${additionalAreas.length} more suburbs we service`}
            <ChevronDown className={cn("w-4 h-4 transition-transform duration-300", showMore && "rotate-180")} />
          </button>

          <div className={cn(
            "grid transition-all duration-500 ease-out overflow-hidden",
            showMore ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0"
          )}>
            <div className="overflow-hidden">
              <div className="flex flex-wrap justify-center gap-2">
                {additionalAreas.map((area) => (
                  <span
                    key={area}
                    className="inline-flex items-center px-3 py-1.5 rounded-full border border-border/40 bg-white text-xs sm:text-sm text-muted-foreground"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/#price-estimator"
            className={cn(buttonVariants({ size: "lg" }), "min-w-[200px]")}
          >
            Get an instant quote
          </Link>
          <Link
            href="/locations"
            className={cn(buttonVariants({ size: "lg", variant: "outline" }), "min-w-[200px]")}
          >
            View all locations
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
