"use client";

import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { BUSINESS } from "@/lib/site";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import { TrackedPhoneLink } from "@/components/layout/TrackedPhoneLink";
import { Reveal } from "@/components/ui/motion";

export function FinalCTA() {
  return (
    <section
      className="section-y aurora-surface-dark"
      aria-label="Get your quote"
    >
      <div className="site-container relative">
        <Reveal className="max-w-4xl mx-auto text-center">
          <p className="eyebrow-on-dark mb-5">Ready when you are</p>
          <h2
            className="font-display text-3xl sm:text-4xl md:text-[3rem] font-semibold text-on-dark-hi leading-[1.05] tracking-[var(--tracking-display)] text-balance"
          >
            Ready to see what
            <br />
            your car is <span className="text-gradient">worth?</span>
          </h2>
          <p className="mt-5 mx-auto max-w-xl text-on-dark leading-relaxed text-base sm:text-lg">
            One form. Honest price. Free pickup across Greater Brisbane.
            Cash on the spot — usually same- or next-day.
          </p>

          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/#price-estimator"
              onClick={() => trackEvent("cta_click", { location: "final_cta" })}
              className={cn(
                buttonVariants({ size: "lg" }),
                "group h-12 sm:h-14 w-full sm:w-auto px-10 text-base font-semibold",
                "bg-gradient-to-r from-[hsl(var(--grad-lilac))] via-[hsl(var(--grad-violet))] to-[hsl(var(--grad-pink))]",
                "text-ink-deep shadow-[0_12px_40px_hsl(var(--grad-violet)/0.35)]",
                "hover:brightness-105 hover:shadow-[0_16px_48px_hsl(var(--grad-violet)/0.45)]",
              )}
            >
              Get my quote
              <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
            </Link>
            <TrackedPhoneLink
              href={BUSINESS.phoneHref}
              location="final_cta"
              className="inline-flex items-center justify-center gap-2 h-12 sm:h-14 w-full sm:w-auto px-6 text-sm font-medium text-on-dark-hi/90 hover:text-on-dark-hi rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
              ariaLabel={`Call ${BUSINESS.phoneFriendly}`}
            >
              <Phone aria-hidden="true" className="h-4 w-4" />
              <span>or call {BUSINESS.phoneFriendly}</span>
            </TrackedPhoneLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
