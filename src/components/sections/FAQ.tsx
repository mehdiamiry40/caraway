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
        <div className="section-head">
          <h2 className="type-h2">
            Questions? Answered.
          </h2>
          <div className="mt-2 flex flex-wrap justify-center gap-x-8 gap-y-1 text-[1.0625rem]">
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

        <div className="mx-auto max-w-4xl">
          <Accordion items={homepageFaqs} />
        </div>
      </div>
    </section>
  );
}
