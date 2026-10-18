import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import {
  HOME_CASH_INTRO,
  homeCashSections,
  homeVehicleLinks,
} from "@/data/home-content";

/**
 * The homepage's long-form "cash for cars Brisbane" explainer. Exygy-style
 * two-column layout: a sticky heading on the left, readable sections on the
 * right, with the specialist service pages linked as the vehicles we buy.
 */
export function HomeCashForCars() {
  return (
    <section
      id="cash-for-cars"
      className="section-y scroll-mt-header border-t border-border bg-background"
      aria-labelledby="cash-for-cars-heading"
    >
      <div className="site-container grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Cash for cars Brisbane
            </p>
            <h2
              id="cash-for-cars-heading"
              className="font-display text-[2rem] font-medium leading-[1.15] text-foreground sm:text-5xl sm:leading-[3.5rem]"
            >
              Selling your car for cash in Brisbane, explained.
            </h2>
            <p className="mt-6 text-lg leading-8 text-foreground/85">{HOME_CASH_INTRO}</p>

            <div className="mt-8">
              <p className="mb-3 text-sm font-semibold text-foreground">Specialist pages</p>
              <ul className="flex flex-wrap gap-2">
                {homeVehicleLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="inline-flex min-h-11 items-center bg-secondary px-3.5 text-[0.9375rem] text-foreground transition-colors hover:bg-foreground hover:text-background"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="divide-y divide-border lg:col-span-7">
          {homeCashSections.map((section) => (
            <article key={section.heading} className="py-8 first:pt-0 last:pb-0">
              <h3 className="font-display text-2xl font-medium leading-snug text-foreground sm:text-[1.75rem]">
                {section.heading}
              </h3>
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
