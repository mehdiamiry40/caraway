import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function ServiceLoading() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main id="main-content" className="flex-1 mt-header-safe">
        <section className="bg-primary py-16 lg:py-20">
          <div className="site-container">
            <Skeleton className="h-4 w-48 bg-primary-foreground/10 mb-4" />
            <Skeleton className="h-12 w-full max-w-xl bg-primary-foreground/10 mb-4" />
            <Skeleton className="h-5 w-full max-w-2xl bg-primary-foreground/10" />
          </div>
        </section>
        <div className="site-container py-16 space-y-6">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-5/6" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-4/5" />
          <Skeleton className="h-8 w-64 mt-8" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-3/4" />
        </div>
        <div className="site-container pb-16 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-28 w-full rounded-xl" />
          <Skeleton className="h-28 w-full rounded-xl" />
          <Skeleton className="h-28 w-full rounded-xl" />
        </div>
      </main>
      <Footer />
    </div>
  );
}
