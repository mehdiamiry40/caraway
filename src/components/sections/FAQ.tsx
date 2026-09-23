import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Accordion } from "@/components/ui/accordion";
import { homepageFaqs } from "@/data/home-faqs";

export function FAQ() {
  return (
    <section
      id="faq"
      className="section-y scroll-mt-header border-t border-border"
      aria-label="Frequently asked questions"
    >
      <div className="site-container grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <p className="eyebrow mb-4">FAQ</p>
          <h2 className="text-3xl font-semibold leading-[1.15] tracking-[-0.02em] text-foreground text-balance">
            Cash for cars, without the surprises.
          </h2>
          <div className="mt-6 flex flex-wrap gap-x-6">
            <Link href="/faq" className={buttonVariants({ variant: "link" })}>
              View all questions
            </Link>
            <Link href="/contact" className={buttonVariants({ variant: "link" })}>
              Contact us
            </Link>
          </div>
        </div>

        <div className="lg:col-span-8">
          <Accordion items={homepageFaqs} />
        </div>
      </div>
    </section>
  );
}
