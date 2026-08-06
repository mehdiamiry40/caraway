import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { StickyMobileCTA } from "@/components/layout/StickyMobileCTA";
import { Breadcrumbs } from "@/components/sections/Breadcrumbs";
import { LocationViewTracker } from "@/components/LocationViewTracker";
import { QuoteForm } from "@/components/sections/QuoteForm";
import { SellingSafelySection } from "@/components/sections/SellingSafelySection";
import { ScrollToQuoteCTA } from "@/components/sections/ScrollToQuoteCTA";
import { Accordion } from "@/components/ui/accordion";
import { buttonVariants } from "@/components/ui/button";
import type { SuburbPage } from "@/data/suburbs";
import { suburbs } from "@/data/suburbs";
import { services, type ServicePage } from "@/data/services";
import { getPostsForSuburb } from "@/data/blog-posts";
import { CheckCircle2, Phone } from "lucide-react";
import { BUSINESS, PROMISE_POINTS } from "@/lib/site";
import { TrackedPhoneLink } from "@/components/layout/TrackedPhoneLink";
import { cn } from "@/lib/utils";
import { getBodyAfterLead, getLeadSentence } from "@/lib/content-summary";

export default function SuburbPageTemplate({ suburb }: { suburb: SuburbPage }) {
  const relatedServiceData = suburb.relatedServices
    .map(slug => services.find(s => s.slug === slug))
    .filter((s): s is ServicePage => s !== undefined);

  const nearbySuburbData = suburb.nearbySuburbs
    .map(slug => suburbs.find(s => s.slug === slug))
    .filter((s): s is SuburbPage => s !== undefined);

  const relatedPosts = getPostsForSuburb(suburb.slug);
  // The hero leads with the first sentence, so the body picks up from the
  // second rather than repeating it.
  const heroIntro = getLeadSentence(suburb.intro);
  const introRest = getBodyAfterLead(suburb.intro);
  const areaName = suburb.h1.replace("Cash for Cars ", "").replace(" — Free Removal & Instant Cash", "").replace(" — Sell Your Car Today", "").replace(" — Get Paid Today", "");
  const nearbyAreaNames = suburb.nearbyAreaNames ?? nearbySuburbData.map((s) => s.h1.replace("Cash for Cars ", ""));

  // Both of these used to fall back to content the page already shows. The
  // selling-points default was a slice of PROMISE_POINTS, which the "Our
  // promise" card in the sidebar renders in full; the internalLinks default was
  // a subset of the service and nearby-suburb links rendered directly above it.
  // Only genuinely local overrides are worth the space.
  const localSellingPoints = suburb.localSellingPoints ?? [];

  const linkedHrefs = new Set([
    ...relatedServiceData.map((s) => `/${s.slug}`),
    ...nearbySuburbData.map((s) => `/locations/${s.slug}`),
  ]);
  const extraLinks = (suburb.internalLinks ?? []).filter(
    (link) => !linkedHrefs.has(link.href),
  );

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Locations", href: "/locations" },
    { label: suburb.h1 }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <LocationViewTracker suburb={suburb.slug} />
      <Header />

      <main id="main-content" tabIndex={-1} className="flex-1 mt-header-safe pb-[5.5rem] focus-visible:outline-none lg:pb-0">
        <section className="aurora-surface py-8 sm:py-11 lg:py-14">
          <div className="site-container relative">
            <Breadcrumbs items={breadcrumbs} />
            <p className="eyebrow mt-5 mb-3">Location</p>
            <h1 className="font-display font-bold text-[clamp(2rem,5vw,3.5rem)] leading-[1.06] text-primary text-balance max-w-4xl mb-4" style={{ letterSpacing: "var(--tracking-display)" }}>
              {suburb.h1}
            </h1>
            <p className="text-foreground/75 text-base sm:text-lg leading-relaxed max-w-2xl mb-7">
              {heroIntro}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center mb-4">
              <ScrollToQuoteCTA source={`location_hero_${suburb.slug}`} />
              <TrackedPhoneLink
                href={BUSINESS.phoneTel}
                location={`location_hero_${suburb.slug}`}
                ariaLabel={`Call Caraway on ${BUSINESS.phoneDisplay}`}
                className={cn(buttonVariants({ size: "lg", variant: "secondary" }), "w-full sm:w-auto")}
              >
                <Phone className="h-5 w-5" aria-hidden="true" />
                Call {BUSINESS.phoneDisplay}
              </TrackedPhoneLink>
            </div>
            <p className="text-sm text-foreground/70">
              Pickup included when we buy · Payment confirmed at pickup · Cars assessed as-is · Brisbane-based
            </p>
          </div>
        </section>

        <div className="site-container py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
            <div className="lg:col-span-2 space-y-12 sm:space-y-14 max-w-none lg:max-w-4xl">
              <div>
                <h2 className="text-2xl sm:text-3xl lg:text-[2rem] font-display text-foreground mb-4 leading-[1.15]" style={{ letterSpacing: "var(--tracking-tight)" }}>
                  Car removal in {areaName} and nearby suburbs
                </h2>
                {introRest && (
                  <p className="text-muted-foreground leading-relaxed text-base sm:text-lg">
                    {introRest}
                  </p>
                )}
                <p className="mt-5 text-muted-foreground leading-relaxed text-base sm:text-lg">
                  {suburb.localContent}
                </p>
                {nearbyAreaNames.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-sm font-display text-foreground mb-3">Nearby suburbs covered</h3>
                    <ul className="flex flex-wrap gap-2">
                      {nearbyAreaNames.map((name) => (
                        <li key={name} className="border border-border bg-secondary px-3 py-1.5 text-sm text-foreground/80">
                          {name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {localSellingPoints.length > 0 && (
                  <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {localSellingPoints.map((point) => (
                      <li key={point} className="flex gap-3 text-sm text-foreground/80">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {suburb.pickupAccessNotes && suburb.pickupAccessNotes.length > 0 && (
                <div>
                  <h2 className="text-2xl sm:text-3xl lg:text-[2rem] font-display text-foreground mb-4 leading-[1.15]" style={{ letterSpacing: "var(--tracking-tight)" }}>
                    Pickup access in {areaName}
                  </h2>
                  <ul className="space-y-3">
                    {suburb.pickupAccessNotes.map((note) => (
                      <li key={note} className="rounded-lg border border-border/60 bg-card p-4 text-muted-foreground leading-relaxed">
                        {note}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <h2 className="text-2xl sm:text-3xl lg:text-[2rem] font-display text-foreground mb-4 leading-[1.15]" style={{ letterSpacing: "var(--tracking-tight)" }}>
                  What we buy in {suburb.h1.replace("Cash for Cars ", "")}
                </h2>
                <p className="text-muted-foreground leading-relaxed text-base sm:text-lg">
                  {suburb.serviceDetails}
                </p>
              </div>

              {suburb.exampleVehiclesBought && suburb.exampleVehiclesBought.length > 0 && (
                <div>
                  <h2 className="text-2xl sm:text-3xl lg:text-[2rem] font-display text-foreground mb-4 leading-[1.15]" style={{ letterSpacing: "var(--tracking-tight)" }}>
                    Example vehicles we buy in {areaName}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {suburb.exampleVehiclesBought.map((item) => (
                      <div key={`${item.vehicle}-${item.area}`} className="rounded-lg border border-border/60 bg-card p-4">
                        <h3 className="font-display text-foreground mb-1">{item.vehicle}</h3>
                        <p className="text-sm text-muted-foreground">{item.area}</p>
                        <p className="text-sm text-foreground/80 mt-3">{item.condition}</p>
                        {item.note && <p className="text-xs text-muted-foreground mt-3">{item.note}</p>}
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mt-4">
                    Examples only — actual offers depend on condition, completeness, location, demand, and market value.
                  </p>
                </div>
              )}

              <div>
                <h2 className="text-2xl sm:text-3xl lg:text-[2rem] font-display text-foreground mb-4 leading-[1.15]" style={{ letterSpacing: "var(--tracking-tight)" }}>
                  Why choose Caraway in {suburb.h1.replace("Cash for Cars ", "")}?
                </h2>
                <p className="text-muted-foreground leading-relaxed text-base sm:text-lg">
                  {suburb.whyUs}
                </p>
              </div>

              {suburb.localFaqs && suburb.localFaqs.length > 0 && (
                <div>
                  <h2 className="text-2xl sm:text-3xl lg:text-[2rem] font-display text-foreground mb-4 leading-[1.15]" style={{ letterSpacing: "var(--tracking-tight)" }}>
                    {areaName} car removal FAQs
                  </h2>
                  <Accordion items={suburb.localFaqs} headingLevel={3} />
                </div>
              )}

              <div className="border border-border bg-card p-6 sm:p-8 lg:p-10 shadow-sm">
                <p className="eyebrow mb-3">How it works</p>
                <h2 className="text-2xl sm:text-3xl lg:text-[2rem] font-display text-foreground mb-3 leading-[1.15]" style={{ letterSpacing: "var(--tracking-tight)" }}>
                  Three steps to cash in hand.
                </h2>
                <ol className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
                  {[
                    { step: "01", title: "Get your quote", desc: "Use the online estimator or send us your car details." },
                    { step: "02", title: "Lock the number", desc: "We confirm a firm price. Book a pickup window that suits you." },
                    { step: "03", title: "Payment and pickup", desc: "Pickup is included when we buy. Payment is confirmed before the car leaves." },
                  ].map(item => (
                    <li key={item.step}>
                      <div className="font-mono text-xs font-medium tabular-nums tracking-[0.1em] text-primary mb-3">
                        {item.step}
                      </div>
                      <h3 className="font-display text-foreground mb-1.5">{item.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                    </li>
                  ))}
                </ol>
              </div>

              {suburb.finalCtaText && (
                <div>
                  <h2 className="text-2xl sm:text-3xl lg:text-[2rem] font-display text-foreground mb-4 leading-[1.15]" style={{ letterSpacing: "var(--tracking-tight)" }}>
                    Get a local pickup quote
                  </h2>
                  <p className="text-muted-foreground leading-relaxed text-base sm:text-lg mb-6">
                    {suburb.finalCtaText}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <ScrollToQuoteCTA source={`location_final_${suburb.slug}`} />
                    <TrackedPhoneLink
                      href={BUSINESS.phoneTel}
                      location={`location_final_${suburb.slug}`}
                      ariaLabel={`Call Caraway on ${BUSINESS.phoneDisplay}`}
                      className={cn(buttonVariants({ size: "lg", variant: "secondary" }), "w-full sm:w-auto")}
                    >
                      <Phone className="h-5 w-5" aria-hidden="true" />
                      Call {BUSINESS.phoneDisplay}
                    </TrackedPhoneLink>
                  </div>
                </div>
              )}
            </div>

            <aside className="space-y-5 lg:sticky lg:top-[calc(8rem+env(safe-area-inset-top))] lg:self-start">
              <div className="bg-card border border-border p-5 sm:p-6 shadow-sm">
                <h3 className="text-sm font-display mb-1 text-foreground">Our promise</h3>
                <p className="text-xs text-muted-foreground mb-5">What you get with every sale</p>
                <ul className="space-y-3.5">
                  {PROMISE_POINTS.map(item => (
                    <li key={item} className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex h-5 w-5 items-center justify-center bg-primary/10 text-primary shrink-0">
                        <CheckCircle2 className="h-3 w-3" strokeWidth={2} aria-hidden="true" />
                      </span>
                      <span className="text-foreground/80">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {relatedServiceData.length > 0 && (
                <nav aria-label="Our services" className="bg-card border border-border p-5 sm:p-6 shadow-sm">
                  <h3 className="text-sm font-display mb-4 text-foreground">Our services</h3>
                  <ul className="divide-y divide-border/60 border-t border-border/60">
                    {relatedServiceData.map(s => (
                      <li key={s.slug}>
                        <Link
                          href={`/${s.slug}`}
                          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors min-h-[44px] py-2.5"
                        >
                          {s.h1}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              )}

              {nearbySuburbData.length > 0 && (
                <nav aria-label="Nearby areas" className="bg-card border border-border p-5 sm:p-6 shadow-sm">
                  <h3 className="text-sm font-display mb-4 text-foreground">Nearby areas</h3>
                  <ul className="divide-y divide-border/60 border-t border-border/60">
                    {nearbySuburbData.map(s => (
                      <li key={s.slug}>
                        <Link
                          href={`/locations/${s.slug}`}
                          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors min-h-[44px] py-2.5"
                        >
                          {s.h1}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              )}

              {extraLinks.length > 0 && (
                <nav aria-label="More from Caraway" className="bg-card border border-border p-5 sm:p-6 shadow-sm">
                  <h3 className="text-sm font-display mb-4 text-foreground">More from Caraway</h3>
                  <ul className="divide-y divide-border/60 border-t border-border/60">
                    {extraLinks.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors min-h-[44px] py-2.5"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              )}

              {relatedPosts.length > 0 && (
                <nav aria-label="Related articles" className="bg-card border border-border p-5 sm:p-6 shadow-sm">
                  <h3 className="text-sm font-display mb-4 text-foreground">Related articles</h3>
                  <ul className="divide-y divide-border/60 border-t border-border/60">
                    {relatedPosts.map(p => (
                      <li key={p.slug}>
                        <Link
                          href={`/blog/${p.slug}`}
                          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors min-h-[44px] py-2.5"
                        >
                          {p.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              )}
            </aside>
          </div>
        </div>

        <SellingSafelySection />
        <QuoteForm />
      </main>

      <Footer />
      <StickyMobileCTA />
    </div>
  );
}
