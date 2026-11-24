import Link from "next/link";
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
  { label: "Get my quote", href: "/#quote-form" },
];

const legalLinks = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Accessibility", href: "/accessibility" },
  { label: "Sitemap", href: "/site-map" },
];

const focusClasses =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-primary";

const navLinkClasses = `inline-flex min-h-[44px] items-center py-1.5 text-base text-on-dark-hi underline-offset-4 transition-colors duration-150 hover:underline touch-manipulation ${focusClasses}`;

const columnHeadingClasses = "mb-1 text-lg font-bold text-on-dark-hi";

const contactLinkClasses = `inline-flex min-h-11 items-center text-on-dark-hi underline decoration-on-dark-hi/50 decoration-1 underline-offset-4 transition-colors duration-150 hover:decoration-on-dark-hi hover:decoration-2 ${focusClasses}`;

const columnClasses = "lg:border-l lg:border-on-dark-hi/40 lg:pl-6";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="on-band relative border-t-4 border-accent bg-primary pl-safe pr-safe text-on-dark-hi">
      <div className="site-container pb-10 pt-12">
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-12">
          {/* Brand + contact */}
          <div className="sm:col-span-2 md:col-span-3 lg:col-span-4">
            <Logo tone="dark" />
            <p className="mt-4 max-w-sm text-base leading-relaxed text-on-dark-hi">
              Brisbane cash for cars with free towing when we buy. We quote before we load — running, damaged or unregistered.
            </p>

            <TrackedPhoneLink
              href={BUSINESS.phoneTel}
              location="footer"
              className={`group mt-4 inline-flex min-h-11 items-center text-on-dark-hi ${focusClasses}`}
              ariaLabel={`Call ${BUSINESS.phoneDisplay}`}
            >
              <span className="text-[2rem] font-bold leading-none tabular-nums decoration-cta-bright decoration-[3px] underline-offset-[6px] group-hover:underline">
                {BUSINESS.phoneDisplay}
              </span>
            </TrackedPhoneLink>

            <div className="mt-1 flex flex-col items-start text-base">
              <a href={BUSINESS.emailHref} className={contactLinkClasses}>
                <span>{BUSINESS.email}</span>
              </a>
              <TrackedOutboundLink
                href={BUSINESS.googleBusinessUrl}
                label="Caraway on Google"
                location="footer"
                className={contactLinkClasses}
              >
                <span>View Caraway on Google</span>
              </TrackedOutboundLink>
              <address className="flex min-h-11 items-center not-italic text-on-dark-hi">
                {BUSINESS.addressFormatted}
              </address>
              <p className="max-w-xs text-[0.9375rem] leading-relaxed text-on-dark-hi">
                We confirm the pickup time for each job.
              </p>
            </div>
          </div>

          {/* Services */}
          <nav aria-label="Services" className={`md:col-span-1 lg:col-span-3 ${columnClasses}`}>
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
          <nav aria-label="Locations" className={`md:col-span-1 lg:col-span-2 ${columnClasses}`}>
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
          <nav aria-label="Company" className={`sm:col-span-2 md:col-span-1 lg:col-span-3 ${columnClasses}`}>
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
        <div className="mt-10 border-t border-on-dark-hi/40 pt-5 text-[0.9375rem] text-on-dark-hi">
          <p className="font-bold text-on-dark-hi">Official references:</p>
          <div className="mt-1 flex flex-wrap items-center gap-x-6">
            {AUTHORITY_OUTBOUND_LINKS.map((item) => (
              <TrackedOutboundLink
                key={item.href}
                href={item.href}
                label={item.label}
                location="footer_references"
                className={`inline-flex min-h-11 items-center underline decoration-on-dark-hi/50 decoration-1 underline-offset-4 transition-colors duration-150 hover:decoration-on-dark-hi hover:decoration-2 ${focusClasses}`}
              >
                {item.label}
              </TrackedOutboundLink>
            ))}
          </div>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="bg-accent pb-safe">
        <div className="site-container flex flex-col items-start justify-between gap-1 py-3 text-[0.9375rem] text-on-dark-hi sm:flex-row sm:items-center">
          <p>Copyright &copy; {year}, {BUSINESS.name} · ABN {BUSINESS.abn}</p>
          <nav aria-label="Legal" className="flex flex-wrap items-center gap-x-5 gap-y-1">
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                prefetch={false}
                className="-mx-1 inline-flex min-h-[44px] min-w-[44px] items-center justify-center px-1 py-2.5 underline decoration-on-dark-hi/60 decoration-1 underline-offset-4 transition-colors duration-150 hover:decoration-on-dark-hi hover:decoration-2 touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-accent"
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
