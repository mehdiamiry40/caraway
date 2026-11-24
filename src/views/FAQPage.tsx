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
          <Link href="/" className="text-accent-ink font-medium link-underline">how cash for cars works in Brisbane</Link>, or{" "}
          <Link href="/contact" className="text-accent-ink font-medium link-underline">contact us</Link>.
        </p>
      }
    >
      <div className="site-container py-10 sm:py-14 lg:py-20">
        <div className="lg:grid lg:grid-cols-12 lg:gap-16">
          {/* Topic jump links: a swipeable row on phones, a sticky list on
              desktop so the questions stay navigable. */}
          <aside className="mb-10 lg:col-span-3 lg:mb-0">
            <nav
              aria-label="FAQ topics"
              className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]"
            >
              <p className="eyebrow mb-3">Topics</p>
              <ol className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-none sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 lg:flex-col lg:gap-0 lg:border-t lg:border-foreground/25">
                {faqCategories.map((category) => (
                  <li key={category.category} className="shrink-0 lg:border-b lg:border-border">
                    <a
                      href={`#${topicId(category.category)}`}
                      className="inline-flex min-h-11 shrink-0 items-center whitespace-nowrap rounded-md border border-input bg-card px-3.5 text-[0.9375rem] font-medium text-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 lg:w-full lg:rounded-none lg:border-0 lg:bg-transparent lg:px-0 lg:py-3 lg:hover:underline lg:hover:underline-offset-4"
                    >
                      {category.category}
                    </a>
                  </li>
                ))}
              </ol>
              <p className="mt-6 hidden text-[0.9375rem] leading-relaxed text-muted-foreground lg:block">
                Can&apos;t find your answer?{" "}
                <a href={BUSINESS.phoneTel} className="font-medium text-accent-ink link-underline">
                  Call {BUSINESS.phoneDisplay}
                </a>
              </p>
            </nav>
          </aside>

          <div className="space-y-14 lg:col-span-9 lg:max-w-3xl">
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

            <div className="border-t-2 border-primary pt-7">
              <SectionHeading className="mb-5">Still have questions?</SectionHeading>
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <Link
                  href="/#quote-form"
                  className={cn(buttonVariants({ variant: "default" }))}
                >
                  Get my quote
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <a
                  href={BUSINESS.phoneTel}
                  className={cn(buttonVariants({ variant: "outline" }))}
                >
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  Call {BUSINESS.phoneDisplay}
                </a>
                <Link
                  href="/contact"
                  className={cn(buttonVariants({ variant: "ghost" }))}
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
