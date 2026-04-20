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
        className="w-full group touch-manipulation"
      >
        Get my firm offer
        <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform duration-200" strokeWidth={2} aria-hidden />
      </Button>
    </div>
  );
}
