import Link from "next/link";
import { BUSINESS } from "@/lib/site";
import { TrackedOutboundLink } from "@/components/layout/TrackedOutboundLink";

const quickLinks = [
  { label: "Check your area", href: "/locations" },
  { label: "Cash for cars Brisbane", href: "/cash-for-cars-brisbane" },
  { label: "Pickup terms", href: "/car-removal-brisbane" },
  { label: "Paperwork questions", href: "/faq" },
] as const;

const linkClass =
  "inline-flex min-h-11 items-center rounded-sm text-sm text-primary underline decoration-primary/35 underline-offset-4 transition-colors duration-150 hover:decoration-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

/** One quiet row of verifiable facts. No ratings or counts are shown because
 *  none are published; the Google and ABR links let people check for
 *  themselves. */
export function TrustBadges() {
  return (
    <section className="border-t border-border" aria-labelledby="trust-heading">
      <div className="site-container grid grid-cols-1 gap-6 py-10 sm:py-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <h2 id="trust-heading" className="text-base font-semibold text-foreground">
            Local service across Greater Brisbane
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Brisbane-based · ABN {BUSINESS.abn}
          </p>
        </div>

        <div className="lg:col-span-8">
          <ul className="flex flex-wrap gap-x-6">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={linkClass}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <TrackedOutboundLink
                href={BUSINESS.googleBusinessUrl}
                label="View Caraway on Google"
                location="homepage_trust"
                className={linkClass}
              >
                View Caraway on Google
              </TrackedOutboundLink>
            </li>
            <li>
              <TrackedOutboundLink
                href={BUSINESS.abrUrl}
                label={`Verify ABN ${BUSINESS.abn}`}
                location="homepage_trust"
                className={linkClass}
              >
                Verify our ABN on the ABR
              </TrackedOutboundLink>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
