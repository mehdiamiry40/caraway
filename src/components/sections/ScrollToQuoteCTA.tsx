"use client";

import { Button } from "@/components/ui/button";
import { useScrollToQuote } from "@/hooks/use-scroll-to-quote";
import { trackEvent } from "@/lib/analytics";

interface ScrollToQuoteCTAProps {
  source?: string;
}

export function ScrollToQuoteCTA({ source = "scroll_cta" }: ScrollToQuoteCTAProps) {
  const scrollToQuote = useScrollToQuote();

  return (
    <div className="flex w-full sm:inline-flex sm:w-auto">
      <Button
        size="lg"
        onClick={() => {
          trackEvent("scroll_to_quote_click", { source });
          scrollToQuote();
        }}
        className="w-full touch-manipulation sm:w-auto"
      >
        Get my quote
      </Button>
    </div>
  );
}
