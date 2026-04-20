"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { suburbs } from "@/data/suburbs";
import { MapPin, ArrowRight, Search } from "lucide-react";

export function LocationsFilter() {
  const [inputValue, setInputValue] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setQuery(inputValue), 150);
    return () => clearTimeout(t);
  }, [inputValue]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return suburbs;
    return suburbs.filter(
      (s) =>
        s.h1.toLowerCase().includes(q) ||
        s.slug.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <>
      <div className="relative max-w-full sm:max-w-lg mb-10 sm:mb-12">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-muted-foreground pointer-events-none" aria-hidden="true" strokeWidth={2} />
        <input
          type="search"
          placeholder="Search your suburb..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="w-full h-12 sm:h-[52px] rounded-full border border-border bg-card pl-12 pr-5 text-[0.9375rem] transition-[border-color,box-shadow] placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:border-primary focus-visible:shadow-[0_0_0_3px_hsl(var(--primary)/0.12)] hover:border-border-strong touch-manipulation"
          aria-label="Search suburbs"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-5 text-muted-foreground">
            <Search className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />
          </div>
          <p className="text-foreground text-lg font-semibold mb-2">
            No suburbs match &ldquo;{query}&rdquo;
          </p>
          <p className="text-muted-foreground text-[0.9375rem]">
            We likely still service your area —{" "}
            <Link href="/contact" className="text-primary font-semibold link-underline">
              contact us
            </Link>{" "}
            to check.
          </p>
        </div>
      ) : (
        <>
        <span className="sr-only" aria-live="polite">{filtered.length} results</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6" aria-live="polite">
          {filtered.map((suburb) => (
            <Link
              key={suburb.slug}
              href={`/locations/${suburb.slug}`}
              className="group rounded-2xl border border-border bg-card p-6 shadow-[0_1px_2px_hsl(var(--shadow-color)/0.04)] hover:border-border-strong hover:shadow-[0_2px_6px_hsl(var(--shadow-color)/0.06),0_18px_40px_-14px_hsl(var(--shadow-color)/0.18)] hover:-translate-y-1 transition-[transform,box-shadow,border-color] duration-300 ease-[var(--ease-out-quint)]"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/[0.06] text-primary ring-1 ring-primary/10 transition-colors group-hover:bg-primary group-hover:text-primary-foreground group-hover:ring-primary">
                  <MapPin className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden="true" />
                </span>
                <h2 className="text-[1.0625rem] font-display font-semibold text-foreground transition-colors">
                  {suburb.h1}
                </h2>
              </div>
              <p className="text-[0.9375rem] text-muted-foreground leading-relaxed line-clamp-3 mb-5">
                {suburb.intro}
              </p>
              <span className="text-[0.8125rem] font-semibold text-primary inline-flex items-center gap-1.5 transition-all">
                View details <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" strokeWidth={2} aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
        </>
      )}
    </>
  );
}
