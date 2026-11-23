import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import {
  HOME_CASH_INTRO,
  homeCashSections,
  homeVehicleLinks,
} from "@/data/home-content";

/**
 * The homepage's long-form "cash for cars Brisbane" explainer. Two columns: a
 * sticky heading on the left, readable sections on the right, with the
 * specialist service pages linked beside the intro.
 */
export function HomeCashForCars() {
  return (
    <section
      id="cash-for-cars"
      className="section-y scroll-mt-header bg-background"
      aria-labelledby="cash-for-cars-heading"
    >
      <div className="site-container grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
            <p className="eyebrow">Cash for cars Brisbane</p>
            <h2
              id="cash-for-cars-heading"
              className="display-impact mt-4 text-[2.5rem] text-foreground sm:text-[3.25rem]"
            >
              Selling your car for cash in Brisbane, explained.
            </h2>
            <p className="mt-6 text-lg leading-8 text-foreground/85">{HOME_CASH_INTRO}</p>

            <div className="mt-8 border-l-4 border-cta bg-secondary p-5">
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.12em] text-foreground">Specialist pages</p>
              <ul className="flex flex-wrap gap-2">
                {homeVehicleLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="inline-flex min-h-11 items-center border border-border bg-card px-3.5 text-[0.9375rem] font-medium text-foreground transition-colors hover:border-foreground hover:bg-foreground hover:text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="divide-y divide-border border-y border-border lg:col-span-7">
          {homeCashSections.map((section, index) => (
            <article key={section.heading} className="py-8">
              <div className="flex items-start gap-4">
                <span
                  aria-hidden="true"
                  className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center bg-ink font-display text-xl font-extrabold leading-none text-cta-bright"
                >
                  {index + 1}
                </span>
                <h3 className="font-display text-[1.75rem] font-bold leading-[1.1] text-foreground sm:text-[2rem]">
                  {section.heading}
                </h3>
              </div>
              {section.paragraphs.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 32)}
                  className="mt-4 text-base leading-7 text-foreground/85 sm:text-[1.0625rem]"
                >
                  {paragraph}
                </p>
              ))}
              {section.checklistItems && (
                <ul className="mt-5 space-y-2.5">
                  {section.checklistItems.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-[0.9375rem] leading-6">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center bg-accent text-accent-foreground">
                        <Check size={12} strokeWidth={3} aria-hidden="true" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              )}
              {section.supportLink && (
                <Link
                  href={section.supportLink.href}
                  className="mt-5 inline-flex min-h-11 items-center gap-1.5 text-base font-semibold text-accent-ink link-underline"
                >
                  {section.supportLink.label}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
