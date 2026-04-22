"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useScrollToQuote } from "@/hooks/use-scroll-to-quote";
import { trackEvent } from "@/lib/analytics";

interface ScrollToQuoteCTAProps {
  source?: string;
}

export function ScrollToQuoteCTA({ source = "scroll_cta" }: ScrollToQuoteCTAProps) {
  const scrollToQuote = useScrollToQuote();

  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
      <Button
        size="lg"
        onClick={() => {
          trackEvent("scroll_to_quote_click", { source });
          scrollToQuote();
        }}
        className="w-full group touch-manipulation"
      >
        Get my free quote
        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1.5 transition-transform duration-200" />
      </Button>
    </div>
  );
}
