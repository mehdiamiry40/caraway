import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function AboutLoading() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main id="main-content" className="flex-1 mt-header-safe">
        <div role="status" aria-live="polite">
          <span className="sr-only">Loading about…</span>

          <section className="bg-primary py-16 lg:py-20">
            <div className="site-container">
              <Skeleton className="h-4 w-40 bg-primary-foreground/10 mb-4" />
              <Skeleton className="h-12 w-full max-w-xl bg-primary-foreground/10 mb-4" />
              <Skeleton className="h-5 w-full max-w-2xl bg-primary-foreground/10" />
            </div>
          </section>

          <div className="site-container py-16 space-y-6">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-5/6" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-4/5" />
            <Skeleton className="h-8 w-56 mt-8" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-5/6" />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
