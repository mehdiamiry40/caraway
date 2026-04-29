"use client";

import Link from "next/link";
import { Accordion } from "@/components/ui/accordion";
import { faqs } from "@/data/home-faqs";
import { trackEvent } from "@/lib/analytics";

export function FAQ() {
  return (
    <section
      id="faq"
      className="section-y bg-background border-t border-border"
      aria-label="Frequently asked questions"
    >
      <div className="site-container">
        <div className="max-w-2xl mb-10 sm:mb-12">
          <p className="eyebrow mb-4">FAQ</p>
          <h2 className="font-medium text-3xl sm:text-4xl leading-tight tracking-[var(--tracking-tight)] text-foreground text-balance">
            Cash for cars, without the surprises.
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed text-base sm:text-lg max-w-xl">
            Towing, rego, pricing — the stuff people actually ask before booking.
          </p>
        </div>

        <Accordion
          items={faqs}
          onItemToggle={(question, isOpening) => {
            if (isOpening) trackEvent("faq_opened", { question });
          }}
        />

        <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <Link href="/faq" className="text-foreground link-underline">
            View all questions
          </Link>
          <Link href="/contact" className="text-muted-foreground link-underline hover:text-foreground">
            Contact us
          </Link>
        </div>
      </div>
    </section>
  );
}
