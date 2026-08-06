import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { StickyMobileCTA } from "@/components/layout/StickyMobileCTA";
import { Hero } from "@/components/sections/Hero";
import HomeBelowFold from "@/views/HomeBelowFold";

export default function Home() {
  return (
    <div className="lumus-home flex min-h-screen flex-col">
      <Header />

      <main
        id="main-content"
        tabIndex={-1}
        className="flex-1 overflow-x-clip pb-[5.5rem] focus-visible:outline-none lg:pb-0"
      >
        <Hero />
        <HomeBelowFold />
      </main>

      <Footer />
      <StickyMobileCTA />
    </div>
  );
}
