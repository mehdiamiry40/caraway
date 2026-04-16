import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function FaqLoading() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main id="main-content" className="flex-1 mt-header-safe">
        <div role="status" aria-live="polite">
          <span className="sr-only">Loading FAQs…</span>

          <section className="bg-primary py-16 lg:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Skeleton className="h-4 w-40 bg-white/10 mb-4" />
              <Skeleton className="h-12 w-full max-w-xl bg-white/10 mb-4" />
              <Skeleton className="h-5 w-full max-w-2xl bg-white/10" />
            </div>
          </section>

          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="rounded-lg border border-border/60 bg-card p-5">
                <Skeleton className="h-6 w-full max-w-md" />
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
