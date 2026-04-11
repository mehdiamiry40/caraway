import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main id="main-content" className="flex-1 mt-header-safe flex items-center justify-center">
        <div className="animate-pulse motion-reduce:animate-none text-muted-foreground text-sm" role="status" aria-live="polite">Loading contact…</div>
      </main>
      <Footer />
    </div>
  );
}
