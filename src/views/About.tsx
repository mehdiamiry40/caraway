import { PageShell } from "@/components/layout/PageShell";
import { InternalLinks } from "@/components/sections/InternalLinks";
import { TrustBadges } from "@/components/sections/TrustBadges";
import { BUSINESS } from "@/lib/site";
import { CheckCircle2 } from "lucide-react";

const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "About Caraway" }
];

const features = [
  { title: "Genuinely Free Towing", desc: "We never deduct towing costs from your offer. The price quoted is the price you get, every time." },
  { title: "Fast pickup", desc: "Most pickups are same- or next-day once you accept our offer — we confirm a slot when you book." },
  { title: "All Vehicles Accepted", desc: "We buy cars in any condition — running, broken, damaged, scrap, unregistered. No exclusions." },
  { title: "Cash on the Spot", desc: "You receive your cash payment before the car leaves your property. No unnecessary delays." },
  { title: "Responsible Recycling", desc: "We dispose of all vehicles through licensed Queensland recycling facilities, meeting EPA requirements." },
  { title: "No Pressure", desc: "Our quotes are free and come with zero obligation. If our offer doesn't work for you, no hard feelings." },
];

export default function About() {
  return (
    <PageShell
      breadcrumbs={breadcrumbs}
      title="About Caraway — Cash for Cars Brisbane"
      subtitle={
        <p>
          We&apos;re a locally owned Brisbane business that makes selling your car for cash simple. No auctions, no advertising, no time-wasters — just fair cash offers and same- or next-day pickup.
        </p>
      }
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="max-w-3xl space-y-14">
          <div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-4 leading-snug">Who We Are</h2>
            <p className="text-muted-foreground leading-relaxed text-base sm:text-lg mb-4">
              Caraway is a Brisbane-based buyer — we pay cash for cars we want, and we organise pickup when we agree a price. No listings, no strangers at your door for test drives.
            </p>
            <p className="text-muted-foreground leading-relaxed text-base sm:text-lg">
              We&apos;re not a faceless national franchise or an online broker who subcontracts the work. Caraway is founder-led and Brisbane-based — we know the suburbs, we answer our own phone, and we take pride in providing a genuine, personal service to every customer.
            </p>
          </div>

          <div className="rounded-2xl border border-border/60 bg-muted/40 p-5 sm:p-8">
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-4 leading-snug">Meet the Founder</h2>
            <div className="flex flex-col sm:flex-row gap-5 sm:gap-6">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary text-white font-display font-bold text-2xl" aria-hidden="true">
                ME
              </div>
              <div>
                <p className="text-muted-foreground leading-relaxed text-base sm:text-lg mb-4">
                  I&apos;m <strong className="text-foreground">{BUSINESS.founder}</strong>, and I run Caraway out of Brisbane. I started this business because I was tired of watching mates get lowballed by dealers and ghosted by Gumtree buyers. If something goes sideways on your pickup, you email me directly at <a href={BUSINESS.emailHref} className="text-primary underline font-medium">{BUSINESS.email}</a>.
                </p>
                <p className="text-muted-foreground leading-relaxed text-base sm:text-lg">
                  {BUSINESS.legalName} (ABN {BUSINESS.abn}) is a registered Australian company. All pickups are fully insured with public liability and goods-in-transit cover — if we scratch your car loading it, we wear the cost.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-4 leading-snug">How we work</h2>
            <p className="text-muted-foreground leading-relaxed text-base sm:text-lg">
              We&apos;re not going to publish vanity metrics here — vehicle markets move weekly. What we will say: we show up when we say we will, we pay what we agreed before the car leaves, and we use licensed recyclers when a car is at end of life.
            </p>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-4 leading-snug">What Sets Us Apart</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map(item => (
                <div key={item.title} className="flex gap-3 sm:gap-4 p-4 sm:p-5 rounded-lg bg-muted border border-border/60 hover:border-primary/30 hover:shadow-sm transition-all duration-200">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 shrink-0 mt-0.5">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                  </span>
                  <div>
                    <strong className="text-foreground text-sm font-bold">{item.title}</strong>
                    <p className="text-muted-foreground text-sm mt-1.5 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-4 leading-snug">Our Service Area</h2>
            <p className="text-muted-foreground leading-relaxed text-base sm:text-lg">
              We service the entire Greater Brisbane region — from Caboolture in the north to Beenleigh in the south, from Ipswich in the west to Cleveland in the east. This includes all suburbs across Brisbane City, Logan City, Ipswich City, Moreton Bay, and Redland City council areas. If you&apos;re not sure whether we cover your area, just call — we almost certainly do.
            </p>
          </div>
        </div>
      </div>

      <TrustBadges />
      <InternalLinks />
    </PageShell>
  );
}
