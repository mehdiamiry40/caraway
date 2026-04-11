import Link from "next/link";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { BUSINESS } from "@/lib/site";
import { trackEvent } from "@/lib/analytics";

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
  { label: "Bayside Brisbane", href: "/locations/bayside-brisbane" },
  { label: "North Lakes", href: "/locations/north-lakes" },
  { label: "All Locations", href: "/locations" },
];

const companyLinks = [
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "FAQ", href: "/faq" },
  { label: "Blog", href: "/blog" },
  { label: "Get a Quote", href: "/#price-estimator" },
];

const linkClasses = "text-muted-foreground hover:text-primary transition-all duration-200 text-sm rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none inline-flex py-1.5 min-h-[44px] items-center touch-manipulation";

export function Footer() {
  return (
    <footer className="bg-muted text-foreground pl-safe pr-safe border-t border-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20">
        <nav aria-label="Footer navigation" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-8 lg:gap-12">

          <div className="sm:col-span-2 lg:col-span-2">
            <Link href="/" className="font-display font-bold text-2xl tracking-tight text-primary mb-4 block lowercase group">
              <span className="transition-opacity duration-200 group-hover:opacity-80">caraway<span className="text-accent">.</span></span>
            </Link>
            <p className="text-muted-foreground max-w-sm mt-3 leading-relaxed text-sm">
              Brisbane cash for cars and pickup. We quote before we load — running, damaged, or unregistered. Use our online price estimator.
            </p>
            <div className="mt-8 space-y-3.5">
              <a
                href={BUSINESS.phoneHref}
                onClick={() => trackEvent("phone_click", { location: "footer" })}
                className="flex items-center gap-3.5 text-foreground hover:text-primary transition-all duration-200 group text-sm font-semibold"
                aria-label={`Call ${BUSINESS.phoneFriendly}`}
              >
                <span className="flex h-10 w-10 rounded-lg bg-primary/10 border border-primary/20 items-center justify-center group-hover:bg-primary/15 transition-all duration-200">
                  <Phone aria-hidden="true" className="h-4 w-4 text-primary" />
                </span>
                <span>{BUSINESS.phoneFriendly}</span>
              </a>
              <a href={BUSINESS.emailHref} className="flex items-center gap-3.5 text-muted-foreground hover:text-primary transition-all duration-200 group text-sm">
                <span className="flex h-10 w-10 rounded-lg bg-white border border-border/60 items-center justify-center group-hover:border-primary/30 transition-all duration-200">
                  <Mail aria-hidden="true" className="h-4 w-4 text-primary" />
                </span>
                <span>{BUSINESS.email}</span>
              </a>
              <div className="flex items-center gap-3.5 text-muted-foreground text-sm">
                <span className="flex h-10 w-10 rounded-lg bg-white border border-border/60 items-center justify-center">
                  <Clock aria-hidden="true" className="h-4 w-4 text-primary/70" />
                </span>
                <span>{BUSINESS.hours} · {BUSINESS.hoursDetail}</span>
              </div>
              <div className="flex items-center gap-3.5 text-muted-foreground text-sm">
                <span className="flex h-10 w-10 rounded-lg bg-white border border-border/60 items-center justify-center">
                  <MapPin aria-hidden="true" className="h-4 w-4 text-primary/70" />
                </span>
                <span>{BUSINESS.location}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-display font-semibold text-xs uppercase tracking-wider text-primary/70 mb-5 pb-2 border-b border-border/60">Services</h4>
            <ul className="space-y-1">
              {serviceLinks.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClasses}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-xs uppercase tracking-wider text-primary/70 mb-5 pb-2 border-b border-border/60">Locations</h4>
            <ul className="space-y-1">
              {locationLinks.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClasses}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-xs uppercase tracking-wider text-primary/70 mb-5 pb-2 border-b border-border/60">Company</h4>
            <ul className="space-y-1">
              {companyLinks.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClasses}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </nav>
      </div>

      <div className="border-t border-border/60 pb-safe">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {BUSINESS.legalName} · ABN {BUSINESS.abn}</p>
          <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center md:justify-end">
            <Link href="/privacy" className="hover:text-primary transition-colors duration-200 rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none min-h-[44px] inline-flex items-center touch-manipulation py-2 px-1">Privacy Policy</Link>
            <span aria-hidden="true" className="w-px h-3 bg-border" />
            <Link href="/terms" className="hover:text-primary transition-colors duration-200 rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none min-h-[44px] inline-flex items-center touch-manipulation py-2 px-1">Terms of Service</Link>
            <span aria-hidden="true" className="w-px h-3 bg-border" />
            <Link href="/accessibility" className="hover:text-primary transition-colors duration-200 rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none min-h-[44px] inline-flex items-center touch-manipulation py-2 px-1">Accessibility</Link>
            <span aria-hidden="true" className="w-px h-3 bg-border" />
            <Link href="/site-map" className="hover:text-primary transition-colors duration-200 rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none min-h-[44px] inline-flex items-center touch-manipulation py-2 px-1">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
