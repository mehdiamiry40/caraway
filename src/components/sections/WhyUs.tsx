import Link from "next/link";
import { ArrowRight } from "lucide-react";

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
 * The one green band on the home page. A large line of type, the three
 * reasons as a ruled list, and the two main service routes underneath.
 */
export function WhyUs() {
  return (
    <section
      id="why-us"
      className="on-green section-y scroll-mt-header relative bg-ink text-on-dark-hi"
      aria-labelledby="why-us-heading"
    >
      <div className="site-container">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <p className="eyebrow-on-dark">Why Caraway</p>
            {/* One sentence to a line. The spaces between the spans keep the
                heading's text exactly "One price. One pickup. Done." */}
            <h2 id="why-us-heading" className="type-display mt-4 text-on-dark-hi">
              <span className="block">One price.</span>{" "}
              <span className="block">One pickup.</span>{" "}
              <span className="block text-cta-bright">Done.</span>
            </h2>
          </div>

          <ul className="border-t border-on-dark-hi/25 lg:col-span-6 lg:mt-2">
            {reasons.map(({ title, description }) => (
              <li key={title} className="border-b border-on-dark-hi/15 py-5 sm:py-6">
                <h3 className="text-xl font-bold leading-snug text-on-dark-hi">
                  {title}
                </h3>
                <p className="mt-1.5 text-base leading-relaxed text-on-dark">{description}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-x-16 gap-y-8 md:grid-cols-2 lg:mt-16">
          {routes.map((route) => (
            <article key={route.href}>
              <p className="max-w-[26rem] font-display text-[1.375rem] font-medium leading-snug text-on-dark-hi">
                {route.blurb}
              </p>
              <Link
                href={route.href}
                className="group mt-3 inline-flex min-h-11 items-center gap-2 rounded-sm text-base font-semibold text-cta-bright underline decoration-cta-bright/50 decoration-1 underline-offset-[5px] transition-colors hover:decoration-cta-bright hover:decoration-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-ink"
              >
                {route.label}
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
