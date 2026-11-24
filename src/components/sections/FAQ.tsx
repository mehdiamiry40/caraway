import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4 lg:sticky lg:top-[calc(var(--header-h)+2.5rem+env(safe-area-inset-top))]">
            <h2 className="type-h2">
              Questions? Answered.
            </h2>
            <div className="mt-4 flex flex-wrap gap-x-7 gap-y-1 text-base lg:flex-col">
              <Link href="/faq" className="link-arrow">
                View all questions
                <ArrowRight aria-hidden />
              </Link>
              <Link href="/contact" className="link-arrow">
                Contact us
                <ArrowRight aria-hidden />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-8">
            <Accordion items={homepageFaqs} />
          </div>
        </div>
      </div>
    </section>
  );
}
