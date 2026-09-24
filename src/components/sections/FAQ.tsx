import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Accordion } from "@/components/ui/accordion";
import { homepageFaqs } from "@/data/home-faqs";

export function FAQ() {
  return (
    <section
      id="faq"
      className="section-y scroll-mt-header bg-secondary"
      aria-label="Frequently asked questions"
    >
      <div className="site-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="lg:col-span-5 lg:sticky lg:top-[calc(8rem+env(safe-area-inset-top))]">
            <p className="eyebrow mb-5">FAQ</p>
            <h2 className="font-display text-[clamp(2rem,3.4vw,2.9rem)] leading-[1.15] text-primary text-balance">
              Cash for cars,
              <br />
              without the surprises.
            </h2>
            <p className="mt-5 text-foreground/80 leading-relaxed text-base sm:text-lg max-w-md">
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
