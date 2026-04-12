"use client";

import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";

export function FinalCTA() {
  return (
    <section className="py-16 sm:py-20 bg-primary text-white" aria-label="Get your quote">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-1.5 mb-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star key={i} className="w-4 h-4 fill-accent text-accent" aria-hidden="true" />
          ))}
          <span className="ml-2 text-sm text-white/80">
            <strong className="text-white">4.9</strong> · 200+ Brisbane sellers
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-4 leading-tight">
          Ready to see what your car is worth?
        </h2>
        <p className="text-white/75 text-base sm:text-lg mb-8 max-w-xl mx-auto">
          One form. Honest price. Free pickup. Cash on the spot.
        </p>
        <Link
          href="/#price-estimator"
          onClick={() => trackEvent("cta_click", { location: "final_cta" })}
          className={cn(
            buttonVariants({ size: "lg" }),
            "bg-accent hover:bg-accent/90 text-white h-14 px-10 text-base font-bold group",
          )}
        >
          Get my instant quote
          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
