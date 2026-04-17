"use client";

import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { Accordion } from "@/components/ui/accordion";
import { MessageCircle, Phone } from "lucide-react";
import { BUSINESS } from "@/lib/site";
import { trackEvent } from "@/lib/analytics";
import { faqCategories } from "@/lib/faq-data";

const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "FAQ" }
];

export default function FAQPage() {
  return (
    <PageShell
      breadcrumbs={breadcrumbs}
      title="Cash for Cars Brisbane — FAQ"
      subtitle={
        <p>
          Everything you need to know about selling your car for cash in Brisbane. Can&apos;t find your answer? <Link href="/contact" className="text-accent hover:underline font-semibold">Contact us</Link>.
        </p>
      }
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-28 space-y-14">
        {faqCategories.map((category, idx) => (
          <div key={category.category}>
            <div className="flex items-center gap-3 mb-6">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm">{idx + 1}</span>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground leading-snug">
                {category.category}
              </h2>
            </div>
            <Accordion
              items={category.faqs.map(f => ({ question: f.question, answer: f.answer }))}
              onItemToggle={(question, isOpening) => {
                if (isOpening) trackEvent("faq_opened", { question });
              }}
            />
          </div>
        ))}

        <div className="rounded-lg border border-border/60 bg-muted p-5 sm:p-8 md:p-12 text-center">
          <h2 className="text-xl sm:text-2xl font-display font-bold text-primary mb-3">Still Have Questions?</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Our Brisbane team is happy to help. No obligation — just a quick chat.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={BUSINESS.phoneHref}
              className="inline-flex min-h-[44px] items-center justify-center gap-2 bg-primary text-primary-foreground rounded-full py-3.5 px-7 font-semibold hover:bg-primary/90 shadow-sm hover:shadow-md transition-all"
            >
              <Phone className="h-4 w-4" />
              Call {BUSINESS.phoneFriendly}
            </a>
            <Link
              href="/#price-estimator"
              className="inline-flex min-h-[44px] items-center justify-center gap-2 border-2 border-primary text-primary rounded-full py-3.5 px-7 font-semibold hover:bg-primary hover:text-primary-foreground transition-all"
            >
              Get a free quote
            </Link>
            <Link
              href="/contact"
              className="inline-flex min-h-[44px] items-center justify-center gap-2 border-2 border-primary text-primary rounded-full py-3.5 px-7 font-semibold hover:bg-primary hover:text-primary-foreground transition-all"
            >
              <MessageCircle className="h-4 w-4" />
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
