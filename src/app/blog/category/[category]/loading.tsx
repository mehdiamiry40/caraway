import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function CategoryLoading() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main id="main-content" className="flex-1 mt-header-safe">
        <div role="status" aria-live="polite">
          <span className="sr-only">Loading articles…</span>

          <section className="bg-primary py-16 lg:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Skeleton className="h-4 w-40 bg-primary-foreground/10 mb-4" />
              <Skeleton className="h-12 w-full max-w-xl bg-primary-foreground/10 mb-4" />
              <Skeleton className="h-5 w-full max-w-2xl bg-primary-foreground/10" />
            </div>
          </section>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="rounded-lg border border-border/60 bg-card p-4 sm:p-6 md:p-8">
                  <div className="flex gap-3 mb-5">
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                  <Skeleton className="h-6 w-full max-w-xs mb-3" />
                  <Skeleton className="h-5 w-full mb-1" />
                  <Skeleton className="h-5 w-3/4 mb-6" />
                  <Skeleton className="h-5 w-20" />
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
