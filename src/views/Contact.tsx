import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { BUSINESS } from "@/lib/site";
import { ContactForm } from "@/components/sections/ContactForm";
import { TrackedPhoneLink } from "@/components/layout/TrackedPhoneLink";
import { ArrowRight, Building2, Clock, Mail, MapPin, Phone } from "lucide-react";

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
      <div className="site-container py-14 sm:py-16 lg:py-20">
        {/* Four grid items rather than two columns so phones get the form
            straight after the call/email cards; lg places them side by side. */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-x-14 lg:gap-y-8">
          <div className="space-y-8 self-start lg:col-span-5 lg:row-start-1">
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

            {/* The two direct channels are whole-card links; the reference
                details below are grouped into one card so the form isn't
                pushed a full screen down on phones. */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <TrackedPhoneLink
                href={BUSINESS.phoneTel}
                location="contact_page"
                ariaLabel={`Call ${BUSINESS.phoneDisplay}`}
                className="group flex min-h-[44px] items-center gap-4 border border-border bg-card p-4 sm:p-5 hover:border-primary/50 card-lift touch-manipulation"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cta text-cta-foreground">
                  <Phone className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm text-muted-foreground">Call us</span>
                  <span className="block font-display text-lg font-semibold text-primary">{BUSINESS.phoneDisplay}</span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" aria-hidden="true" />
              </TrackedPhoneLink>

              <a
                href={BUSINESS.emailHref}
                className="group flex min-h-[44px] items-center gap-4 border border-border bg-card p-4 sm:p-5 hover:border-primary/50 card-lift touch-manipulation"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Mail className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm text-muted-foreground">Email us</span>
                  <span className="block truncate font-display text-lg font-semibold text-primary">{BUSINESS.email}</span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="self-start lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1">
            <ContactForm />
          </div>

          <div className="self-start lg:col-span-5 lg:row-start-2">
            <dl className="divide-y divide-border/70 rounded-2xl border border-border/70 bg-muted/60 px-5 sm:px-6">
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
                <div key={item.title} className="flex items-start gap-4 py-4 sm:py-5">
                  <item.icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" strokeWidth={1.75} aria-hidden="true" />
                  <div>
                    <dt className="text-sm text-muted-foreground">{item.title}</dt>
                    <dd>
                      <span className="block font-semibold text-foreground">{item.main}</span>
                      <span className="mt-0.5 block text-sm leading-relaxed text-muted-foreground">{item.sub}</span>
                    </dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>

          <div className="self-start lg:col-span-7 lg:col-start-6 lg:row-start-3">
            <div className="rounded-2xl border border-border/70 bg-card p-6 sm:p-7 shadow-card">
              <p className="eyebrow mb-3">Before you call</p>
              <h2 className="text-lg font-display text-foreground mb-5">Quick reference</h2>
              <dl className="divide-y divide-border/60 border-t border-border/60 text-sm">
                {[
                  { q: "What to have ready", a: "Your car's make, model, year, approximate kilometres, and a brief description of its condition." },
                  { q: "What you'll need at pickup", a: "Current photo ID and the registration, finance, insurer, estate, or ownership records that apply to your sale." },
                  { q: "Payment method", a: "The payment method and timing are confirmed for each accepted job before collection." },
                  { q: "Pickup cost", a: "Included when Caraway buys and the supplied vehicle and access details match." },
                ].map((item) => (
                  <div key={item.q} className="py-3.5 grid grid-cols-12 gap-x-4 gap-y-1">
                    <dt className="col-span-12 sm:col-span-5 font-semibold text-foreground">{item.q}</dt>
                    <dd className="col-span-12 sm:col-span-7 text-muted-foreground leading-relaxed">{item.a}</dd>
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
