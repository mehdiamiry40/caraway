import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { BUSINESS } from "@/lib/site";
import { ContactForm } from "@/components/sections/ContactForm";
import { TrackedPhoneLink } from "@/components/layout/TrackedPhoneLink";
import { Building2, Clock, Mail, MapPin, Phone } from "lucide-react";

const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "Contact Us" }
];

export default function Contact() {
  return (
    <PageShell
      breadcrumbs={breadcrumbs}
      eyebrow="Contact"
      title="Talk to a real Brisbane buyer."
      subtitle={
        <p>
          Ready to sell your car for cash? Get in touch for a free, no-obligation quote. We&apos;re available 7 days a week across Greater Brisbane.
        </p>
      }
    >
      <div className="site-container py-14 sm:py-20 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 lg:gap-14">
          <div className="space-y-10">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-[2rem] font-display text-foreground mb-4 leading-[1.15]" style={{ letterSpacing: "var(--tracking-tight)" }}>Get in touch</h2>
              <p className="text-muted-foreground leading-relaxed text-base sm:text-lg">
                The fastest way to get a cash offer is the{" "}
                <Link href="/#price-estimator" className="text-primary font-medium link-underline">
                  online estimator
                </Link>
                . Our Brisbane team will follow up with a confirmed quote and arrange same- or next-day pickup in most areas.
              </p>
            </div>

            <div className="space-y-4">
              <TrackedPhoneLink
                href={BUSINESS.phoneTel}
                location="contact_page"
                ariaLabel={`Call ${BUSINESS.phoneDisplay}`}
                className="group flex items-start gap-4 rounded-md border border-border/60 bg-card p-5 sm:p-6 shadow-[0_1px_2px_hsl(var(--shadow-color)/0.04)] transition-[transform,box-shadow,border-color] duration-300 ease-[var(--ease-out-quint)] hover:-translate-y-0.5 hover:border-border hover:shadow-[0_1px_2px_hsl(var(--shadow-color)/0.04),0_8px_16px_hsl(var(--shadow-color)/0.06)] min-h-[44px] touch-manipulation"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0 transition-colors group-hover:bg-primary/15">
                  <Phone className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
                </span>
                <span>
                  <span className="block font-display text-sm text-foreground">Phone</span>
                  <span className="block text-base font-medium text-primary">{BUSINESS.phoneDisplay}</span>
                  <span className="mt-0.5 block text-sm text-muted-foreground">
                    {BUSINESS.hours}, seven days. The quickest way to reach a buyer.
                  </span>
                </span>
              </TrackedPhoneLink>

              <a href={BUSINESS.emailHref} className="group flex items-start gap-4 rounded-md border border-border/60 bg-card p-5 sm:p-6 shadow-[0_1px_2px_hsl(var(--shadow-color)/0.04)] transition-[transform,box-shadow,border-color] duration-300 ease-[var(--ease-out-quint)] hover:-translate-y-0.5 hover:border-border hover:shadow-[0_1px_2px_hsl(var(--shadow-color)/0.04),0_8px_16px_hsl(var(--shadow-color)/0.06)] min-h-[44px] touch-manipulation">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0 transition-colors group-hover:bg-primary/15">
                  <Mail className="h-5 w-5" strokeWidth={1.5} />
                </span>
                <div>
                  <h3 className="font-display text-sm text-foreground">Email</h3>
                  <p className="text-base font-medium text-primary">{BUSINESS.email}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">We respond within 1 hour during business hours.</p>
                </div>
              </a>

              {[
                {
                  icon: Building2,
                  title: "Based in",
                  main: BUSINESS.addressFormatted,
                  sub: "We don't operate a public yard — pickups are always at your location with free towing.",
                },
                {
                  icon: MapPin,
                  title: "Service area",
                  main: `All of Greater ${BUSINESS.location}`,
                  sub: BUSINESS.locationDetail,
                },
                {
                  icon: Clock,
                  title: "Operating hours",
                  main: BUSINESS.hours,
                  sub: BUSINESS.hoursDetail,
                },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-4 rounded-md border border-border/60 bg-card p-5 sm:p-6 shadow-[0_1px_2px_hsl(var(--shadow-color)/0.04)]">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-muted-foreground shrink-0">
                    <item.icon className="h-5 w-5" strokeWidth={1.5} />
                  </span>
                  <div>
                    <h3 className="font-display text-sm text-foreground">{item.title}</h3>
                    <p className="text-foreground/85 text-[0.9375rem]">{item.main}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <ContactForm />

            <div className="rounded-md border border-border/60 bg-card p-6 sm:p-7 shadow-[0_1px_2px_hsl(var(--shadow-color)/0.04)]">
              <p className="eyebrow mb-3">Before you call</p>
              <h2 className="text-lg font-display text-foreground mb-5">Quick reference</h2>
              <dl className="divide-y divide-border/60 border-t border-border/60 text-sm">
                {[
                  { q: "What to have ready", a: "Your car's make, model, year, approximate kilometres, and a brief description of its condition." },
                  { q: "What you'll need at pickup", a: "Photo ID (driver's licence). Registration papers if available, but not essential." },
                  { q: "Payment method", a: "Cash on the spot. Paid before the car leaves your property." },
                  { q: "Towing cost", a: "Free. Always. No exceptions." },
                ].map((item) => (
                  <div key={item.q} className="py-3.5 grid grid-cols-12 gap-4">
                    <dt className="col-span-12 sm:col-span-5 font-display text-foreground">{item.q}</dt>
                    <dd className="col-span-12 sm:col-span-7 text-muted-foreground">{item.a}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
