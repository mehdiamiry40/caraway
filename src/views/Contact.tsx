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
          Request a free, no-obligation assessment for your vehicle.
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
                <Link href="/#quote-form" className="text-primary font-medium link-underline">
                  online quote form
                </Link>
                . Our Brisbane team will confirm the quote, collection terms, timing, and payment method for each accepted job.
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
                    Call with the vehicle, location, and access details.
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
                  <p className="text-sm text-muted-foreground mt-0.5">We aim to reply within one business day.</p>
                </div>
              </a>

              {[
                {
                  icon: Building2,
                  title: "Based in",
                  main: BUSINESS.addressFormatted,
                  sub: "Confirm the vehicle location and collection plan before travelling to any address.",
                },
                {
                  icon: MapPin,
                  title: "Service area",
                  main: `Greater ${BUSINESS.location}`,
                  sub: "Confirm your suburb and access details when requesting a quote.",
                },
                {
                  icon: Clock,
                  title: "Response and collection",
                  main: "Replies within one business day",
                  sub: "Collection timing is agreed individually for each accepted job.",
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
                  { q: "What you'll need at pickup", a: "Current photo ID and the registration, finance, insurer, estate, or ownership records that apply to your sale." },
                  { q: "Payment method", a: "The payment method and timing are confirmed for each accepted job before collection." },
                  { q: "Pickup cost", a: "Included when Caraway buys and the supplied vehicle and access details match." },
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
