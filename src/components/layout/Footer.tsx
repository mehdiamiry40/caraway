import Link from "next/link";
import { Mail, MapPin, Phone, Star } from "lucide-react";
import { AUTHORITY_OUTBOUND_LINKS } from "@/data/resource-links";
import { BUSINESS } from "@/lib/site";
import { TrackedOutboundLink } from "@/components/layout/TrackedOutboundLink";
import { TrackedPhoneLink } from "@/components/layout/TrackedPhoneLink";
import { Logo } from "@/components/layout/Logo";

const serviceLinks = [
  { label: "All Services", href: "/services" },
  { label: "Cash for Cars Brisbane", href: "/" },
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

const focusClasses =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ink";

const navLinkClasses = `inline-flex min-h-[44px] items-center py-2 text-[0.9375rem] text-on-dark transition-colors duration-200 hover:text-cta-bright touch-manipulation ${focusClasses}`;

const columnHeadingClasses =
  "mb-3 font-display text-lg font-bold uppercase tracking-[0.06em] text-on-dark-hi";

const contactLinkClasses = `inline-flex min-h-11 items-center gap-2.5 text-on-dark transition-colors duration-200 hover:text-cta-bright ${focusClasses}`;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-ink pl-safe pr-safe text-on-dark">
      <div aria-hidden="true" className="hazard-stripe h-2" />

      <div className="site-container py-14 sm:py-16">
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 sm:gap-x-8 md:grid-cols-3 lg:grid-cols-12">
          {/* Brand + contact */}
          <div className="sm:col-span-2 md:col-span-3 lg:col-span-4">
            <Logo />
            <p className="mt-5 max-w-sm text-[0.9375rem] leading-relaxed text-on-dark">
              Brisbane cash for cars and pickup. We quote before we load — running, damaged, or unregistered.
            </p>

            <TrackedPhoneLink
              href={BUSINESS.phoneTel}
              location="footer"
              className={`group mt-6 inline-flex min-h-11 items-center gap-3 text-on-dark-hi ${focusClasses}`}
              ariaLabel={`Call ${BUSINESS.phoneDisplay}`}
            >
              <span className="flex h-12 w-12 items-center justify-center bg-cta text-cta-foreground transition-colors group-hover:bg-cta-hover">
                <Phone aria-hidden="true" className="h-5 w-5" />
              </span>
              <span className="font-display text-[2rem] font-extrabold leading-none tracking-[0.02em]">
                {BUSINESS.phoneDisplay}
              </span>
            </TrackedPhoneLink>

            <div className="mt-4 flex flex-col text-[0.9375rem]">
              <a href={BUSINESS.emailHref} className={contactLinkClasses}>
                <Mail aria-hidden="true" className="h-4 w-4 text-cta-bright" />
                <span>{BUSINESS.email}</span>
              </a>
              <address className="flex min-h-11 items-center gap-2.5 not-italic text-on-dark">
                <MapPin aria-hidden="true" className="h-4 w-4 text-cta-bright" />
                {BUSINESS.addressFormatted}
              </address>
              <TrackedOutboundLink
                href={BUSINESS.googleBusinessUrl}
                label="Caraway on Google"
                location="footer"
                className={contactLinkClasses}
              >
                <Star aria-hidden="true" className="h-4 w-4 text-cta-bright" />
                <span>View Caraway on Google</span>
              </TrackedOutboundLink>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-on-dark">
                Collection timing is confirmed for each accepted job.
              </p>
            </div>
          </div>

          {/* Services */}
          <nav aria-label="Services" className="md:col-span-1 lg:col-span-3">
            <p className={columnHeadingClasses}>Services</p>
            <ul className="flex flex-col items-start">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} prefetch={false} className={navLinkClasses}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Locations */}
          <nav aria-label="Locations" className="md:col-span-1 lg:col-span-3">
            <p className={columnHeadingClasses}>Locations</p>
            <ul className="flex flex-col items-start">
              {locationLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} prefetch={false} className={navLinkClasses}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Company */}
          <nav aria-label="Company" className="sm:col-span-2 md:col-span-1 lg:col-span-2">
            <p className={columnHeadingClasses}>Company</p>
            <ul className="flex flex-col items-start">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} prefetch={false} className={navLinkClasses}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Official references */}
        <div className="mt-12 flex flex-wrap items-center gap-x-5 gap-y-1 border-t border-on-dark-hi/12 pt-6 text-sm text-on-dark">
          <span className="font-semibold text-on-dark-hi">Official references:</span>
          {AUTHORITY_OUTBOUND_LINKS.map((item) => (
            <TrackedOutboundLink
              key={item.href}
              href={item.href}
              label={item.label}
              location="footer_references"
              className={`inline-flex min-h-11 items-center underline decoration-on-dark-hi/30 underline-offset-4 transition-colors duration-200 hover:text-cta-bright hover:decoration-cta ${focusClasses}`}
            >
              {item.label}
            </TrackedOutboundLink>
          ))}
        </div>
      </div>

      {/* Legal bar */}
      <div className="bg-ink-deep pb-safe">
        <div className="site-container flex flex-col items-start justify-between gap-2 py-4 text-sm text-on-dark sm:flex-row sm:items-center">
          <p>Copyright &copy; {year}, {BUSINESS.name} · ABN {BUSINESS.abn}</p>
          <nav aria-label="Legal" className="flex flex-wrap items-center gap-x-5 gap-y-1">
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                prefetch={false}
                className={`-mx-1 inline-flex min-h-[44px] min-w-[44px] items-center justify-center px-2 py-2.5 underline decoration-on-dark-hi/30 underline-offset-[3px] transition-colors duration-200 hover:text-cta-bright hover:decoration-cta touch-manipulation ${focusClasses}`}
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
