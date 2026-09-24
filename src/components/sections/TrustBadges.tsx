import Link from "next/link";
import { Building2, FileCheck2, ShieldCheck } from "lucide-react";
import { BUSINESS } from "@/lib/site";
import { TrackedOutboundLink } from "@/components/layout/TrackedOutboundLink";

const credentials = [
  { icon: ShieldCheck, label: "Pickup terms confirmed" },
  { icon: FileCheck2, label: "Buyer details provided" },
  { icon: Building2, label: `ABN ${BUSINESS.abn}` },
] as const;

/* Full-width photo panels, one per route into the business. Photos are
   decorative (empty alt); the heading inside each link names the target. */
const banners = [
  {
    label: "Get a vehicle assessment",
    description: "A human-reviewed vehicle assessment.",
    href: "/#quote-form",
    image: "/images/banners/cars-lined-up",
  },
  {
    label: "Pickup terms",
    description: "Included when Caraway buys and supplied vehicle and access details match.",
    href: "/car-removal-brisbane",
    image: "/images/hero-pickup",
  },
  {
    label: "Cash for cars Brisbane",
    description: "Running, damaged, old, or unregistered.",
    href: "/cash-for-cars-brisbane",
    image: "/images/banners/engine-bay-check",
  },
  {
    label: "Simple paperwork",
    description: "Clear guidance from quote to collection.",
    href: "/faq",
    image: "/images/banners/handover-paperwork",
  },
] as const;

export function TrustBadges() {
  return (
    <section className="bg-background" aria-labelledby="trust-heading">
      <h2 id="trust-heading" className="sr-only">
        Ways to sell with Caraway
      </h2>
      <ul className="grid gap-4 sm:gap-5">
        {banners.map((banner) => (
          <li key={banner.href}>
            <Link
              href={banner.href}
              prefetch={banner.href === "/#quote-form" ? false : undefined}
              className="group relative isolate flex min-h-[13rem] items-center overflow-hidden bg-ink-raised text-on-dark-hi focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-on-dark-hi sm:min-h-[16rem] lg:min-h-[20rem]"
            >
              <picture>
                <source srcSet={`${banner.image}.avif`} type="image/avif" />
                <img
                  src={`${banner.image}.webp`}
                  alt=""
                  width={1600}
                  height={600}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 -z-20 h-full w-full object-cover transition-transform duration-[1200ms] ease-[var(--ease-out-quint)] group-hover:scale-[1.04]"
                />
              </picture>
              <span
                aria-hidden="true"
                className="absolute inset-0 -z-10 bg-ink-raised/55 transition-colors duration-500 group-hover:bg-primary/60"
              />
              <span className="site-container block w-full">
                <span className="block font-display text-[clamp(1.75rem,3vw,2.6rem)] leading-tight transition-transform duration-300 group-hover:translate-x-2">
                  {banner.label}
                </span>
                <span className="mt-4 block max-w-xl text-sm leading-relaxed text-on-dark-hi/90 sm:text-[0.9375rem]">
                  {banner.description}
                  <span
                    aria-hidden="true"
                    className="ml-2 inline-block text-cta-bright transition-transform duration-300 group-hover:translate-x-1.5"
                  >
                    →
                  </span>
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="site-container py-8">
        <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {credentials.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground"
            >
              <Icon size={15} strokeWidth={2} className="text-accent-ink" aria-hidden="true" />
              {label}
            </li>
          ))}
        </ul>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-sm">
          <TrackedOutboundLink
            href={BUSINESS.googleBusinessUrl}
            label="View Caraway on Google"
            location="homepage_trust"
            className="inline-flex min-h-11 items-center text-primary link-underline"
          >
            View Caraway on Google
          </TrackedOutboundLink>
          <TrackedOutboundLink
            href={BUSINESS.abrUrl}
            label={`Verify ABN ${BUSINESS.abn}`}
            location="homepage_trust"
            className="inline-flex min-h-11 items-center text-primary link-underline"
          >
            Verify our ABN on the ABR
          </TrackedOutboundLink>
          <Link href="/locations" className="inline-flex min-h-11 items-center text-primary link-underline">
            Check your area
          </Link>
        </div>
      </div>
    </section>
  );
}
