import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const reasons = [
  {
    title: "One price, in writing",
    description: "Confirmed before the truck is booked.",
  },
  {
    title: "Paid when we pick up",
    description: "Your keys stay with you until you're paid.",
  },
  {
    title: "Rough to written off",
    description: "Damaged, unregistered, scrap or fleet.",
  },
];

const routes = [
  {
    blurb: "A simpler way to sell your car to a direct Brisbane buyer",
    label: "Sell My Car",
    href: "/sell-my-car-brisbane",
  },
  {
    blurb: "A simpler way to have your car collected, running or not",
    label: "Car Removal",
    href: "/car-removal-brisbane",
  },
];

/**
 * Why Caraway: a centred heading, the three reasons as a row of green ticks,
 * and the two main service routes underneath.
 */
export function WhyUs() {
  return (
    <section
      id="why-us"
      className="section-y scroll-mt-header relative bg-background"
      aria-labelledby="why-us-heading"
    >
      <div className="site-container">
        <div className="section-head">
          <h2 id="why-us-heading" className="type-h2">
            One price. One pickup. <span className="text-accent-ink">Done.</span>
          </h2>
          <p className="eyebrow mt-1">Why Caraway</p>
        </div>

        <ul className="list-ticks mx-auto grid max-w-5xl grid-cols-1 gap-x-10 gap-y-6 !space-y-0 md:grid-cols-3">
          {reasons.map(({ title, description }) => (
            <li key={title}>
              <h3 className="text-xl font-bold leading-snug text-foreground">
                {title}
              </h3>
              <p className="mt-1 text-[1.0625rem] leading-relaxed text-foreground">{description}</p>
            </li>
          ))}
        </ul>

        <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-5 md:grid-cols-2">
          {routes.map((route) => (
            <article
              key={route.href}
              className="flex flex-col items-start gap-4 rounded-md border-2 border-primary px-5 py-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <p className="max-w-[22rem] text-lg font-semibold leading-snug text-foreground">
                {route.blurb}
              </p>
              <Link
                href={route.href}
                className={cn(buttonVariants({ variant: "outline", size: "sm" }), "shrink-0")}
              >
                {route.label}
                <ChevronRight className="h-4 w-4" strokeWidth={3} aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
