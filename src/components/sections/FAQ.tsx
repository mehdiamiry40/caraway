"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Accordion } from "@/components/ui/accordion";
import { faqs } from "@/data/home-faqs";
import { trackEvent } from "@/lib/analytics";

export function FAQ() {
  return (
    <section
      id="faq"
      className="section-y scroll-mt-header bg-muted border-t border-b border-border"
      aria-label="Frequently asked questions"
    >
      <div className="site-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="lg:col-span-5 lg:sticky lg:top-[calc(8rem+env(safe-area-inset-top))]">
            <p className="eyebrow mb-5">FAQ</p>
            <h2 className="text-3xl sm:text-4xl md:text-[2.5rem] font-display text-foreground leading-[1.1] text-balance">
              Cash for cars,
              <br />
              without the surprises.
            </h2>
            <p className="mt-5 text-foreground/80 leading-relaxed text-base sm:text-lg max-w-md">
              Towing, rego, pricing — the stuff people actually ask before they book a pickup.
            </p>
            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm">
              <Link
                href="/faq"
                className="inline-flex items-center gap-1 text-primary link-underline"
              >
                View all questions
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-1 text-foreground/80 link-underline hover:text-foreground"
              >
                Contact us
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7">
            <Accordion
              items={faqs}
              onItemToggle={(question, isOpening) => {
                if (isOpening) trackEvent("faq_opened", { question });
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
