import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/sections/Breadcrumbs";
import { InternalLinks } from "@/components/sections/InternalLinks";
import { LocationsFilter } from "@/components/sections/LocationsFilter";

const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "Locations" }
];

export default function Locations() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main id="main-content" className="flex-1 mt-header-safe">
        <section className="bg-primary text-white py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Breadcrumbs items={breadcrumbs} light />
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-[1.1] mt-6 mb-6">
              Cash for Cars — Brisbane Locations
            </h1>
            <p className="text-white/75 text-lg sm:text-xl leading-relaxed max-w-3xl">
              We buy cars for cash across all of Greater Brisbane. Find your local area below for suburb-specific service information, or <Link href="/#price-estimator" className="text-accent hover:underline font-semibold">get an instant quote</Link> to get started.
            </p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <LocationsFilter />

          <div className="mt-16 rounded-2xl border border-border/60 bg-white p-5 sm:p-8 md:p-12 text-center max-w-2xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-primary mb-3">Your Suburb Not Listed?</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              We service all of Greater Brisbane — even if your specific suburb isn&apos;t shown above. Use our price estimator for a free quote.
            </p>
            <Link
              href="/#price-estimator"
              className="inline-flex items-center justify-center gap-2 bg-accent text-white rounded-lg py-3.5 px-8 font-semibold hover:bg-accent/90 transition-colors"
            >
              Get an Instant Quote
            </Link>
          </div>
        </div>

        <InternalLinks />
      </main>

      <Footer />
    </div>
  );
}
