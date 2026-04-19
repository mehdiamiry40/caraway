"use client";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight, Phone } from "lucide-react";
import { BUSINESS } from "@/lib/site";
import { trackEvent } from "@/lib/analytics";

export function HeroCTAs() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <a
          href="#price-estimator"
          onClick={() => trackEvent("hero_cta_click", { target: "quote" })}
          className={cn(buttonVariants({ size: "lg", variant: "secondary" }), "group sm:flex-1")}
        >
          Get my instant quote
          <ArrowRight
            className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform duration-200"
            aria-hidden
          />
        </a>
        <a
          href={BUSINESS.phoneHref}
          onClick={() => trackEvent("hero_cta_click", { target: "phone" })}
          className={cn(
            buttonVariants({ size: "lg", variant: "outline" }),
            "group border-primary/20 bg-card/70 sm:flex-1"
          )}
          aria-label={`Call ${BUSINESS.phoneFriendly}`}
        >
          <Phone className="mr-2 h-4 w-4" aria-hidden="true" />
          Call {BUSINESS.phoneFriendly}
        </a>
      </div>
      <p className="text-sm text-muted-foreground">
        Free pickup across Greater Brisbane. No obligation if the number doesn&apos;t suit.
      </p>
    </div>
  );
}
