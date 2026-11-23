import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Accordion } from "@/components/ui/accordion";
import { homepageFaqs } from "@/data/home-faqs";

export function FAQ() {
  return (
    <section
      id="faq"
      className="section-y scroll-mt-header bg-background"
      aria-label="Frequently asked questions"
    >
      <div className="site-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="lg:col-span-5 lg:sticky lg:top-[calc(var(--header-h)+2rem+env(safe-area-inset-top))]">
            <p className="eyebrow">FAQ</p>
            <h2 className="display-impact mt-4 text-[2.5rem] text-foreground sm:text-[3.5rem]">
              Questions? Answered.
            </h2>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-base">
              <Link
                href="/faq"
                className="inline-flex min-h-11 items-center gap-1 font-semibold text-accent-ink link-underline"
              >
                View all questions
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link
                href="/contact"
                className="inline-flex min-h-11 items-center gap-1 font-semibold text-foreground link-underline"
              >
                Contact us
                <ArrowUpRight className="h-4 w-4" aria-hidden />
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
