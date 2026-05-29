import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { StickyMobileCTA } from "@/components/layout/StickyMobileCTA";
import { Hero } from "@/components/sections/Hero";
import HomeBelowFold from "@/views/HomeBelowFold";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main id="main-content" className="flex-1 overflow-x-clip pb-[5.5rem] lg:pb-0">
        <Hero />
        <HomeBelowFold />
      </main>

      <Footer />
      <StickyMobileCTA />
    </div>
  );
}
