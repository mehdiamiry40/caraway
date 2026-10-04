import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { Accordion } from "@/components/ui/accordion";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight, MessageCircle, Phone } from "lucide-react";
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
      <div className="site-container py-12 sm:py-16 lg:py-20">
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
                      className="group inline-flex min-h-11 shrink-0 items-center gap-2.5 whitespace-nowrap rounded-none border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors hover:border-primary/50 hover:text-primary lg:w-full lg:rounded-lg lg:border-transparent lg:bg-transparent lg:px-3 lg:hover:bg-secondary"
                    >
                      <span className="tabular-nums text-xs font-semibold text-muted-foreground group-hover:text-primary">
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
                <div className="mb-6 flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold tabular-nums text-primary">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <h2
                    id={`${topicId(category.category)}-heading`}
                    className="text-2xl sm:text-3xl font-display text-foreground leading-[1.15]"
                    style={{ letterSpacing: "var(--tracking-tight)" }}
                  >
                    {category.category}
                  </h2>
                </div>
                <Accordion
                  items={category.faqs.map(f => ({ question: f.question, answer: f.answer }))}
                />
              </section>
            ))}

            <div className="rounded-2xl border border-border/60 bg-secondary/60 p-6 sm:p-10 text-center">
              <h2 className="text-xl sm:text-2xl font-display text-foreground mb-3" style={{ letterSpacing: "var(--tracking-tight)" }}>Still have questions?</h2>
              <p className="text-muted-foreground mb-7 max-w-md mx-auto">
                Our Brisbane team is happy to help. No obligation — just a quick chat.
              </p>
              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 justify-center">
                <Link
                  href="/#quote-form"
                  className={cn(buttonVariants({ variant: "default", size: "sm" }))}
                >
                  Get my quote
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <a
                  href={BUSINESS.phoneTel}
                  className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                >
                  <Phone className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                  Call {BUSINESS.phoneDisplay}
                </a>
                <Link
                  href="/contact"
                  className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
                >
                  <MessageCircle className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
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
