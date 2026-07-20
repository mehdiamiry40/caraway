import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { Accordion } from "@/components/ui/accordion";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MessageCircle, Phone } from "lucide-react";
import { BUSINESS } from "@/lib/site";
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
      <div className="site-container py-14 sm:py-20 lg:py-24">
        <div className="max-w-3xl mx-auto space-y-14 sm:space-y-16">
          {faqCategories.map((category, idx) => (
          <div key={category.category}>
            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-mono text-xs font-medium tabular-nums tracking-[0.1em] text-primary">
                {String(idx + 1).padStart(2, "0")}
              </span>
              <h2 className="text-2xl sm:text-3xl font-display text-foreground leading-[1.15]" style={{ letterSpacing: "var(--tracking-tight)" }}>
                {category.category}
              </h2>
            </div>
            <Accordion
              items={category.faqs.map(f => ({ question: f.question, answer: f.answer }))}
            />
          </div>
        ))}

        <div className="rounded-md border border-border/60 bg-secondary/60 p-8 sm:p-10 text-center">
          <h2 className="text-xl sm:text-2xl font-display text-foreground mb-3" style={{ letterSpacing: "var(--tracking-tight)" }}>Still have questions?</h2>
          <p className="text-muted-foreground mb-7 max-w-md mx-auto">
            Our Brisbane team is happy to help. No obligation — just a quick chat.
          </p>
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 justify-center">
            <a
              href={BUSINESS.phoneTel}
              className={cn(buttonVariants({ variant: "primary", size: "sm" }))}
            >
              <Phone className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
              Call {BUSINESS.phoneDisplay}
            </a>
            <Link
              href="/#price-estimator"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              Get my quote
            </Link>
            <Link
              href="/contact"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              <MessageCircle className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
              Contact us
            </Link>
          </div>
        </div>
        </div>
      </div>
    </PageShell>
  );
}
