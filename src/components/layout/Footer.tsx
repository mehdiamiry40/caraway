import Link from "next/link";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { AUTHORITY_OUTBOUND_LINKS } from "@/data/resource-links";
import { BUSINESS } from "@/lib/site";
import { TrackedOutboundLink } from "@/components/layout/TrackedOutboundLink";
import { TrackedPhoneLink } from "@/components/layout/TrackedPhoneLink";

const serviceLinks = [
  { label: "Cash for Cars Brisbane", href: "/cash-for-cars-brisbane" },
  { label: "Car Removal Brisbane", href: "/car-removal-brisbane" },
  { label: "Sell My Car Brisbane", href: "/sell-my-car-brisbane" },
  { label: "Scrap Car Removal", href: "/scrap-car-removal-brisbane" },
  { label: "Unwanted Cars", href: "/unwanted-cars-brisbane" },
  { label: "Damaged Cars", href: "/damaged-cars-brisbane" },
];

const locationLinks = [
  { label: "North Brisbane", href: "/locations/north-brisbane" },
  { label: "South Brisbane", href: "/locations/south-brisbane" },
  { label: "Logan", href: "/locations/logan" },
  { label: "Ipswich", href: "/locations/ipswich" },
  { label: "Redcliffe", href: "/locations/redcliffe" },
  { label: "Caboolture", href: "/locations/caboolture" },
  { label: "All locations", href: "/locations" },
];

const companyLinks = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "FAQ", href: "/faq" },
  { label: "Blog", href: "/blog" },
  { label: "Get a quote", href: "/#price-estimator" },
];

const legalLinks = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Accessibility", href: "/accessibility" },
  { label: "Sitemap", href: "/site-map" },
];

const navLinkClasses =
  "text-on-dark hover:text-on-dark-hi transition-colors duration-200 text-[0.9375rem] inline-flex items-center min-h-[40px] py-1 rounded-sm focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-ink focus-visible:outline-none touch-manipulation";

const columnHeadingClasses =
  "text-[0.75rem] font-semibold text-on-dark-hi mb-5 uppercase tracking-[0.14em]";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-on-dark pl-safe pr-safe edge-glow-top">
      <div className="site-container py-16 sm:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-12 gap-x-8 gap-y-12">
          {/* Brand + contact */}
          <div className="sm:col-span-2 md:col-span-3 lg:col-span-4">
            <Link
              href="/"
              aria-label="Caraway — Home"
              className="group inline-flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-ink rounded-md"
            >
              <span
                aria-hidden="true"
                className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] bg-accent text-accent-foreground font-display font-bold text-[0.9375rem]"
              >
                C
              </span>
              <span className="font-display font-bold text-xl tracking-[-0.02em] text-on-dark-hi transition-opacity duration-200 group-hover:opacity-90">
                Caraway
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-[0.9375rem] text-on-dark leading-relaxed">
              Brisbane's local cash-for-cars specialists. A firm offer, a free
              pickup, and payment the moment we take the keys.
            </p>

            <ul className="mt-7 space-y-3.5 text-[0.9375rem]">
              <li>
                <TrackedPhoneLink
                  href={BUSINESS.phoneHref}
                  location="footer"
                  className="inline-flex items-center gap-3 text-on-dark-hi hover:text-accent transition-colors duration-200 font-semibold rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
                  ariaLabel={`Call ${BUSINESS.phoneFriendly}`}
                >
                  <Phone aria-hidden="true" className="h-4 w-4 text-accent" strokeWidth={2} />
                  <span>{BUSINESS.phoneFriendly}</span>
                </TrackedPhoneLink>
              </li>
              <li>
                <a
                  href={BUSINESS.emailHref}
                  className="inline-flex items-center gap-3 text-on-dark hover:text-on-dark-hi transition-colors duration-200 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
                >
                  <Mail aria-hidden="true" className="h-4 w-4 text-on-dark/70" strokeWidth={2} />
                  <span>{BUSINESS.email}</span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-on-dark">
                <Clock aria-hidden="true" className="h-4 w-4 text-on-dark/70 mt-[3px] shrink-0" strokeWidth={2} />
                <span><span className="text-on-dark-hi font-semibold">{BUSINESS.hours}</span>, seven days</span>
              </li>
              <li className="flex items-start gap-3 text-on-dark">
                <MapPin aria-hidden="true" className="h-4 w-4 text-on-dark/70 mt-[3px] shrink-0" strokeWidth={2} />
                <address className="not-italic leading-snug">{BUSINESS.addressFormatted}</address>
              </li>
            </ul>
          </div>

          {/* Services */}
          <nav aria-label="Services" className="md:col-span-1 lg:col-span-3">
            <h3 className={columnHeadingClasses}>Services</h3>
            <ul className="space-y-1">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={navLinkClasses}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Locations */}
          <nav aria-label="Locations" className="md:col-span-1 lg:col-span-3">
            <h3 className={columnHeadingClasses}>Locations</h3>
            <ul className="space-y-1">
              {locationLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={navLinkClasses}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Company */}
          <nav aria-label="Company" className="sm:col-span-2 md:col-span-1 lg:col-span-2">
            <h3 className={columnHeadingClasses}>Company</h3>
            <ul className="space-y-1">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={navLinkClasses}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Official references */}
        <div className="mt-14 pt-7 border-t border-on-dark/15 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.8125rem] text-on-dark">
          <span className="font-semibold text-on-dark-hi">Official references</span>
          <span aria-hidden="true" className="text-on-dark/40">·</span>
          {AUTHORITY_OUTBOUND_LINKS.map((item, index) => (
            <span key={item.href} className="inline-flex items-center gap-x-5">
              <TrackedOutboundLink
                href={item.href}
                label={item.label}
                location="footer_references"
                className="hover:text-on-dark-hi transition-colors duration-200 rounded-sm focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-ink focus-visible:outline-none"
              >
                {item.label}
              </TrackedOutboundLink>
              {index < AUTHORITY_OUTBOUND_LINKS.length - 1 ? (
                <span aria-hidden="true" className="text-on-dark/30">·</span>
              ) : null}
            </span>
          ))}
        </div>
      </div>

      {/* Legal bar */}
      <div className="border-t border-on-dark/15 pb-safe">
        <div className="site-container py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[0.8125rem] text-on-dark">
          <p>&copy; {year} {BUSINESS.legalName} · ABN {BUSINESS.abn}</p>
          <nav aria-label="Legal" className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1">
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-on-dark-hi transition-colors duration-200 rounded-sm focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-ink focus-visible:outline-none min-h-[40px] inline-flex items-center touch-manipulation"
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
