import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import { BUSINESS } from "@/lib/site";

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
  { label: "All Locations", href: "/locations" },
];

const companyLinks = [
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "FAQ", href: "/faq" },
  { label: "Blog", href: "/blog" },
  { label: "Get a Quote", href: "/#quote-section" },
];

const linkClasses = "text-foreground/70 hover:text-white transition-colors text-sm rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none";

export function Footer() {
  return (
    <footer className="bg-primary text-white">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14 lg:py-18">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 md:gap-8">

          <div className="lg:col-span-2">
            <Link href="/" className="font-display font-bold text-2xl tracking-tight text-white mb-4 block lowercase">
              caraway<span className="text-accent">.</span>
            </Link>
            <p className="text-white/60 max-w-sm mt-3 leading-relaxed text-sm">
              Brisbane cash for cars and pickup. We quote before we load — running, damaged, or unregistered. Call or send the form.
            </p>
            <div className="mt-6 space-y-3">
              <a href={BUSINESS.phoneHref} className="flex items-center gap-3 text-white/70 hover:text-white transition-colors group text-sm">
                <span className="flex h-9 w-9 rounded-xl bg-white/[0.08] items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <Phone className="h-4 w-4 text-accent" />
                </span>
                {BUSINESS.phone}
              </a>
              <a href={BUSINESS.emailHref} className="flex items-center gap-3 text-white/70 hover:text-white transition-colors group text-sm">
                <span className="flex h-9 w-9 rounded-xl bg-white/[0.08] items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <Mail className="h-4 w-4 text-accent" />
                </span>
                {BUSINESS.email}
              </a>
              <div className="flex items-center gap-3 text-white/60 text-sm">
                <span className="flex h-9 w-9 rounded-xl bg-white/[0.08] items-center justify-center">
                  <MapPin className="h-4 w-4 text-white/40" />
                </span>
                {BUSINESS.location}
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-display font-semibold text-sm text-white/70 mb-5">Services</h4>
            <ul className="space-y-3">
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
            <h4 className="font-display font-semibold text-sm text-white/70 mb-5">Locations</h4>
            <ul className="space-y-3">
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
            <h4 className="font-display font-semibold text-sm text-white/70 mb-5">Company</h4>
            <ul className="space-y-3">
              {companyLinks.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClasses}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/60">
          <p>&copy; {new Date().getFullYear()} Caraway. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="hover:text-white/70 transition-colors rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white/70 transition-colors rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
