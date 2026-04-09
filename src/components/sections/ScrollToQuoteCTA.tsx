"use client";

import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function ScrollToQuoteCTA() {
  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === "/" || pathname === "";

  const scrollToQuote = () => {
    if (isHome) {
      document.getElementById("price-estimator")?.scrollIntoView({ behavior: "smooth" });
    } else {
      const el = document.getElementById("price-estimator");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      } else {
        router.push("/#price-estimator");
      }
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
      <Button
        size="lg"
        onClick={scrollToQuote}
        className="w-full bg-accent hover:bg-accent/85 text-white h-14 px-8 text-base font-semibold group border-0 shadow-lg shadow-accent/25 hover:shadow-xl hover:shadow-accent/35 transition-all duration-200 hover:-translate-y-px active:translate-y-0 active:shadow-lg touch-manipulation"
      >
        Get My Free Quote
        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1.5 transition-transform duration-200" />
      </Button>
    </div>
  );
}
