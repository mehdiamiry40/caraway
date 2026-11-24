import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  HOME_CASH_INTRO,
  homeCashSections,
  homeVehicleLinks,
} from "@/data/home-content";

/**
 * The homepage's long-form "cash for cars Brisbane" explainer, set like a
 * printed guide: the title and the specialist pages stay beside the reader on
 * the left while the numbered sections run down the right.
 */
export function HomeCashForCars() {
  return (
    <section
      id="cash-for-cars"
      className="section-y scroll-mt-header bg-background"
      aria-labelledby="cash-for-cars-heading"
    >
      <div className="site-container grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+2.5rem)]">
            <p className="eyebrow">Cash for cars Brisbane</p>
            <h2 id="cash-for-cars-heading" className="type-h2 mt-3">
              Selling your car for cash in Brisbane, explained.
            </h2>
            <p className="mt-5 text-base leading-7 text-foreground/80">{HOME_CASH_INTRO}</p>

            <div className="mt-8 border-t border-foreground/25 pt-4">
              <p className="text-sm font-semibold text-foreground">Specialist pages</p>
              <ul className="mt-1 grid grid-cols-2 gap-x-6 lg:grid-cols-1 xl:grid-cols-2">
                {homeVehicleLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="inline-flex min-h-11 items-center rounded-sm text-[0.9375rem] text-accent-ink underline decoration-accent-ink/40 decoration-1 underline-offset-4 transition-colors hover:text-primary hover:decoration-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 lg:border-l lg:border-border lg:pl-16">
          {homeCashSections.map((section, index) => (
            <article
              key={section.heading}
              className="max-w-[44rem] border-t border-border py-9 first:border-t-0 first:pt-0 last:pb-0"
            >
              <div className="flex items-baseline gap-3 font-display text-[1.375rem] font-semibold leading-tight tracking-[-0.02em] sm:text-[1.625rem]">
                <span aria-hidden="true" className="shrink-0 tabular-nums text-accent">
                  {index + 1}.
                </span>
                <h3 className="font-display text-[1em] font-semibold leading-tight tracking-[-0.02em] text-primary">
                  {section.heading}
                </h3>
              </div>
              {section.paragraphs.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 32)}
                  className="mt-4 text-base leading-7 text-foreground/85 sm:text-[1.0625rem] sm:leading-[1.7]"
                >
                  {paragraph}
                </p>
              ))}
              {section.checklistItems && (
                <ul className="list-ticks mt-5 text-base text-foreground/85">
                  {section.checklistItems.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
              {section.supportLink && (
                <p className="mt-5">
                  <Link href={section.supportLink.href} className="link-arrow text-base">
                    {section.supportLink.label}
                    <ArrowRight aria-hidden="true" />
                  </Link>
                </p>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
