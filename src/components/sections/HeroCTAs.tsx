"use client";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight, Phone } from "lucide-react";
import { BUSINESS } from "@/lib/site";
import { trackEvent } from "@/lib/analytics";

export function HeroCTAs() {
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
      <a
        href="#price-estimator"
        onClick={() => trackEvent("hero_cta_click", { target: "quote" })}
        className={cn(
          buttonVariants({ size: "lg" }),
          "h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base font-semibold group transition-all duration-300"
        )}
      >
        Get my quote
        <ArrowRight
          className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200"
          aria-hidden
        />
      </a>
      <a
        href={BUSINESS.phoneHref}
        onClick={() => trackEvent("hero_cta_click", { target: "phone" })}
        className={cn(
          buttonVariants({ size: "lg", variant: "outline" }),
          "h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base font-semibold group transition-all duration-300"
        )}
        aria-label={`Call ${BUSINESS.phoneFriendly}`}
      >
        <Phone className="mr-2 h-5 w-5" aria-hidden />
        Call {BUSINESS.phoneFriendly}
      </a>
    </div>
  );
}
