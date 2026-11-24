import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BUSINESS } from "@/lib/site";
import { TrackedOutboundLink } from "@/components/layout/TrackedOutboundLink";

/* One short label each; the linked pages hold the detail. */
const quickLinks = [
  { label: "Get an assessment", href: "/#quote-form" },
  { label: "Pickup when we buy", href: "/car-removal-brisbane" },
  { label: "Simple paperwork", href: "/faq" },
  { label: "Any condition", href: "/damaged-cars-brisbane" },
] as const;

const linkClass =
  "inline-flex min-h-11 items-center rounded-sm text-foreground/80 underline decoration-foreground/30 decoration-1 underline-offset-4 transition-colors hover:text-primary hover:decoration-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

export function TrustBadges() {
  return (
    <section
      className="relative border-b border-border bg-background"
      aria-label="Trust and credentials"
    >
      <div className="site-container py-5 sm:py-7">
        <ul className="grid grid-cols-2 gap-x-6 lg:grid-cols-4 lg:gap-x-0 lg:divide-x lg:divide-border">
          {quickLinks.map(({ label, href }) => (
            <li key={label} className="lg:px-6 lg:first:pl-0 lg:last:pr-0">
              <Link
                href={href}
                prefetch={href === "/#quote-form" ? false : undefined}
                className="group flex min-h-12 items-center justify-between gap-3 rounded-sm py-2 text-base font-semibold leading-snug text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:text-[1.0625rem]"
              >
                <span className="decoration-cta decoration-2 underline-offset-[5px] group-hover:underline">
                  {label}
                </span>
                <ArrowRight
                  className="h-4 w-4 shrink-0 text-primary/50 transition-[transform,color] duration-200 group-hover:translate-x-0.5 group-hover:text-primary"
                  aria-hidden="true"
                />
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-3 flex flex-wrap items-center gap-x-8 border-t border-border pt-3 text-[0.9375rem]">
          <Link href="/locations" className={linkClass}>
            Check your area
          </Link>
          <TrackedOutboundLink
            href={BUSINESS.googleBusinessUrl}
            label="View Caraway on Google"
            location="homepage_trust"
            className={linkClass}
          >
            View Caraway on Google
          </TrackedOutboundLink>
          <TrackedOutboundLink
            href={BUSINESS.abrUrl}
            label={`Verify ABN ${BUSINESS.abn}`}
            location="homepage_trust"
            className={linkClass}
          >
            ABN {BUSINESS.abn}
          </TrackedOutboundLink>
        </div>
      </div>
    </section>
  );
}
