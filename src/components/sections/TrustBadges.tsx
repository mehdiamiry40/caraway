import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { CarFront, FileText, SquarePen, Truck } from "lucide-react";
import { BUSINESS } from "@/lib/site";
import { TrackedOutboundLink } from "@/components/layout/TrackedOutboundLink";

/* One short label each; the linked pages hold the detail. */
const quickLinks: { icon: LucideIcon; label: string; href: string }[] = [
  { icon: SquarePen, label: "Get an assessment", href: "/#quote-form" },
  { icon: Truck, label: "Pickup when we buy", href: "/car-removal-brisbane" },
  { icon: FileText, label: "Simple paperwork", href: "/faq" },
  { icon: CarFront, label: "Any condition", href: "/damaged-cars-brisbane" },
];

const linkClass =
  "inline-flex min-h-11 items-center rounded-sm text-on-dark-hi underline decoration-on-dark-hi/60 decoration-1 underline-offset-4 transition-colors hover:decoration-on-dark-hi hover:decoration-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

/**
 * Band of four large line icons with a short promise under each. Blue by
 * default; pass `tone="green"` where the band sits directly above the blue
 * footer so the two do not run together.
 */
export function TrustBadges({ tone = "blue" }: { tone?: "blue" | "green" }) {
  const offset = tone === "green" ? "focus-visible:ring-offset-accent" : "focus-visible:ring-offset-primary";
  return (
    <section
      className={`on-band relative text-on-dark-hi ${tone === "green" ? "bg-accent" : "bg-primary"}`}
      aria-label="Trust and credentials"
    >
      <div className="site-container pb-6 pt-10 sm:pt-12">
        <ul className="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4">
          {quickLinks.map(({ icon: Icon, label, href }) => (
            <li key={label}>
              <Link
                href={href}
                prefetch={href === "/#quote-form" ? false : undefined}
                className={`group flex h-full flex-col items-center gap-3 rounded-sm px-2 py-1 text-center text-on-dark-hi focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 ${offset}`}
              >
                <Icon
                  className="h-16 w-16 transition-transform duration-200 group-hover:-translate-y-0.5 sm:h-20 sm:w-20"
                  strokeWidth={1.25}
                  aria-hidden="true"
                />
                <span className="text-xl font-bold leading-snug decoration-cta-bright decoration-[3px] underline-offset-[6px] group-hover:underline sm:text-[1.375rem]">
                  {label}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 border-t border-on-dark-hi/40 pt-3 text-base">
          <Link href="/locations" className={`${linkClass} ${offset}`}>
            Check your area
          </Link>
          <TrackedOutboundLink
            href={BUSINESS.googleBusinessUrl}
            label="View Caraway on Google"
            location="homepage_trust"
            className={`${linkClass} ${offset}`}
          >
            View Caraway on Google
          </TrackedOutboundLink>
          <TrackedOutboundLink
            href={BUSINESS.abrUrl}
            label={`Verify ABN ${BUSINESS.abn}`}
            location="homepage_trust"
            className={`${linkClass} ${offset}`}
          >
            ABN {BUSINESS.abn}
          </TrackedOutboundLink>
        </div>
      </div>
    </section>
  );
}
