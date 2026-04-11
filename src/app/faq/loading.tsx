import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 mt-header-safe flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground text-sm">Loading FAQs…</div>
      </main>
      <Footer />
    </div>
  );
}
