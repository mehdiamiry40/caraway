import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { InternalLinks } from "@/components/sections/InternalLinks";
import { LocationsFilter } from "@/components/sections/LocationsFilter";

const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "Locations" }
];

export default function Locations() {
  return (
    <PageShell
      breadcrumbs={breadcrumbs}
      title="Cash for Cars — Brisbane Locations"
      subtitle={
        <p>
          We buy cars for cash across all of Greater Brisbane. Find your local area below for suburb-specific service information, or <Link href="/#price-estimator" className="text-accent hover:underline font-semibold">get an instant quote</Link> to get started.
        </p>
      }
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <LocationsFilter />

        <div className="mt-16 rounded-lg border border-border/60 bg-muted p-5 sm:p-8 md:p-12 text-center max-w-2xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-display font-bold text-primary mb-3">Your Suburb Not Listed?</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            We service all of Greater Brisbane — even if your specific suburb isn&apos;t shown above. Use our price estimator for a free quote.
          </p>
          <Link
            href="/#price-estimator"
            className="inline-flex items-center justify-center gap-2 bg-primary text-white rounded-full py-3.5 px-8 font-semibold hover:bg-primary/90 shadow-sm hover:shadow-md transition-all"
          >
            Get an Instant Quote
          </Link>
        </div>
      </div>

      <InternalLinks />
    </PageShell>
  );
}
