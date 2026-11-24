import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { Accordion } from "@/components/ui/accordion";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight, Phone } from "lucide-react";
import { BUSINESS } from "@/lib/site";
import { faqCategories } from "@/lib/faq-data";
import { SectionHeading } from "@/components/templates/PagePieces";

/** Stable in-page anchor for a category, e.g. "Pricing & Payment" -> "pricing-payment". */
function topicId(category: string) {
  return category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "FAQ" }
];

export default function FAQPage() {
  return (
    <PageShell
      breadcrumbs={breadcrumbs}
      title="Vehicle selling questions, answered."
      subtitle={
        <p>
          Straight answers about selling your car for cash in Brisbane — quotes, pickup, payment and Queensland paperwork. New here? Start with{" "}
          <Link href="/">how cash for cars works in Brisbane</Link>, or{" "}
          <Link href="/contact">contact us</Link>.
        </p>
      }
    >
      <div className="site-container py-10 sm:py-12 lg:py-16">
        <div className="lg:grid lg:grid-cols-12 lg:gap-12">
          {/* Topic jump links: a swipeable row on phones, a sticky box on
              desktop so the questions stay navigable. */}
          <aside className="mb-9 lg:col-span-3 lg:mb-0">
            <nav
              aria-label="FAQ topics"
              className="lg:sticky lg:top-[calc(var(--header-h)+1.5rem)] lg:rounded-md lg:border lg:border-border lg:border-t-4 lg:border-t-primary lg:px-5 lg:pb-4 lg:pt-4"
            >
              <p className="mb-2 text-xl font-bold text-primary">Topics</p>
              <ol className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-none sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 lg:flex-col lg:gap-0">
                {faqCategories.map((category) => (
                  <li key={category.category} className="shrink-0">
                    <a
                      href={`#${topicId(category.category)}`}
                      className="inline-flex min-h-11 shrink-0 items-center whitespace-nowrap rounded-sm border-2 border-primary bg-card px-3.5 text-base font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 lg:w-full lg:whitespace-normal lg:border-0 lg:bg-transparent lg:px-0 lg:underline lg:decoration-primary/40 lg:decoration-1 lg:underline-offset-4 lg:hover:bg-transparent lg:hover:text-primary lg:hover:decoration-2"
                    >
                      {category.category}
                    </a>
                  </li>
                ))}
              </ol>
              <p className="mt-4 hidden text-base leading-relaxed text-foreground lg:block">
                Can&apos;t find your answer?{" "}
                <a href={BUSINESS.phoneTel} className="font-bold text-primary link-underline">
                  Call {BUSINESS.phoneDisplay}
                </a>
              </p>
            </nav>
          </aside>

          <div className="space-y-12 lg:col-span-9">
            {faqCategories.map((category) => (
              <section
                key={category.category}
                id={topicId(category.category)}
                aria-labelledby={`${topicId(category.category)}-heading`}
                className="scroll-mt-header"
              >
                <SectionHeading id={`${topicId(category.category)}-heading`}>
                  {category.category}
                </SectionHeading>
                <Accordion
                  items={category.faqs.map(f => ({ question: f.question, answer: f.answer }))}
                />
              </section>
            ))}

            <div className="on-band rounded-md bg-primary px-6 py-8 text-center text-on-dark-hi sm:px-8">
              <h2 className="type-h2 text-on-dark-hi">Still have questions?</h2>
              <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  href="/#quote-form"
                  className={cn(buttonVariants({ variant: "outlineOnDark" }), "ring-offset-primary")}
                >
                  Get my quote
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <a
                  href={BUSINESS.phoneTel}
                  className={cn(buttonVariants({ variant: "default" }), "ring-offset-primary")}
                >
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  Call {BUSINESS.phoneDisplay}
                </a>
                <Link
                  href="/contact"
                  className="inline-flex min-h-12 items-center rounded-sm px-2 text-[1.0625rem] font-bold text-on-dark-hi underline decoration-1 underline-offset-4 hover:decoration-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
                >
                  Contact us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
