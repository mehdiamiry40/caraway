import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { BUSINESS } from "@/lib/site";
import { ContactForm } from "@/components/sections/ContactForm";
import { TrackedPhoneLink } from "@/components/layout/TrackedPhoneLink";
import {
  ArrowRight,
  Banknote,
  Building2,
  ClipboardList,
  Clock,
  IdCard,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Truck,
} from "lucide-react";
import { IconHeading } from "@/components/templates/PagePieces";

const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "Contact Us" }
];

export default function Contact() {
  return (
    <PageShell
      icon={Phone}
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
              <IconHeading icon={MessageSquare}>Get in touch</IconHeading>
              <p className="text-foreground/75 leading-relaxed text-base">
                Fastest:{" "}
                <Link href="/#quote-form" className="text-primary font-medium link-underline">
                  the online quote form
                </Link>
                .
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
                <span className="flex h-11 w-11 shrink-0 items-center justify-center bg-cta text-cta-foreground">
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
                <span className="flex h-11 w-11 shrink-0 items-center justify-center bg-primary/10 text-primary">
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
            <dl className="divide-y divide-border/70 border border-border bg-muted/60 px-5 sm:px-6">
              {[
                {
                  icon: Building2,
                  title: "Based in",
                  main: BUSINESS.addressFormatted,
                  sub: "Collection plan confirmed before any visit.",
                },
                {
                  icon: MapPin,
                  title: "Service area",
                  main: `Greater ${BUSINESS.location}`,
                  sub: "Coverage confirmed for your address.",
                },
                {
                  icon: Clock,
                  title: "Response and collection",
                  main: "Replies within one business day",
                  sub: "Collection timing agreed per job.",
                },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-4 py-4 sm:py-5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-secondary text-primary">
                    <item.icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
                  </span>
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
            <div className="border border-border bg-card p-6 sm:p-7">
              <h2 className="text-lg font-display text-foreground mb-5">Before you call</h2>
              <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-sm">
                {[
                  { icon: ClipboardList, q: "Have ready", a: "Make, model, year, kilometres and condition." },
                  { icon: IdCard, q: "At pickup", a: "Photo ID and the ownership, registration or finance records for your sale." },
                  { icon: Banknote, q: "Payment", a: "Method and timing confirmed for each accepted job before collection." },
                  { icon: Truck, q: "Pickup cost", a: "Included when Caraway buys and the supplied vehicle and access details match." },
                ].map(({ icon: Icon, q, a }) => (
                  <div key={q} className="flex gap-3 bg-secondary p-4">
                    <Icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" strokeWidth={1.75} aria-hidden="true" />
                    <div>
                      <dt className="font-semibold text-foreground">{q}</dt>
                      <dd className="mt-0.5 text-muted-foreground leading-relaxed">{a}</dd>
                    </div>
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
