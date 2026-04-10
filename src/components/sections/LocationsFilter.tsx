"use client";

import { useState } from "react";
import Link from "next/link";
import { suburbs } from "@/data/suburbs";
import { MapPin, ArrowRight, Search } from "lucide-react";

export function LocationsFilter() {
  const [query, setQuery] = useState("");

  const filtered = query.trim()
    ? suburbs.filter((s) =>
        s.h1.toLowerCase().includes(query.toLowerCase()) ||
        s.slug.toLowerCase().includes(query.toLowerCase())
      )
    : suburbs;

  return (
    <>
      <div className="relative max-w-full sm:max-w-lg mb-12">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground/60 pointer-events-none" />
        <input
          type="search"
          placeholder="Search your suburb..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full h-13 rounded-lg border border-border bg-white pl-12 pr-5 text-base ring-offset-background transition-all placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-primary hover:border-primary/40 touch-manipulation"
          aria-label="Search suburbs"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-full bg-muted/60 flex items-center justify-center mx-auto mb-5">
            <Search className="h-6 w-6 text-muted-foreground/50" />
          </div>
          <p className="text-muted-foreground text-lg mb-2">
            No suburbs match &ldquo;{query}&rdquo;
          </p>
          <p className="text-muted-foreground text-sm">
            We likely still service your area —{" "}
            <Link href="/contact" className="text-primary font-semibold underline underline-offset-2">
              contact us
            </Link>{" "}
            to check.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((suburb) => (
            <Link
              key={suburb.slug}
              href={`/locations/${suburb.slug}`}
              className="group border border-border/60 rounded-lg p-4 sm:p-6 hover:border-primary/30 hover:shadow-md transition-all duration-200 bg-white"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/15 transition-colors">
                  <MapPin className="h-4 w-4 text-accent" />
                </div>
                <h2 className="text-base font-display font-bold text-foreground group-hover:text-primary transition-colors">
                  {suburb.h1}
                </h2>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-5">
                {suburb.intro}
              </p>
              <span className="text-sm text-accent font-semibold flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
                View details <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
