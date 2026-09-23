"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";

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
      <div className="relative mb-12 max-w-full sm:max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" strokeWidth={1.5} aria-hidden="true" />
        <input
          type="search"
          placeholder="Search your suburb..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="h-11 w-full rounded border border-input bg-white pl-9 pr-3 text-base text-foreground transition-colors duration-150 placeholder:text-muted-foreground focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25 touch-manipulation"
          aria-label="Search suburbs"
        />
      </div>

      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {filtered.length} location {filtered.length === 1 ? "guide" : "guides"} found
        {query.trim() ? ` for “${query.trim()}”` : ""}.
      </p>

      {filtered.length === 0 ? (
        <div className="border-t border-border py-12">
          <p className="mb-2 text-lg text-foreground">
            No suburbs match &ldquo;{query}&rdquo;
          </p>
          <p className="text-muted-foreground text-sm">
            Send your suburb and vehicle details —{" "}
            <Link href="/contact" className="text-primary underline decoration-primary/35 underline-offset-4 hover:decoration-primary">
              contact us
            </Link>{" "}
            to check availability.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((suburb) => (
            <Link
              key={suburb.slug}
              href={`/locations/${suburb.slug}`}
              className="group flex flex-col border-t border-border py-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="text-base font-semibold text-foreground underline decoration-transparent underline-offset-4 transition-colors duration-150 group-hover:decoration-foreground/40">
                  {suburb.h1}
                </h2>
                <ArrowRight className="h-4 w-4 shrink-0 translate-y-0.5 text-muted-foreground transition-colors duration-150 group-hover:text-foreground" strokeWidth={1.5} aria-hidden="true" />
              </div>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                {suburb.summary}
              </p>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
