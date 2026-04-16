import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function ContactLoading() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main id="main-content" className="flex-1 mt-header-safe">
        <div role="status" aria-live="polite">
          <span className="sr-only">Loading contact…</span>

          <section className="bg-primary py-16 lg:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Skeleton className="h-4 w-40 bg-white/10 mb-4" />
              <Skeleton className="h-12 w-full max-w-xl bg-white/10 mb-4" />
              <Skeleton className="h-5 w-full max-w-2xl bg-white/10" />
            </div>
          </section>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
              {/* Contact info side */}
              <div className="space-y-8">
                <div>
                  <Skeleton className="h-9 w-48 mb-4" />
                  <Skeleton className="h-5 w-full mb-1" />
                  <Skeleton className="h-5 w-4/5" />
                </div>
                <div className="space-y-5">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-start gap-4 p-4 -mx-4">
                      <Skeleton className="w-12 h-12 rounded-lg shrink-0" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-20 mb-2" />
                        <Skeleton className="h-5 w-48 mb-1" />
                        <Skeleton className="h-4 w-56" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form side */}
              <div className="space-y-8">
                <div className="bg-card rounded-lg border border-border/60 p-6 sm:p-8">
                  <Skeleton className="h-7 w-40 mb-6" />
                  <div className="space-y-4">
                    <Skeleton className="h-14 w-full" />
                    <Skeleton className="h-14 w-full" />
                    <Skeleton className="h-14 w-full" />
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-12 w-36" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
