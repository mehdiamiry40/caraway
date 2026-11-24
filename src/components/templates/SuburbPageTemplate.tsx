import Image from "next/image";
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
import { Phone } from "lucide-react";
import { BUSINESS } from "@/lib/site";
import { TrackedPhoneLink } from "@/components/layout/TrackedPhoneLink";
import { cn } from "@/lib/utils";
import { getBodyAfterLead, getLeadSentence } from "@/lib/content-summary";
import {
  HeroPoints,
  NumberedSteps,
  PromiseList,
  SectionHeading,
  SidebarLinks,
} from "@/components/templates/PagePieces";

const STEPS = [
  { title: "Get your quote", description: "Send your car details." },
  { title: "Agree on the price", description: "Firm price, pickup time booked." },
  { title: "Payment and pickup", description: "Payment confirmed before the car leaves." },
] as const;

const bodyTextClass = "max-w-[72ch] text-[1.0625rem] leading-[1.7] text-foreground";

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

      <main id="main-content" tabIndex={-1} className="flex-1 pb-[5.5rem] focus-visible:outline-none lg:pb-0">
        <section className="on-band page-band section-y-hero" data-sticky-cta-suppress="true">
          <div className="site-container grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <Breadcrumbs items={breadcrumbs} light />
              <h1 className="type-h1 mt-5 text-on-dark-hi">
                {suburb.h1}
              </h1>
              <p className="type-lead mt-4 max-w-2xl text-on-dark-hi">
                {heroIntro}
              </p>
              <HeroPoints className="mt-6" />
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                <ScrollToQuoteCTA source={`location_hero_${suburb.slug}`} />
                <TrackedPhoneLink
                  href={BUSINESS.phoneTel}
                  location={`location_hero_${suburb.slug}`}
                  ariaLabel={`Call Caraway on ${BUSINESS.phoneDisplay}`}
                  className={cn(buttonVariants({ size: "lg", variant: "outlineOnDark" }), "w-full ring-offset-primary sm:w-auto")}
                >
                  <Phone className="h-5 w-5" aria-hidden="true" />
                  Call {BUSINESS.phoneDisplay}
                </TrackedPhoneLink>
              </div>
            </div>
            <div className="hidden lg:col-span-5 lg:block">
              <Image
                src="/images/tow-truck-hero.webp"
                alt="Tilt-tray truck carrying a silver sedan"
                width={800}
                height={800}
                sizes="(min-width: 1280px) 500px, 40vw"
                loading="eager"
                className="aspect-[4/3] h-auto w-full rounded-md border-4 border-on-dark-hi object-cover object-[30%_60%]"
              />
            </div>
          </div>
        </section>

        <div className="site-container py-12 lg:py-16">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-12">
            <div className="space-y-10 lg:col-span-8">
              <div>
                <SectionHeading>
                  Car removal in {areaName} and nearby suburbs
                </SectionHeading>
                {introRest && (
                  <p className={bodyTextClass}>
                    {introRest}
                  </p>
                )}
                <p className={cn(bodyTextClass, "mt-4")}>
                  {suburb.localContent}
                </p>
                {nearbyAreaNames.length > 0 && (
                  <div className="mt-7">
                    <h3 className="text-xl font-bold text-accent-ink">Nearby suburbs covered</h3>
                    <ul className="list-ticks mt-3 grid grid-cols-2 gap-x-8 gap-y-3 !space-y-0 text-[1.0625rem] text-foreground sm:grid-cols-3">
                      {nearbyAreaNames.map((name) => (
                        <li key={name}>{name}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {localSellingPoints.length > 0 && (
                  <ul className="list-ticks mt-7 grid grid-cols-1 gap-x-10 gap-y-4 !space-y-0 text-[1.0625rem] text-foreground sm:grid-cols-2">
                    {localSellingPoints.map((point) => (
                      <li key={point}>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {suburb.pickupAccessNotes && suburb.pickupAccessNotes.length > 0 && (
                <div>
                  <SectionHeading>
                    Pickup access in {areaName}
                  </SectionHeading>
                  <ul className="list-ticks max-w-[72ch] space-y-4 text-[1.0625rem] text-foreground">
                    {suburb.pickupAccessNotes.map((note) => (
                      <li key={note}>
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <SectionHeading>
                  What we buy in {suburb.h1.replace("Cash for Cars ", "")}
                </SectionHeading>
                <p className={bodyTextClass}>
                  {suburb.serviceDetails}
                </p>
              </div>

              <div>
                <SectionHeading>
                  Why choose Caraway in {suburb.h1.replace("Cash for Cars ", "")}?
                </SectionHeading>
                <p className={bodyTextClass}>
                  {suburb.whyUs}
                </p>
              </div>

              {suburb.localFaqs && suburb.localFaqs.length > 0 && (
                <div>
                  <SectionHeading>
                    {areaName} car removal FAQs
                  </SectionHeading>
                  <Accordion items={suburb.localFaqs} headingLevel={3} />
                </div>
              )}

              <div>
                <SectionHeading className="mb-6">
                  Three steps to sell your car.
                </SectionHeading>
                <NumberedSteps steps={STEPS} />
              </div>

              {suburb.finalCtaText && (
                <div>
                  <SectionHeading>
                    Get a local pickup quote
                  </SectionHeading>
                  <p className={bodyTextClass}>
                    {suburb.finalCtaText}
                  </p>
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <ScrollToQuoteCTA source={`location_final_${suburb.slug}`} />
                    <TrackedPhoneLink
                      href={BUSINESS.phoneTel}
                      location={`location_final_${suburb.slug}`}
                      ariaLabel={`Call Caraway on ${BUSINESS.phoneDisplay}`}
                      className={cn(buttonVariants({ size: "lg", variant: "outline" }), "w-full sm:w-auto")}
                    >
                      <Phone className="h-5 w-5" aria-hidden="true" />
                      Call {BUSINESS.phoneDisplay}
                    </TrackedPhoneLink>
                  </div>
                </div>
              )}
            </div>

            <aside className="space-y-5 lg:col-span-4 lg:sticky lg:top-[calc(var(--header-h)+1.5rem+env(safe-area-inset-top))] lg:self-start">
              <PromiseList title="Our promise" />

              {relatedServiceData.length > 0 && (
                <SidebarLinks
                  label="Our services"
                  items={relatedServiceData.map((s) => ({
                    href: `/${s.slug}`,
                    label: s.h1,
                  }))}
                />
              )}

              {nearbySuburbData.length > 0 && (
                <SidebarLinks
                  label="Nearby areas"
                  items={nearbySuburbData.map((s) => ({
                    href: `/locations/${s.slug}`,
                    label: s.h1,
                  }))}
                />
              )}

              {extraLinks.length > 0 && (
                <SidebarLinks
                  label="More from Caraway"
                  items={extraLinks.map((link) => ({
                    href: link.href,
                    label: link.label,
                  }))}
                />
              )}

              {relatedPosts.length > 0 && (
                <SidebarLinks
                  label="Related articles"
                  items={relatedPosts.map((p) => ({
                    href: `/blog/${p.slug}`,
                    label: p.title,
                  }))}
                />
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
