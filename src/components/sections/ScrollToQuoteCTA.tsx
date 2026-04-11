"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useScrollToQuote } from "@/hooks/use-scroll-to-quote";

export function ScrollToQuoteCTA() {
  const scrollToQuote = useScrollToQuote();

  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
      <Button
        size="lg"
        onClick={scrollToQuote}
        className="w-full bg-primary hover:bg-primary/90 text-white h-14 px-8 text-base font-semibold group border-0 shadow-sm hover:shadow-md transition-all duration-200 touch-manipulation"
      >
        Get My Free Quote
        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1.5 transition-transform duration-200" />
      </Button>
    </div>
  );
}
