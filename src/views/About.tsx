import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/sections/Breadcrumbs";
import { InternalLinks } from "@/components/sections/InternalLinks";
import { CheckCircle2 } from "lucide-react";

const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "About Caraway" }
];

const features = [
  { title: "Genuinely Free Towing", desc: "We never deduct towing costs from your offer. The price quoted is the price you get, every time." },
  { title: "Same-Day Service", desc: "Most vehicles are collected the same day you accept our offer. We don't make you wait." },
  { title: "All Vehicles Accepted", desc: "We buy cars in any condition — running, broken, damaged, scrap, unregistered. No exclusions." },
  { title: "Cash on the Spot", desc: "You receive your cash payment before the car leaves your property. No bank transfers, no delays." },
  { title: "Responsible Recycling", desc: "We dispose of all vehicles through licensed Queensland recycling facilities, meeting EPA requirements." },
  { title: "No Pressure", desc: "Our quotes are free and come with zero obligation. If our offer doesn't work for you, no hard feelings." },
];

export default function About() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main id="main-content" className="flex-1 mt-14 lg:mt-[104px]">
        <section className="bg-gradient-to-br from-primary via-primary to-primary/90 text-white py-16 lg:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent/[0.08] via-transparent to-transparent pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <Breadcrumbs items={breadcrumbs} light />
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-[1.1] mt-6 mb-6">
              About Caraway
            </h1>
            <p className="text-white/75 text-lg sm:text-xl leading-relaxed max-w-3xl">
              We&apos;re a locally owned Brisbane business that makes selling your car simple. No auctions, no advertising, no time-wasters — just fair cash offers and same-day service.
            </p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-3xl space-y-14">
            <div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-4 leading-snug">Who We Are</h2>
              <div className="w-12 h-1 bg-accent/60 rounded-full mb-5" />
              <p className="text-muted-foreground leading-relaxed text-base sm:text-lg mb-4">
                Caraway is a Brisbane-based buyer — we pay cash for cars we want, and we organise pickup when we agree a price. No listings, no strangers at your door for test drives.
              </p>
              <p className="text-muted-foreground leading-relaxed text-base sm:text-lg">
                We&apos;re not a faceless national franchise or an online broker who subcontracts the work. We&apos;re a local team who lives and works in Brisbane, knows the suburbs, and takes pride in providing a genuine, personal service to every customer.
              </p>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-4 leading-snug">How we work</h2>
              <div className="w-12 h-1 bg-accent/60 rounded-full mb-5" />
              <p className="text-muted-foreground leading-relaxed text-base sm:text-lg">
                We&apos;re not going to publish vanity metrics here — vehicle markets move weekly. What we will say: we show up when we say we will, we pay what we agreed before the car leaves, and we use licensed recyclers when a car is at end of life.
              </p>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-4 leading-snug">What Sets Us Apart</h2>
              <div className="w-12 h-1 bg-accent/60 rounded-full mb-6" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {features.map(item => (
                  <div key={item.title} className="flex gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-muted/60 to-muted/30 border border-border/40 hover:border-border/60 hover:shadow-sm transition-all duration-200">
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
              <div className="w-12 h-1 bg-accent/60 rounded-full mb-5" />
              <p className="text-muted-foreground leading-relaxed text-base sm:text-lg">
                We service the entire Greater Brisbane region — from Caboolture in the north to Beenleigh in the south, from Ipswich in the west to Cleveland in the east. This includes all suburbs across Brisbane City, Logan City, Ipswich City, Moreton Bay, and Redland City council areas. If you&apos;re not sure whether we cover your area, just call — we almost certainly do.
              </p>
            </div>
          </div>
        </div>

        <InternalLinks />
      </main>

      <Footer />
    </div>
  );
}
