import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import dynamic from "next/dynamic";
import { Breadcrumbs } from "@/components/sections/Breadcrumbs";
import { InternalLinks } from "@/components/sections/InternalLinks";

const QuoteForm = dynamic(() => import("@/components/sections/QuoteForm").then((mod) => mod.QuoteForm));
import { ScrollToQuoteCTA } from "@/components/sections/ScrollToQuoteCTA";
import type { SuburbPage } from "@/data/suburbs";
import { suburbs } from "@/data/suburbs";
import { services, type ServicePage } from "@/data/services";
import { CheckCircle2, MapPin } from "lucide-react";
import { BUSINESS } from "@/lib/site";

export default function SuburbPageTemplate({ suburb }: { suburb: SuburbPage }) {
  const relatedServiceData = suburb.relatedServices
    .map(slug => services.find(s => s.slug === slug))
    .filter((s): s is ServicePage => s !== undefined);

  const nearbySuburbData = suburb.nearbySuburbs
    .map(slug => suburbs.find(s => s.slug === slug))
    .filter((s): s is SuburbPage => s !== undefined);

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Locations", href: "/locations" },
    { label: suburb.h1 }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main id="main-content" className="flex-1 mt-14 lg:mt-[104px]">
        <section className="bg-gradient-to-br from-primary via-primary to-primary/90 text-white py-16 lg:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent/[0.08] via-transparent to-transparent pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <Breadcrumbs items={breadcrumbs} light />
            <div className="flex items-center gap-3 mt-6 mb-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20">
                <MapPin className="h-4 w-4 text-accent" />
              </span>
              <span className="text-accent font-semibold text-sm uppercase tracking-wider">Local Service</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-[1.1] mb-6">
              {suburb.h1}
            </h1>
            <p className="text-white/75 text-lg sm:text-xl leading-relaxed max-w-3xl mb-10">
              {suburb.intro}
            </p>
            <ScrollToQuoteCTA />
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
            <div className="lg:col-span-2 space-y-12">
              <div>
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-4 leading-snug">
                  Local Car Buying Service
                </h2>
                <div className="w-12 h-1 bg-accent/60 rounded-full mb-5" />
                <p className="text-muted-foreground leading-relaxed text-base sm:text-lg">
                  {suburb.localContent}
                </p>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-4 leading-snug">
                  What We Buy in {suburb.h1.replace("Cash for Cars ", "")}
                </h2>
                <div className="w-12 h-1 bg-accent/60 rounded-full mb-5" />
                <p className="text-muted-foreground leading-relaxed text-base sm:text-lg">
                  {suburb.serviceDetails}
                </p>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-4 leading-snug">
                  Why Choose Caraway in {suburb.h1.replace("Cash for Cars ", "")}?
                </h2>
                <div className="w-12 h-1 bg-accent/60 rounded-full mb-5" />
                <p className="text-muted-foreground leading-relaxed text-base sm:text-lg">
                  {suburb.whyUs}
                </p>
              </div>

              <div className="bg-gradient-to-b from-primary/[0.06] to-primary/[0.02] border border-primary/10 rounded-2xl p-8 sm:p-10">
                <h2 className="text-xl sm:text-2xl font-display font-bold text-foreground mb-2">
                  How It Works
                </h2>
                <p className="text-sm text-muted-foreground mb-8">Three simple steps to get cash for your car.</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                  {[
                    { step: "1", title: "Get Your Quote", desc: `Call ${BUSINESS.phone} or fill out our form with your car details.` },
                    { step: "2", title: "Accept Your Offer", desc: "We'll make a fair cash offer. No obligation if you decline." },
                    { step: "3", title: "Get Paid Today", desc: "We pick up your car free and pay you cash on the spot." }
                  ].map(item => (
                    <div key={item.step} className="text-center">
                      <div className="w-12 h-12 bg-accent text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4 shadow-md shadow-accent/20">
                        {item.step}
                      </div>
                      <h3 className="font-display font-bold text-foreground mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <aside className="space-y-6 lg:sticky lg:top-32 lg:self-start">
              <div className="bg-gradient-to-b from-primary/[0.07] to-primary/[0.02] border border-primary/10 rounded-2xl p-6">
                <h3 className="font-display font-bold text-lg mb-1">Our Promise</h3>
                <p className="text-xs text-muted-foreground mb-5">What you get with every sale</p>
                <ul className="space-y-3.5">
                  {["Up to $9,999 cash", "Same-day pickup", "Free towing always", "No RWC needed", "All makes & models", "7 days a week"].map(item => (
                    <li key={item} className="flex items-center gap-3 text-sm text-foreground/80">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/10">
                        <CheckCircle2 className="h-3.5 w-3.5 text-accent shrink-0" />
                      </span>
                      <span className="font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gradient-to-b from-accent/10 to-accent/[0.03] border border-accent/15 rounded-2xl p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-3">
                  <span className="text-accent text-xl" aria-hidden="true">&#9742;</span>
                </div>
                <h3 className="font-display font-bold text-lg mb-1">Call for an Instant Quote</h3>
                <p className="text-sm text-muted-foreground mb-5">Speak to our Brisbane team now</p>
                <a
                  href={BUSINESS.phoneHref}
                  className="flex items-center justify-center gap-2 bg-accent text-white rounded-full py-3.5 px-6 font-semibold hover:bg-accent/90 shadow-md shadow-accent/20 hover:shadow-lg hover:shadow-accent/25 transition-all"
                >
                  {BUSINESS.phone}
                </a>
              </div>

              {relatedServiceData.length > 0 && (
                <div className="border border-border/60 rounded-2xl p-6 bg-white">
                  <h3 className="font-display font-bold text-lg mb-4">Our Services</h3>
                  <ul className="space-y-1">
                    {relatedServiceData.map(s => (
                      <li key={s.slug}>
                        <Link
                          href={`/${s.slug}`}
                          className="flex items-center gap-2 text-sm text-primary hover:text-accent transition-colors py-1.5 px-2 -mx-2 rounded-lg hover:bg-muted/50"
                        >
                          <span className="w-1 h-1 rounded-full bg-accent/50 shrink-0" />
                          {s.h1}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {nearbySuburbData.length > 0 && (
                <div className="border border-border/60 rounded-2xl p-6 bg-white">
                  <h3 className="font-display font-bold text-lg mb-4">Nearby Areas</h3>
                  <ul className="space-y-1">
                    {nearbySuburbData.map(s => (
                      <li key={s.slug}>
                        <Link
                          href={`/locations/${s.slug}`}
                          className="flex items-center gap-2 text-sm text-primary hover:text-accent transition-colors py-1.5 px-2 -mx-2 rounded-lg hover:bg-muted/50"
                        >
                          <span className="w-1 h-1 rounded-full bg-accent/50 shrink-0" />
                          {s.h1}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </aside>
          </div>
        </div>

        <QuoteForm />
        <InternalLinks currentSlug={suburb.slug} />
      </main>

      <Footer />
    </div>
  );
}
