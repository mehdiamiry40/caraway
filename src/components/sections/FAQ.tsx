import Link from "next/link";
import { ArrowUpRight, MessageCircleQuestion } from "lucide-react";
import { Accordion } from "@/components/ui/accordion";
import { homepageFaqs } from "@/data/home-faqs";

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
            <span className="mb-5 flex h-14 w-14 items-center justify-center bg-primary text-primary-foreground">
              <MessageCircleQuestion className="h-7 w-7" strokeWidth={1.75} aria-hidden="true" />
            </span>
            <p className="eyebrow mb-4">FAQ</p>
            <h2 className="text-3xl sm:text-4xl md:text-[2.5rem] font-display font-bold text-primary leading-[1.1] text-balance">
              Questions? Answered.
            </h2>
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm">
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
