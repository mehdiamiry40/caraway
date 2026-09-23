import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { Accordion } from "@/components/ui/accordion";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BUSINESS } from "@/lib/site";
import { faqCategories } from "@/lib/faq-data";

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
      eyebrow="FAQ"
      title="Vehicle selling questions, answered."
      subtitle={
        <p>
          Everything you need to know about selling your car for cash in Brisbane. Can&apos;t find your answer? <Link href="/contact" className="text-primary font-medium link-underline">Contact us</Link>.
        </p>
      }
    >
      <div className="site-container py-16 sm:py-20 lg:py-28">
        <div className="lg:grid lg:grid-cols-12 lg:gap-12">
          {/* Topic jump links: a swipeable chip row on phones, a sticky
              sidebar on desktop so the 18 questions stay navigable. */}
          <aside className="mb-10 lg:col-span-3 lg:mb-0">
            <nav
              aria-label="FAQ topics"
              className="lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]"
            >
              <p className="eyebrow mb-4 text-sm">Topics</p>
              <ol className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-none sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 lg:flex-col lg:gap-1">
                {faqCategories.map((category, idx) => (
                  <li key={category.category} className="shrink-0">
                    <a
                      href={`#${topicId(category.category)}`}
                      className="group inline-flex min-h-11 shrink-0 items-center gap-3 whitespace-nowrap rounded border border-border px-4 text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground lg:w-full lg:border-0 lg:px-0"
                    >
                      <span className="tabular-nums text-xs text-muted-foreground">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      {category.category}
                    </a>
                  </li>
                ))}
              </ol>
              <p className="mt-6 hidden text-sm leading-relaxed text-muted-foreground lg:block">
                Can&apos;t find your answer?{" "}
                <a href={BUSINESS.phoneTel} className="font-medium text-primary link-underline">
                  Call {BUSINESS.phoneDisplay}
                </a>
              </p>
            </nav>
          </aside>

          <div className="space-y-14 sm:space-y-16 lg:col-span-9 lg:max-w-3xl">
            {faqCategories.map((category, idx) => (
              <section
                key={category.category}
                id={topicId(category.category)}
                aria-labelledby={`${topicId(category.category)}-heading`}
                className="scroll-mt-header"
              >
                <div className="mb-6 flex items-baseline gap-4">
                  <span className="text-sm tabular-nums text-muted-foreground">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <h2
                    id={`${topicId(category.category)}-heading`}
                    className="text-2xl font-semibold tracking-[-0.02em] text-foreground"
                  >
                    {category.category}
                  </h2>
                </div>
                <Accordion
                  items={category.faqs.map(f => ({ question: f.question, answer: f.answer }))}
                />
              </section>
            ))}

            <div className="border-t border-border pt-10">
              <h2 className="mb-3 text-xl font-semibold tracking-[-0.02em] text-foreground">Still have questions?</h2>
              <p className="mb-6 max-w-md text-base text-muted-foreground">
                Our Brisbane team is happy to help. No obligation — just a quick chat.
              </p>
              <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6">
                <Link
                  href="/#quote-form"
                  className={cn(buttonVariants({ variant: "default", size: "sm" }))}
                >
                  Get my quote
                </Link>
                <a
                  href={BUSINESS.phoneTel}
                  className={cn(buttonVariants({ variant: "link", size: "sm" }))}
                >
                  Call {BUSINESS.phoneDisplay}
                </a>
                <Link
                  href="/contact"
                  className={cn(buttonVariants({ variant: "link", size: "sm" }))}
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
