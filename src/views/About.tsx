import { PageShell } from "@/components/layout/PageShell";
import { TrustBadges } from "@/components/sections/TrustBadges";
import { BUSINESS } from "@/lib/site";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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
      <div className="site-container py-16 sm:py-20 lg:py-28">
        <div className="max-w-[65ch] space-y-16">
          <div>
            <h2 className="mb-4 text-3xl font-semibold tracking-[-0.02em] text-foreground">
              Who we are
            </h2>
            <p className="text-base text-muted-foreground">
              Caraway is a Brisbane-based direct buyer operated by {BUSINESS.legalName}. We assess each vehicle from the supplied details and, when we make an offer, confirm the collection, payment, and record-keeping terms before dispatch.
            </p>
          </div>

          <div>
            <div className="border-t border-border pt-10">
              <p className="eyebrow mb-3">Founder</p>
              <h2 className="mb-5 text-3xl font-semibold tracking-[-0.02em] text-foreground">
                Meet the founder
              </h2>
              <div>
                <div className="flex-1">
                  <p className="mb-4 text-base text-muted-foreground">
                    I&apos;m <strong className="text-foreground">{BUSINESS.founder}</strong>, and I run Caraway out of Brisbane. I started this business because I was tired of watching mates get lowballed by dealers and ghosted by Gumtree buyers. If something goes sideways on your pickup, you email me directly at <a href={BUSINESS.emailHref} className="text-primary link-underline">{BUSINESS.email}</a>.
                  </p>
                  <p className="text-base text-muted-foreground">
                    Caraway is a registered Australian business name operated by {BUSINESS.legalName} as a {BUSINESS.businessStructure.toLowerCase()} (ABN {BUSINESS.abn}). Before collection, we confirm the assigned pickup operator, access plan, timing, payment arrangement, buyer details, and receipt requirements.
                  </p>
                  <p className="mt-4 text-base">
                    <TrackedOutboundLink
                      href={BUSINESS.googleBusinessUrl}
                      label="Google reviews"
                      location="about_founder"
                      className="inline-flex min-h-11 items-center text-primary link-underline"
                    >
                      View Caraway on Google
                    </TrackedOutboundLink>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-3xl font-semibold tracking-[-0.02em] text-foreground">
              How we work
            </h2>
            <p className="text-base text-muted-foreground">
              Vehicle markets and collection requirements change. We assess the individual vehicle, document the offer assumptions, confirm the collection and payment arrangements, and provide the buyer details you need for your sale record.
            </p>
          </div>

          <div>
            <div>
              <h2 className="mb-6 text-3xl font-semibold tracking-[-0.02em] text-foreground">
                What sets us apart
              </h2>
            </div>
            <div>
              <dl className="grid grid-cols-1 gap-x-10 sm:grid-cols-2">
                {features.map(item => (
                  <div key={item.title} className="border-t border-border py-5">
                    <dt className="text-base font-semibold text-foreground">{item.title}</dt>
                    <dd className="mt-1 text-base text-muted-foreground">{item.desc}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-3xl font-semibold tracking-[-0.02em] text-foreground">
              Our service area
            </h2>
            <p className="text-base text-muted-foreground">
              We assess Brisbane-area enquiries and confirm coverage for the exact address before a collection is booked. Share the suburb and access details with your quote request so availability can be checked.
            </p>
            <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
              <Link href="/#quote-form" className={cn(buttonVariants({ variant: "default" }), "w-full sm:w-auto")}>
                Get my quote
              </Link>
              <Link href="/locations" className={buttonVariants({ variant: "link" })}>
                See pickup areas
              </Link>
            </div>
          </div>
        </div>
      </div>

      <TrustBadges />
    </PageShell>
  );
}
