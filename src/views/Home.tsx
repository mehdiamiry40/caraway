import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import HomeBelowFold from "@/views/HomeBelowFold";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main id="main-content" className="flex-1 overflow-x-hidden">
        <Hero />
        <HomeBelowFold />
      </main>

      <Footer />
    </div>
  );
}
