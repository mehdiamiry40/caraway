"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";

export interface LocationFilterItem {
  slug: string;
  h1: string;
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
      <div className="relative mb-8 max-w-full sm:max-w-lg">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <input
          type="search"
          placeholder="Search your suburb..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="h-12 w-full rounded-md border border-input bg-card pl-11 pr-4 text-base text-foreground ring-offset-background transition-[border-color,box-shadow] duration-150 placeholder:text-muted-foreground hover:border-foreground/70 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 touch-manipulation"
          aria-label="Search suburbs"
        />
      </div>

      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {filtered.length} location {filtered.length === 1 ? "guide" : "guides"} found
        {query.trim() ? ` for “${query.trim()}”` : ""}.
      </p>

      {filtered.length === 0 ? (
        <div className="border-t-2 border-primary py-12">
          <p className="mb-2 text-lg font-semibold text-foreground">
            No suburbs match &ldquo;{query}&rdquo;
          </p>
          <p className="text-base text-muted-foreground">
            Send your suburb and vehicle details —{" "}
            <Link href="/contact" className="font-medium text-accent-ink underline underline-offset-2">
              contact us
            </Link>{" "}
            to check availability.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-x-10 border-t-2 border-primary sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((suburb) => (
            <Link
              key={suburb.slug}
              href={`/locations/${suburb.slug}`}
              className="group grid grid-cols-[1fr_auto] items-center gap-x-4 border-b border-border py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <h2 className="font-sans text-lg font-bold leading-snug tracking-[-0.006em] text-primary decoration-cta decoration-2 underline-offset-[5px] group-hover:underline">
                {suburb.h1}
              </h2>
              {suburb.nearbyAreaNames.length > 0 && (
                <p className="col-start-1 row-start-2 mt-0.5 line-clamp-1 text-sm text-muted-foreground">
                  {suburb.nearbyAreaNames.slice(0, 3).join(" · ")}
                </p>
              )}
              <ArrowRight className="col-start-2 row-span-2 row-start-1 h-5 w-5 text-primary/45 transition-[transform,color] group-hover:translate-x-1 group-hover:text-primary" aria-hidden="true" />
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
