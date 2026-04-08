"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/sections/Breadcrumbs";
import { InternalLinks } from "@/components/sections/InternalLinks";
import { suburbs } from "@/data/suburbs";
import { MapPin, ArrowRight, Search, Phone } from "lucide-react";
import { BUSINESS } from "@/lib/site";

const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "Locations" }
];

export default function Locations() {
  const [query, setQuery] = useState("");
  const filtered = query.trim()
    ? suburbs.filter((s) =>
        s.h1.toLowerCase().includes(query.toLowerCase()) ||
        s.slug.toLowerCase().includes(query.toLowerCase())
      )
    : suburbs;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main id="main-content" className="flex-1 mt-14 lg:mt-[104px]">
        <section className="bg-gradient-to-br from-primary via-primary to-primary/90 text-white py-16 lg:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent/[0.08] via-transparent to-transparent pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <Breadcrumbs items={breadcrumbs} light />
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-[1.1] mt-6 mb-6">
              Cash for Cars — Brisbane Locations
            </h1>
            <p className="text-white/75 text-lg sm:text-xl leading-relaxed max-w-3xl">
              We buy cars for cash across all of Greater Brisbane. Find your local area below for suburb-specific service information, or call us on <a href={BUSINESS.phoneHref} className="text-accent hover:underline font-semibold">{BUSINESS.phone}</a> to get started.
            </p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          {/* Search */}
          <div className="relative max-w-lg mb-12">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground/60 pointer-events-none" />
            <input
              type="search"
              placeholder="Search your suburb..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full h-13 rounded-2xl border-2 border-border/60 bg-white pl-12 pr-5 text-base shadow-sm shadow-black/[0.03] ring-offset-background transition-all placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent hover:border-primary/40 hover:shadow-md"
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
                We likely still service your area — call{" "}
                <a href={BUSINESS.phoneHref} className="text-primary font-semibold underline underline-offset-2">
                  {BUSINESS.phone}
                </a>{" "}
                to check.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map(suburb => (
                <Link
                  key={suburb.slug}
                  href={`/locations/${suburb.slug}`}
                  className="group border border-border/60 rounded-2xl p-6 hover:border-primary/20 hover:shadow-lg hover:shadow-black/[0.06] transition-all duration-200 bg-white"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-b from-accent/15 to-accent/5 flex items-center justify-center group-hover:from-accent/25 group-hover:to-accent/10 transition-colors">
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

          <div className="mt-16 rounded-2xl border border-primary/10 bg-gradient-to-br from-primary/[0.05] via-primary/[0.02] to-accent/[0.03] p-8 md:p-12 text-center max-w-2xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-primary mb-3">Your Suburb Not Listed?</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              We service all of Greater Brisbane — even if your specific suburb isn&apos;t shown above. Call us to confirm availability and get a free quote.
            </p>
            <a
              href={BUSINESS.phoneHref}
              className="inline-flex items-center justify-center gap-2 bg-accent text-white rounded-full py-3.5 px-8 font-semibold hover:bg-accent/90 shadow-md shadow-accent/20 hover:shadow-lg hover:shadow-accent/25 transition-all"
            >
              <Phone className="h-4 w-4" />
              Call {BUSINESS.phone}
            </a>
          </div>
        </div>

        <InternalLinks />
      </main>

      <Footer />
    </div>
  );
}
