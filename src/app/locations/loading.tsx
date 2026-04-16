import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function LocationsLoading() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main id="main-content" className="flex-1 mt-header-safe">
        <div role="status" aria-live="polite">
          <span className="sr-only">Loading locations…</span>

          <section className="bg-primary py-16 lg:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Skeleton className="h-4 w-40 bg-white/10 mb-4" />
              <Skeleton className="h-12 w-full max-w-xl bg-white/10 mb-4" />
              <Skeleton className="h-5 w-full max-w-2xl bg-white/10" />
            </div>
          </section>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
            {/* Search bar skeleton */}
            <Skeleton className="h-12 w-full max-w-md mb-8" />

            {/* Location cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="rounded-lg border border-border/60 bg-card p-5">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
