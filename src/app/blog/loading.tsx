import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function BlogLoading() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main id="main-content" className="flex-1 mt-header-safe">
        <div role="status" aria-live="polite">
          <span className="sr-only">Loading articles…</span>

          <section className="bg-primary py-16 lg:py-20">
            <div className="site-container">
              <Skeleton className="h-4 w-40 bg-primary-foreground/10 mb-4" />
              <Skeleton className="h-12 w-full max-w-xl bg-primary-foreground/10 mb-4" />
              <Skeleton className="h-5 w-full max-w-2xl bg-primary-foreground/10" />
            </div>
          </section>

          <div className="site-container py-14 sm:py-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {/* Featured post skeleton (full width) */}
              <div className="md:col-span-2 rounded-lg border border-border/60 bg-card p-4 sm:p-6 md:p-10">
                <div className="flex gap-3 mb-5">
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-24" />
                </div>
                <Skeleton className="h-7 w-full max-w-lg mb-3" />
                <Skeleton className="h-5 w-full mb-1" />
                <Skeleton className="h-5 w-4/5 mb-6" />
                <Skeleton className="h-5 w-24" />
              </div>

              {/* Regular post skeletons */}
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
