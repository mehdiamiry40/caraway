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
        <section className="border-b border-border py-12 sm:py-16 lg:py-24">
          <div className="site-container">
            <Breadcrumbs items={breadcrumbs} />
            <p className="eyebrow mt-8 mb-4">Location</p>
            <h1 className="mb-5 max-w-4xl text-4xl font-semibold leading-[1.05] tracking-[-0.02em] text-foreground text-balance sm:text-5xl">
              {suburb.h1}
            </h1>
            <p className="mb-8 max-w-[40rem] text-lg text-muted-foreground">
              {heroIntro}
            </p>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
              <ScrollToQuoteCTA source={`location_hero_${suburb.slug}`} />
              <TrackedPhoneLink
                href={BUSINESS.phoneTel}
                location={`location_hero_${suburb.slug}`}
                ariaLabel={`Call Caraway on ${BUSINESS.phoneDisplay}`}
                className={cn(buttonVariants({ variant: "link" }), "tabular-nums")}
              >
                Call {BUSINESS.phoneDisplay}
              </TrackedPhoneLink>
            </div>
          </div>
        </section>

        <div className="site-container py-16 sm:py-20 lg:py-28">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
            <div className="max-w-[65ch] space-y-16 lg:col-span-8">
              <div>
                <h2 className="mb-4 text-2xl font-semibold tracking-[-0.02em] text-foreground">
                  Car removal in {areaName} and nearby suburbs
                </h2>
                {introRest && (
                  <p className="text-base text-muted-foreground">
                    {introRest}
                  </p>
                )}
                <p className="mt-5 text-base text-muted-foreground">
                  {suburb.localContent}
                </p>
                {nearbyAreaNames.length > 0 && (
                  <div className="mt-6">
                    <h3 className="mb-2 text-sm font-semibold text-foreground">Nearby suburbs covered</h3>
                    <ul className="columns-2 gap-x-8 text-sm text-muted-foreground sm:columns-3">
                      {nearbyAreaNames.map((name) => (
                        <li key={name} className="py-1">
                          {name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {localSellingPoints.length > 0 && (
                  <ul className="mt-6 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
                    {localSellingPoints.map((point) => (
                      <li key={point} className="border-t border-border pt-3 text-sm text-muted-foreground">
                        {point}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {suburb.pickupAccessNotes && suburb.pickupAccessNotes.length > 0 && (
                <div>
                  <h2 className="mb-4 text-2xl font-semibold tracking-[-0.02em] text-foreground">
                    Pickup access in {areaName}
                  </h2>
                  <ul className="border-t border-border">
                    {suburb.pickupAccessNotes.map((note) => (
                      <li key={note} className="border-b border-border py-4 text-base text-muted-foreground">
                        {note}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <h2 className="mb-4 text-2xl font-semibold tracking-[-0.02em] text-foreground">
                  What we buy in {suburb.h1.replace("Cash for Cars ", "")}
                </h2>
                <p className="text-base text-muted-foreground">
                  {suburb.serviceDetails}
                </p>
              </div>

              <div>
                <h2 className="mb-4 text-2xl font-semibold tracking-[-0.02em] text-foreground">
                  Why choose Caraway in {suburb.h1.replace("Cash for Cars ", "")}?
                </h2>
                <p className="text-base text-muted-foreground">
                  {suburb.whyUs}
                </p>
              </div>

              {suburb.localFaqs && suburb.localFaqs.length > 0 && (
                <div>
                  <h2 className="mb-4 text-2xl font-semibold tracking-[-0.02em] text-foreground">
                    {areaName} car removal FAQs
                  </h2>
                  <Accordion items={suburb.localFaqs} headingLevel={3} />
                </div>
              )}

              <div>
                <p className="eyebrow mb-3">How it works</p>
                <h2 className="mb-6 text-2xl font-semibold tracking-[-0.02em] text-foreground">
                  Three steps to cash in hand.
                </h2>
                <ol className="border-t border-border">
                  {[
                    { step: "01", title: "Get your quote", desc: "Send us your car details through the quote form." },
                    { step: "02", title: "Lock the number", desc: "We confirm a firm price. Book a pickup window that suits you." },
                    { step: "03", title: "Payment and pickup", desc: "Pickup is included. You're paid before the car leaves." },
                  ].map(item => (
                    <li key={item.step} className="grid grid-cols-[3rem_1fr] gap-x-4 border-b border-border py-5">
                      <span className="text-sm text-muted-foreground tabular-nums">{item.step}</span>
                      <div>
                        <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
                        <p className="mt-1 text-base text-muted-foreground">{item.desc}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              {suburb.finalCtaText && (
                <div>
                  <h2 className="mb-4 text-2xl font-semibold tracking-[-0.02em] text-foreground">
                    Get a local pickup quote
                  </h2>
                  <p className="mb-6 text-base text-muted-foreground">
                    {suburb.finalCtaText}
                  </p>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
                    <ScrollToQuoteCTA source={`location_final_${suburb.slug}`} />
                    <TrackedPhoneLink
                      href={BUSINESS.phoneTel}
                      location={`location_final_${suburb.slug}`}
                      ariaLabel={`Call Caraway on ${BUSINESS.phoneDisplay}`}
                      className={cn(buttonVariants({ variant: "link" }), "tabular-nums")}
                    >
                      Call {BUSINESS.phoneDisplay}
                    </TrackedPhoneLink>
                  </div>
                </div>
              )}
            </div>

            <aside className="space-y-10 lg:col-span-4 lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:self-start">
              <div>
                <h3 className="eyebrow mb-3">Our promise</h3>
                <ul className="border-t border-border">
                  {PROMISE_POINTS.map(item => (
                    <li key={item} className="border-b border-border py-2.5 text-sm text-foreground">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {relatedServiceData.length > 0 && (
                <nav aria-label="Our services">
                  <h3 className="eyebrow mb-3">Our services</h3>
                  <ul className="divide-y divide-border border-y border-border">
                    {relatedServiceData.map(s => (
                      <li key={s.slug}>
                        <Link
                          href={`/${s.slug}`}
                          className="flex min-h-11 items-center py-2.5 text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground"
                        >
                          {s.h1}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              )}

              {nearbySuburbData.length > 0 && (
                <nav aria-label="Nearby areas">
                  <h3 className="eyebrow mb-3">Nearby areas</h3>
                  <ul className="divide-y divide-border border-y border-border">
                    {nearbySuburbData.map(s => (
                      <li key={s.slug}>
                        <Link
                          href={`/locations/${s.slug}`}
                          className="flex min-h-11 items-center py-2.5 text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground"
                        >
                          {s.h1}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              )}

              {extraLinks.length > 0 && (
                <nav aria-label="More from Caraway">
                  <h3 className="eyebrow mb-3">More from Caraway</h3>
                  <ul className="divide-y divide-border border-y border-border">
                    {extraLinks.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="flex min-h-11 items-center py-2.5 text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              )}

              {relatedPosts.length > 0 && (
                <nav aria-label="Related articles">
                  <h3 className="eyebrow mb-3">Related articles</h3>
                  <ul className="divide-y divide-border border-y border-border">
                    {relatedPosts.map(p => (
                      <li key={p.slug}>
                        <Link
                          href={`/blog/${p.slug}`}
                          className="flex min-h-11 items-center py-2.5 text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground"
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
