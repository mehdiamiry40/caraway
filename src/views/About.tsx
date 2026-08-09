import { PageShell } from "@/components/layout/PageShell";
import { TrustBadges } from "@/components/sections/TrustBadges";
import { BUSINESS } from "@/lib/site";
import { CheckCircle2, Star } from "lucide-react";
import { TrackedOutboundLink } from "@/components/layout/TrackedOutboundLink";

const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "About Caraway" }
];

const features = [
  { title: "Pickup included when we buy", desc: "The agreed offer includes collection when the vehicle, location, and access match the supplied details." },
  { title: "Collection window confirmed", desc: "Timing depends on the vehicle, location, access, and operator availability and is agreed before dispatch." },
  { title: "Vehicles assessed individually", desc: "Running, non-running, damaged, scrap, and unregistered vehicles can be assessed, but not every vehicle will receive an offer." },
  { title: "Payment terms confirmed", desc: "The payment method and timing are agreed before collection, and you keep a record of the transaction." },
  { title: "Buyer details and receipt", desc: "The collection plan includes the assigned operator, buyer details, and the records to retain." },
  { title: "No pressure", desc: "Quotes are free and zero-obligation. If our offer doesn't work for you, no hard feelings." },
];

export default function About() {
  return (
    <PageShell
      breadcrumbs={breadcrumbs}
      eyebrow="About"
      title="A Brisbane buyer — not a broker."
      subtitle={
        <p>
          We&apos;re a locally owned Brisbane vehicle buyer. Request an individual offer, check the written pickup and payment terms, and decide whether the direct-buyer option suits you.
        </p>
      }
    >
      <div className="site-container py-14 sm:py-20 lg:py-24">
        <div className="max-w-3xl space-y-14 sm:space-y-16">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-[2rem] font-display text-foreground mb-4 leading-[1.15]" style={{ letterSpacing: "var(--tracking-tight)" }}>
              Who we are
            </h2>
            <p className="text-muted-foreground leading-relaxed text-base sm:text-lg">
              Caraway is a Brisbane-based direct buyer operated by {BUSINESS.legalName}. We assess each vehicle from the supplied details and, when we make an offer, confirm the collection, payment, and record-keeping terms before dispatch.
            </p>
          </div>

          <div>
            <div className="rounded-md border border-border/60 bg-card p-6 sm:p-8 shadow-card">
              <p className="eyebrow mb-3">Founder</p>
              <h2 className="text-2xl sm:text-3xl font-display text-foreground mb-5 leading-[1.15]" style={{ letterSpacing: "var(--tracking-tight)" }}>
                Meet the founder
              </h2>
              <div className="flex flex-col sm:flex-row gap-5 sm:gap-6">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-display text-xl" aria-hidden="true">
                  ME
                </div>
                <div className="flex-1">
                  <p className="text-muted-foreground leading-relaxed text-base sm:text-lg mb-4">
                    I&apos;m <strong className="text-foreground">{BUSINESS.founder}</strong>, and I run Caraway out of Brisbane. I started this business because I was tired of watching mates get lowballed by dealers and ghosted by Gumtree buyers. If something goes sideways on your pickup, you email me directly at <a href={BUSINESS.emailHref} className="text-primary font-medium link-underline">{BUSINESS.email}</a>.
                  </p>
                  <p className="text-muted-foreground leading-relaxed text-base sm:text-lg">
                    Caraway is a registered Australian business name operated by {BUSINESS.legalName} as a {BUSINESS.businessStructure.toLowerCase()} (ABN {BUSINESS.abn}). Before collection, we confirm the assigned pickup operator, access plan, timing, payment arrangement, buyer details, and receipt requirements.
                  </p>
                  <p className="mt-4 text-base sm:text-lg">
                    <TrackedOutboundLink
                      href={BUSINESS.googleBusinessUrl}
                      label="Google reviews"
                      location="about_founder"
                      className="inline-flex min-h-11 items-center gap-2 text-primary font-medium link-underline"
                    >
                      <Star className="h-4 w-4" aria-hidden="true" />
                      View Caraway on Google
                    </TrackedOutboundLink>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-[2rem] font-display text-foreground mb-4 leading-[1.15]" style={{ letterSpacing: "var(--tracking-tight)" }}>
              How we work
            </h2>
            <p className="text-muted-foreground leading-relaxed text-base sm:text-lg">
              Vehicle markets and collection requirements change. We assess the individual vehicle, document the offer assumptions, confirm the collection and payment arrangements, and provide the buyer details you need for your sale record.
            </p>
          </div>

          <div>
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-[2rem] font-display text-foreground mb-6 leading-[1.15]" style={{ letterSpacing: "var(--tracking-tight)" }}>
                What sets us apart
              </h2>
            </div>
            <div>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                {features.map(item => (
                  <div key={item.title}>
                    <div className="group flex gap-3 rounded-md border border-border/60 bg-card p-5 sm:p-6 transition-[transform,box-shadow,border-color] duration-300 ease-[var(--ease-out-quint)] hover:-translate-y-0.5 hover:border-border hover:shadow-[0_1px_2px_hsl(var(--shadow-color)/0.04),0_4px_8px_hsl(var(--shadow-color)/0.06)]">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0 mt-0.5">
                        <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
                      </span>
                      <div>
                        <dt className="font-display text-sm text-foreground">{item.title}</dt>
                        <dd className="text-muted-foreground text-sm mt-1 leading-relaxed">{item.desc}</dd>
                      </div>
                    </div>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-[2rem] font-display text-foreground mb-4 leading-[1.15]" style={{ letterSpacing: "var(--tracking-tight)" }}>
              Our service area
            </h2>
            <p className="text-muted-foreground leading-relaxed text-base sm:text-lg">
              We assess Brisbane-area enquiries and confirm coverage for the exact address before a collection is booked. Share the suburb and access details with your quote request so availability can be checked.
            </p>
          </div>
        </div>
      </div>

      <TrustBadges />
    </PageShell>
  );
}
