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
      eyebrow="FAQ"
      title="Every question, answered."
      subtitle={
        <p>
          Everything you need to know about selling your car for cash in Brisbane. Can&apos;t find your answer? <Link href="/contact" className="text-primary font-medium link-underline">Contact us</Link>.
        </p>
      }
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-24 space-y-14 sm:space-y-16">
        {faqCategories.map((category, idx) => (
          <div key={category.category}>
            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-mono text-xs font-medium tabular-nums tracking-[0.1em] text-primary">
                {String(idx + 1).padStart(2, "0")}
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-semibold text-foreground leading-[1.15]" style={{ letterSpacing: "var(--tracking-tight)" }}>
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

        <div className="rounded-2xl border border-border/60 bg-secondary/60 p-8 sm:p-10 text-center">
          <p className="eyebrow mb-3">Still stuck?</p>
          <h2 className="text-xl sm:text-2xl font-display font-semibold text-foreground mb-3" style={{ letterSpacing: "var(--tracking-tight)" }}>Still have questions?</h2>
          <p className="text-muted-foreground mb-7 max-w-md mx-auto">
            Our Brisbane team is happy to help. No obligation — just a quick chat.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={BUSINESS.phoneHref}
              className="inline-flex min-h-[44px] items-center justify-center gap-2 bg-primary text-primary-foreground rounded-full py-3 px-6 text-sm font-semibold transition-[transform,box-shadow] duration-200 hover:-translate-y-px hover:shadow-[0_8px_24px_hsl(var(--primary)/0.25)]"
            >
              <Phone className="h-4 w-4" strokeWidth={1.5} />
              Call {BUSINESS.phoneFriendly}
            </a>
            <Link
              href="/#price-estimator"
              className="inline-flex min-h-[44px] items-center justify-center gap-2 border border-border/80 bg-card text-foreground rounded-full py-3 px-6 text-sm font-semibold transition-colors duration-200 hover:border-primary/40 hover:text-primary"
            >
              Get a free quote
            </Link>
            <Link
              href="/contact"
              className="inline-flex min-h-[44px] items-center justify-center gap-2 border border-border/80 bg-card text-foreground rounded-full py-3 px-6 text-sm font-semibold transition-colors duration-200 hover:border-primary/40 hover:text-primary"
            >
              <MessageCircle className="h-4 w-4" strokeWidth={1.5} />
              Contact us
            </Link>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
