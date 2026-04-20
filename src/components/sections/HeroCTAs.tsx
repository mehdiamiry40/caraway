"use client";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight, Phone } from "lucide-react";
import { BUSINESS } from "@/lib/site";
import { trackEvent } from "@/lib/analytics";

export function HeroCTAs() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
      <a
        href="#price-estimator"
        onClick={() => trackEvent("hero_cta_click", { target: "quote" })}
        className={cn(buttonVariants({ size: "lg" }), "group")}
      >
        Get my free offer
        <ArrowRight
          className="ml-0.5 h-4 w-4 group-hover:translate-x-0.5 transition-transform duration-200"
          strokeWidth={2}
          aria-hidden
        />
      </a>
      <a
        href={BUSINESS.phoneHref}
        onClick={() => trackEvent("hero_cta_click", { target: "phone" })}
        className={cn(
          buttonVariants({ variant: "outline", size: "lg" }),
          "group",
        )}
        aria-label={`Call ${BUSINESS.phoneFriendly}`}
      >
        <Phone className="h-4 w-4 text-primary" strokeWidth={2} aria-hidden />
        Call {BUSINESS.phoneFriendly}
      </a>
    </div>
  );
}
