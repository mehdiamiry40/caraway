import Link from "next/link";
import { Phone } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { LocationsFilter } from "@/components/sections/LocationsFilter";
import { suburbs } from "@/data/suburbs";
import { BUSINESS } from "@/lib/site";

const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "Locations" }
];

export default function Locations() {
  const locationItems = suburbs.map((suburb) => ({
    slug: suburb.slug,
    h1: suburb.h1,
    summary: suburb.metaDescription,
  }));

  return (
    <PageShell
      breadcrumbs={breadcrumbs}
      eyebrow="Locations"
      title="Every corner of Greater Brisbane."
      subtitle={
        <p>
          We buy cars for cash across Greater Brisbane. Find your local area below for suburb-specific service information, or <Link href="/#price-estimator" className="text-primary font-medium link-underline">get a free quote</Link> to get started.
        </p>
      }
    >
      <div className="site-container py-14 sm:py-20 lg:py-24">
        <LocationsFilter items={locationItems} />

        <div className="mt-16 rounded-2xl border border-border/60 bg-secondary/60 p-8 sm:p-10 text-center max-w-2xl mx-auto">
          <p className="eyebrow mb-3">Not sure?</p>
          <h2 className="text-xl sm:text-2xl font-display text-foreground mb-3" style={{ letterSpacing: "var(--tracking-tight)" }}>Your suburb not listed?</h2>
          <p className="text-muted-foreground mb-7 max-w-md mx-auto">
            We service all of Greater Brisbane — even if your suburb isn&apos;t shown above. Call {BUSINESS.phoneFriendly} for local details, or use the price estimator.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={BUSINESS.phoneHref}
              className="inline-flex min-h-[44px] items-center justify-center gap-2 bg-primary text-primary-foreground rounded-full py-3 px-6 text-sm transition-[transform,box-shadow] duration-200 hover:-translate-y-px hover:shadow-[0_8px_24px_hsl(var(--primary)/0.25)]"
              aria-label={`Call ${BUSINESS.phoneFriendly}`}
            >
              <Phone className="h-4 w-4" strokeWidth={1.5} aria-hidden />
              Call {BUSINESS.phoneFriendly}
            </a>
            <Link
              href="/#price-estimator"
              className="inline-flex min-h-[44px] items-center justify-center gap-2 border border-border/80 bg-card text-foreground rounded-full py-3 px-6 text-sm transition-colors duration-200 hover:border-primary/40 hover:text-primary"
            >
              Get a free quote
            </Link>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
