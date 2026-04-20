import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/sections/Breadcrumbs";
import { LocationViewTracker } from "@/components/LocationViewTracker";
import { QuoteForm } from "@/components/sections/QuoteForm";
import { ScrollToQuoteCTA } from "@/components/sections/ScrollToQuoteCTA";
import type { SuburbPage } from "@/data/suburbs";
import { suburbs } from "@/data/suburbs";
import { services, type ServicePage } from "@/data/services";
import { CheckCircle2 } from "lucide-react";
import { PROMISE_POINTS } from "@/lib/site";



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
      <LocationViewTracker suburb={suburb.slug} />
      <Header />

      <main id="main-content" className="flex-1 mt-header-safe">
        <section className="aurora-surface py-14 sm:py-20 lg:py-24">
          <div className="site-container relative">
            <Breadcrumbs items={breadcrumbs} />
            <p className="eyebrow mt-7 mb-4">Location</p>
            <h1 className="font-display font-bold text-[clamp(2.25rem,5.5vw,3.75rem)] leading-[1.05] text-foreground text-balance max-w-3xl mb-6" style={{ letterSpacing: "var(--tracking-display)" }}>
              {suburb.h1}
            </h1>
            <p className="text-muted-foreground text-[1.0625rem] sm:text-xl leading-relaxed max-w-2xl mb-9">
              {suburb.intro}
            </p>
            <ScrollToQuoteCTA />
          </div>
        </section>

        <div className="site-container py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
            <div className="lg:col-span-2 space-y-12 sm:space-y-14 max-w-none lg:max-w-4xl">
              <div>
                <h2 className="text-2xl sm:text-3xl lg:text-[2rem] font-display font-semibold text-foreground mb-4 leading-[1.15]" style={{ letterSpacing: "var(--tracking-tight)" }}>
                  Local car buying service
                </h2>
                <p className="text-muted-foreground leading-relaxed text-[1.0625rem] sm:text-lg">
                  {suburb.localContent}
                </p>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl lg:text-[2rem] font-display font-semibold text-foreground mb-4 leading-[1.15]" style={{ letterSpacing: "var(--tracking-tight)" }}>
                  What we buy in {suburb.h1.replace("Cash for Cars ", "")}
                </h2>
                <p className="text-muted-foreground leading-relaxed text-[1.0625rem] sm:text-lg">
                  {suburb.serviceDetails}
                </p>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl lg:text-[2rem] font-display font-semibold text-foreground mb-4 leading-[1.15]" style={{ letterSpacing: "var(--tracking-tight)" }}>
                  Why choose Caraway in {suburb.h1.replace("Cash for Cars ", "")}?
                </h2>
                <p className="text-muted-foreground leading-relaxed text-[1.0625rem] sm:text-lg">
                  {suburb.whyUs}
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 lg:p-10 shadow-[0_1px_2px_hsl(var(--shadow-color)/0.04)]">
                <p className="eyebrow mb-3">How it works</p>
                <h2 className="text-2xl sm:text-3xl lg:text-[2rem] font-display font-semibold text-foreground mb-3 leading-[1.15]" style={{ letterSpacing: "var(--tracking-tight)" }}>
                  Three steps to cash in hand.
                </h2>
                <p className="text-[0.9375rem] text-muted-foreground mb-8">Quote, confirm, pickup — nothing else to do.</p>
                <ol className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
                  {[
                    { step: "01", title: "Get your quote", desc: "Use the online estimator or send us your car details." },
                    { step: "02", title: "Lock the number", desc: "We confirm a firm price. Book a pickup window that suits you." },
                    { step: "03", title: "Cash on pickup", desc: "Free tow anywhere in the area. Paid before the car leaves." },
                  ].map(item => (
                    <li key={item.step}>
                      <div className="font-mono text-[0.75rem] font-semibold tabular-nums tracking-[0.12em] text-muted-foreground mb-3">
                        {item.step}
                      </div>
                      <h3 className="font-display font-semibold text-foreground mb-1.5">{item.title}</h3>
                      <p className="text-[0.9375rem] text-muted-foreground leading-relaxed">{item.desc}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <aside className="space-y-5 lg:sticky lg:top-[calc(8rem+env(safe-area-inset-top))] lg:self-start">
              <div className="bg-card border border-border rounded-2xl p-6 shadow-[0_1px_2px_hsl(var(--shadow-color)/0.04)]">
                <p className="eyebrow mb-3">Our promise</p>
                <p className="text-[0.9375rem] font-semibold text-foreground mb-5">What you get with every sale</p>
                <ul className="space-y-3">
                  {PROMISE_POINTS.map(item => (
                    <li key={item} className="flex items-start gap-3 text-[0.9375rem] text-muted-foreground">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-success/10 text-success shrink-0 mt-0.5">
                        <CheckCircle2 className="h-3 w-3" strokeWidth={2.25} />
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {relatedServiceData.length > 0 && (
                <nav aria-label="Our services" className="bg-card border border-border rounded-2xl p-6 shadow-[0_1px_2px_hsl(var(--shadow-color)/0.04)]">
                  <p className="eyebrow mb-4">Our services</p>
                  <ul className="divide-y divide-border border-t border-border">
                    {relatedServiceData.map(s => (
                      <li key={s.slug}>
                        <Link
                          href={`/${s.slug}`}
                          className="flex items-center gap-2 text-[0.9375rem] text-muted-foreground hover:text-primary transition-colors min-h-[44px] py-2.5"
                        >
                          {s.h1}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              )}

              {nearbySuburbData.length > 0 && (
                <nav aria-label="Nearby areas" className="bg-card border border-border rounded-2xl p-6 shadow-[0_1px_2px_hsl(var(--shadow-color)/0.04)]">
                  <p className="eyebrow mb-4">Nearby areas</p>
                  <ul className="divide-y divide-border border-t border-border">
                    {nearbySuburbData.map(s => (
                      <li key={s.slug}>
                        <Link
                          href={`/locations/${s.slug}`}
                          className="flex items-center gap-2 text-[0.9375rem] text-muted-foreground hover:text-primary transition-colors min-h-[44px] py-2.5"
                        >
                          {s.h1}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              )}
            </aside>
          </div>
        </div>

        <QuoteForm />
      </main>

      <Footer />
    </div>
  );
}
