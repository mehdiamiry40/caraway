"use client";

import Link from "next/link";
import { ArrowRight, Phone, ShieldCheck } from "lucide-react";
import { BUSINESS } from "@/lib/site";
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
        <Reveal className="max-w-3xl mx-auto text-center">
          <p className="eyebrow-on-dark mb-5 justify-center">Ready when you are</p>
          <h2
            className="font-display font-bold text-[2rem] sm:text-[2.5rem] md:text-[3rem] text-on-dark-hi leading-[1.05] tracking-[var(--tracking-display)] text-balance"
          >
            Ready to see what your car is{" "}
            <span className="text-gradient">worth?</span>
          </h2>
          <p className="mt-5 mx-auto max-w-xl text-on-dark leading-relaxed text-[1.0625rem] sm:text-lg">
            One form. One firm price. Free pickup across Greater Brisbane — paid
            the moment we collect.
          </p>

          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/#price-estimator"
              onClick={() => trackEvent("cta_click", { location: "final_cta" })}
              className="group inline-flex items-center justify-center gap-1.5 rounded-full bg-accent text-accent-foreground font-semibold h-12 sm:h-14 w-full sm:w-auto px-8 text-[0.9375rem] sm:text-base shadow-[0_1px_2px_hsl(var(--shadow-color)/0.08),0_12px_32px_-8px_hsl(var(--accent)/0.45)] hover:-translate-y-[1px] hover:shadow-[0_2px_4px_hsl(var(--shadow-color)/0.12),0_18px_44px_-8px_hsl(var(--accent)/0.55)] transition-[transform,box-shadow] duration-300 ease-[var(--ease-out-quint)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
            >
              Get my firm offer
              <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={2} aria-hidden="true" />
            </Link>
            <TrackedPhoneLink
              href={BUSINESS.phoneHref}
              location="final_cta"
              className="inline-flex items-center justify-center gap-2 h-12 sm:h-14 w-full sm:w-auto px-6 text-[0.9375rem] text-on-dark-hi font-medium rounded-full border border-on-dark-hi/20 hover:border-on-dark-hi/40 hover:bg-on-dark-hi/[0.04] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-on-dark-hi/40 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
              ariaLabel={`Call ${BUSINESS.phoneFriendly}`}
            >
              <Phone aria-hidden="true" className="h-4 w-4" strokeWidth={2} />
              <span>or call {BUSINESS.phoneFriendly}</span>
            </TrackedPhoneLink>
          </div>

          <p className="mt-7 inline-flex items-center gap-2 text-[0.8125rem] text-on-dark">
            <ShieldCheck className="h-4 w-4 text-accent" strokeWidth={2} aria-hidden="true" />
            Fully insured · ABN registered · No obligation
          </p>
        </Reveal>
      </div>
    </section>
  );
}
