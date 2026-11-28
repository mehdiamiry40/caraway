import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  HOME_CASH_INTRO,
  homeCashSections,
  homeVehicleLinks,
} from "@/data/home-content";

/**
 * The homepage's long-form written-offer and pickup explainer: left-aligned
 * text with blue headings and green-tick lists, and the specialist service
 * pages in a box beside it.
 */
export function HomeCashForCars() {
  return (
    <section
      id="cash-for-cars"
      className="section-y scroll-mt-header bg-background"
      aria-labelledby="cash-for-cars-heading"
    >
      <div className="site-container grid grid-cols-1 gap-x-12 gap-y-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <h2 id="cash-for-cars-heading" className="type-h2">
            Selling your car for cash in Brisbane, explained.
          </h2>
          <p className="eyebrow mt-1">Written offer and pickup in Brisbane</p>
          <p className="mt-4 text-[1.0625rem] leading-[1.7] text-foreground">{HOME_CASH_INTRO}</p>
        </div>

        <div className="lg:col-span-4 lg:row-span-2">
          <div className="rounded-md border-2 border-primary px-5 pb-4 pt-5 lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]">
            <p className="text-xl font-bold text-primary">Specialist pages</p>
            <ul className="list-ticks mt-3 grid grid-cols-1 gap-x-6 !space-y-0 min-[420px]:grid-cols-2 lg:grid-cols-1">
              {homeVehicleLinks.map((link) => (
                <li key={link.href} className="before:!top-[0.6rem]">
                  <Link
                    href={link.href}
                    className="inline-flex min-h-11 items-center rounded-sm text-[1.0625rem] font-semibold text-primary underline decoration-primary/40 decoration-1 underline-offset-4 transition-colors hover:decoration-primary hover:decoration-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="lg:col-span-8">
          {homeCashSections.map((section, index) => (
            <article
              key={section.heading}
              className="border-t border-border py-8 first:border-t-0 first:pt-0 last:pb-0"
            >
              <div className="flex items-baseline gap-2.5 text-[1.375rem] font-bold leading-tight text-primary sm:text-[1.625rem]">
                <span aria-hidden="true" className="shrink-0 tabular-nums text-accent-ink">
                  {index + 1}.
                </span>
                <h3 className="text-[1em] font-bold leading-tight text-primary">
                  {section.heading}
                </h3>
              </div>
              {section.paragraphs.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 32)}
                  className="mt-4 text-[1.0625rem] leading-[1.7] text-foreground"
                >
                  {paragraph}
                </p>
              ))}
              {section.checklistItems && (
                <ul className="list-ticks mt-5 text-[1.0625rem] text-foreground">
                  {section.checklistItems.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
              {section.supportLink && (
                <p className="mt-5">
                  <Link href={section.supportLink.href} className="link-arrow text-[1.0625rem]">
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
