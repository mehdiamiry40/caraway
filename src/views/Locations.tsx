import Link from "next/link";
import { Phone } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { LocationsFilter } from "@/components/sections/LocationsFilter";
import { suburbs } from "@/data/suburbs";
import { BUSINESS } from "@/lib/site";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
            We service all of Greater Brisbane — even if your suburb isn&apos;t shown above. Call {BUSINESS.phoneDisplay} for local details, or use the price estimator.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={BUSINESS.phoneTel}
              className={cn(buttonVariants({ variant: "primary" }), "w-full sm:w-auto")}
              aria-label={`Call ${BUSINESS.phoneDisplay}`}
            >
              <Phone className="h-4 w-4" strokeWidth={1.5} aria-hidden />
              Call {BUSINESS.phoneDisplay}
            </a>
            <Link
              href="/#price-estimator"
              className={cn(buttonVariants({ variant: "outline" }), "w-full sm:w-auto")}
            >
              Get a free quote
            </Link>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
