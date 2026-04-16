"use client";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { BUSINESS } from "@/lib/site";
import { trackEvent } from "@/lib/analytics";

export function HeroCTAs() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
      <a
        href="#price-estimator"
        onClick={() => trackEvent("hero_cta_click", { target: "quote" })}
        className={cn(buttonVariants({ size: "lg" }), "group")}
      >
        Get your free cash offer
        <ArrowRight
          className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform duration-200"
          aria-hidden
        />
      </a>
      <a
        href={BUSINESS.phoneHref}
        onClick={() => trackEvent("hero_cta_click", { target: "phone" })}
        className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-accent transition-colors"
        aria-label={`Call ${BUSINESS.phoneFriendly}`}
      >
        or call <span className="ml-1.5 font-semibold tracking-tight text-primary underline decoration-accent/30 underline-offset-4 hover:decoration-accent">{BUSINESS.phoneFriendly}</span>
      </a>
    </div>
  );
}
