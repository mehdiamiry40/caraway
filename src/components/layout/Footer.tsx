import Link from "next/link";
import { AUTHORITY_OUTBOUND_LINKS } from "@/data/resource-links";
import { BUSINESS } from "@/lib/site";
import { TrackedOutboundLink } from "@/components/layout/TrackedOutboundLink";
import { TrackedPhoneLink } from "@/components/layout/TrackedPhoneLink";

const serviceLinks = [
  { label: "All Services", href: "/services" },
  { label: "Cash for Cars Brisbane", href: "/cash-for-cars-brisbane" },
  { label: "Car Removal Brisbane", href: "/car-removal-brisbane" },
  { label: "Sell My Car Brisbane", href: "/sell-my-car-brisbane" },
  { label: "Scrap Car Removal", href: "/scrap-car-removal-brisbane" },
  { label: "Damaged Cars", href: "/damaged-cars-brisbane" },
];

const locationLinks = [
  { label: "Toowong", href: "/locations/toowong" },
  { label: "Logan", href: "/locations/logan" },
  { label: "Redcliffe", href: "/locations/redcliffe" },
  { label: "Moorooka", href: "/locations/moorooka" },
  { label: "Capalaba", href: "/locations/capalaba" },
  { label: "All locations", href: "/locations" },
];

const companyLinks = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "FAQ", href: "/faq" },
  { label: "Blog", href: "/blog" },
  { label: "Vehicle data", href: "/resources/queensland-vehicle-data" },
  { label: "Get a quote", href: "/#quote-form" },
];

const legalLinks = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Accessibility", href: "/accessibility" },
  { label: "Sitemap", href: "/site-map" },
];

const linkClasses =
  "inline-flex min-h-11 items-center rounded-sm text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

const columns = [
  { label: "Services", links: serviceLinks },
  { label: "Locations", links: locationLinks },
  { label: "Company", links: companyLinks },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border pl-safe pr-safe">
      <div className="site-container py-16 sm:py-20">
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3">
          {columns.map((column) => (
            <nav
              key={column.label}
              aria-label={column.label}
              className={column.label === "Company" ? "col-span-2 sm:col-span-1" : undefined}
            >
              <p className="eyebrow mb-3">{column.label}</p>
              <ul>
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} prefetch={false} className={linkClasses}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-1 border-t border-border pt-8 text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6">
          <TrackedPhoneLink
            href={BUSINESS.phoneTel}
            location="footer"
            className={linkClasses + " tabular-nums text-foreground"}
            ariaLabel={`Call ${BUSINESS.phoneDisplay}`}
          >
            {BUSINESS.phoneDisplay}
          </TrackedPhoneLink>
          <a href={BUSINESS.emailHref} className={linkClasses}>
            {BUSINESS.email}
          </a>
          <address className="not-italic">{BUSINESS.addressFormatted}</address>
          <TrackedOutboundLink
            href={BUSINESS.googleBusinessUrl}
            label="Caraway on Google"
            location="footer"
            className={linkClasses}
          >
            View Caraway on Google
          </TrackedOutboundLink>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-x-5 text-xs text-muted-foreground">
          <span>Official references:</span>
          {AUTHORITY_OUTBOUND_LINKS.map((item) => (
            <TrackedOutboundLink
              key={item.href}
              href={item.href}
              label={item.label}
              location="footer_references"
              className="inline-flex min-h-11 items-center rounded-sm transition-colors duration-150 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {item.label}
            </TrackedOutboundLink>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-2 text-xs text-muted-foreground pb-safe sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {year} {BUSINESS.name} · ABN {BUSINESS.abn}</p>
          <nav aria-label="Legal" className="flex flex-wrap gap-x-5">
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                prefetch={false}
                className="inline-flex min-h-11 items-center rounded-sm transition-colors duration-150 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
