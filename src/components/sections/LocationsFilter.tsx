"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { MapPin, ArrowRight, Search } from "lucide-react";

export interface LocationFilterItem {
  slug: string;
  h1: string;
  summary: string;
  nearbyAreaNames: string[];
}

export function LocationsFilter({ items }: { items: LocationFilterItem[] }) {
  const [inputValue, setInputValue] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setQuery(inputValue), 150);
    return () => clearTimeout(t);
  }, [inputValue]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (s) =>
        s.h1.toLowerCase().includes(q) ||
        s.slug.toLowerCase().includes(q) ||
        s.nearbyAreaNames.some((name) => name.toLowerCase().includes(q))
    );
  }, [items, query]);

  return (
    <>
      <div className="relative max-w-full sm:max-w-lg mb-10 sm:mb-12">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-muted-foreground/60 pointer-events-none" aria-hidden="true" />
        <input
          type="search"
          placeholder="Search your suburb..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="w-full h-12 sm:h-13 rounded-lg border border-border bg-card pl-12 pr-5 text-base ring-offset-background transition-all placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-primary hover:border-primary/40 touch-manipulation"
          aria-label="Search suburbs"
        />
      </div>

      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {filtered.length} location {filtered.length === 1 ? "guide" : "guides"} found
        {query.trim() ? ` for “${query.trim()}”` : ""}.
      </p>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-full bg-muted/60 flex items-center justify-center mx-auto mb-5">
            <Search className="h-6 w-6 text-muted-foreground/60" aria-hidden="true" />
          </div>
          <p className="text-muted-foreground text-lg mb-2">
            No suburbs match &ldquo;{query}&rdquo;
          </p>
          <p className="text-muted-foreground text-sm">
            Send your suburb and vehicle details —{" "}
            <Link href="/contact" className="text-primary underline underline-offset-2">
              contact us
            </Link>{" "}
            to check availability.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {filtered.map((suburb) => (
            <Link
              key={suburb.slug}
              href={`/locations/${suburb.slug}`}
              className="group flex flex-col border border-border bg-card p-4 sm:p-6 hover:border-primary/50 card-lift"
            >
              <div className="flex items-center gap-3 sm:mb-4">
                <div className="w-9 h-9 shrink-0 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/15 transition-colors">
                  <MapPin className="h-4 w-4 text-accent-ink" aria-hidden="true" />
                </div>
                <h2 className="flex-1 text-base font-display font-semibold text-foreground group-hover:text-primary transition-colors">
                  {suburb.h1}
                </h2>
                {/* Phones drop the "View details" row; the arrow carries it. */}
                <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary sm:hidden" aria-hidden="true" />
              </div>
              <p className="mt-2 pl-12 text-sm text-muted-foreground leading-relaxed line-clamp-2 sm:mt-0 sm:mb-5 sm:pl-0 sm:line-clamp-3">
                {suburb.summary}
              </p>
              <span className="mt-auto hidden text-sm text-accent-ink items-center gap-1.5 group-hover:gap-2.5 transition-all sm:flex">
                View details <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
