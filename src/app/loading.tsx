import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main id="main-content" className="flex-1 mt-header-safe overflow-x-hidden">
        <div role="status" aria-live="polite">
          <span className="sr-only">Loading…</span>

          {/* Hero skeleton */}
          <section className="bg-card min-h-hero">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row min-h-0 lg:min-h-[560px]">
              <div className="w-full lg:w-[48%] shrink-0 px-4 sm:px-6 lg:px-10 py-10 sm:py-18 lg:py-24 lg:pl-8 lg:pr-14">
                <Skeleton className="h-12 w-full max-w-sm mb-5" />
                <Skeleton className="h-5 w-full max-w-md mb-2" />
                <Skeleton className="h-5 w-4/5 max-w-md mb-10" />
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Skeleton className="h-14 w-52 rounded-full" />
                  <Skeleton className="h-14 w-52 rounded-full" />
                </div>
              </div>
              <div className="flex-1 min-h-[260px] sm:min-h-[340px] lg:min-h-0">
                <Skeleton className="h-full w-full rounded-none" />
              </div>
            </div>
          </section>

          {/* Stats skeleton */}
          <section className="bg-muted border-b border-border/40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-8 lg:gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex flex-col items-center sm:flex-row sm:items-start gap-4">
                    <Skeleton className="h-12 w-12 rounded-lg shrink-0" />
                    <div className="min-w-0">
                      <Skeleton className="h-6 w-20 mb-1" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
