import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Accordion } from "@/components/ui/accordion";
import { homepageFaqs } from "@/data/home-faqs";

export function FAQ() {
  return (
    <section
      id="faq"
      className="section-y scroll-mt-header bg-secondary border-t border-b border-border"
      aria-label="Frequently asked questions"
    >
      <div className="site-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="lg:col-span-5 lg:sticky lg:top-[calc(8rem+env(safe-area-inset-top))]">
            <p className="t-index text-accent-ink">Useful answers</p>
            <h2 className="mt-5 font-display text-4xl font-medium leading-[1.08] tracking-tight text-foreground text-balance sm:text-5xl">
              Before you request a quote.
            </h2>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-muted-foreground">
              Towing, rego, pricing — the stuff people actually ask before they book a pickup.
            </p>
            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm">
              <Link
                href="/faq"
                className="inline-flex min-h-11 items-center gap-1 text-primary link-underline"
              >
                View all questions
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
              <Link
                href="/contact"
                className="inline-flex min-h-11 items-center gap-1 text-foreground/80 link-underline hover:text-foreground"
              >
                Contact us
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7">
            <Accordion items={homepageFaqs} />
          </div>
        </div>
      </div>
    </section>
  );
}
