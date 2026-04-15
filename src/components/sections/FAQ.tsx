"use client";

import Link from "next/link";
import { Accordion } from "@/components/ui/accordion";
import { faqs } from "@/data/home-faqs";
import { trackEvent } from "@/lib/analytics";

export function FAQ() {
  return (
    <section id="faq" className="section-y bg-secondary" aria-label="Frequently asked questions">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-primary text-balance">Cash for Cars Brisbane FAQ</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed max-w-xl mx-auto">
            Towing, rego, pricing — the stuff people actually ask before they book a pickup.
          </p>
        </div>

        <Accordion
          items={faqs}
          onItemToggle={(question, isOpening) => {
            if (isOpening) trackEvent("faq_opened", { question });
          }}
        />

        <div className="mt-8 sm:mt-10 text-center text-sm text-muted-foreground space-y-3">
          <p>
            <Link href="/faq" className="inline-flex items-center min-h-11 text-primary font-semibold hover:underline touch-manipulation">
              View all questions
            </Link>
            {" · "}
            <Link href="/blog" className="inline-flex items-center min-h-11 text-primary font-semibold hover:underline touch-manipulation">
              Selling guides
            </Link>
          </p>
          <p>
            Still have questions?{" "}
            <Link href="/#price-estimator" className="inline-flex items-center min-h-11 text-primary font-semibold hover:underline touch-manipulation">
              Get an instant quote
            </Link>{" "}
            or{" "}
            <Link href="/contact" className="inline-flex items-center min-h-11 text-primary font-semibold hover:underline touch-manipulation">
              contact us
            </Link>{" "}
            — we&apos;re available 7 days a week.
          </p>
        </div>
      </div>
    </section>
  );
}
