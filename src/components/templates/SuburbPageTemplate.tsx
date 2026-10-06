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
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  CarFront,
  CheckCircle2,
  ClipboardList,
  FileSignature,
  MapPin,
  MessageCircleQuestion,
  Phone,
  Truck,
} from "lucide-react";
import { BUSINESS } from "@/lib/site";
import { TrackedPhoneLink } from "@/components/layout/TrackedPhoneLink";
import { cn } from "@/lib/utils";
import { getBodyAfterLead, getLeadSentence } from "@/lib/content-summary";
import { serviceIcon } from "@/lib/service-icons";
import {
  HeroPoints,
  IconHeading,
  IconSteps,
  PromiseTiles,
  SidebarLinks,
} from "@/components/templates/PagePieces";

const STEPS = [
  { icon: ClipboardList, title: "Get your quote", description: "Send your car details." },
  { icon: FileSignature, title: "Lock the number", description: "Firm price, pickup window booked." },
  { icon: Truck, title: "Payment and pickup", description: "Payment confirmed before the car leaves." },
] as const;

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
          <div className="site-container relative grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <Breadcrumbs items={breadcrumbs} />
              <span className="mt-6 flex h-12 w-12 items-center justify-center bg-primary text-primary-foreground">
                <MapPin className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />
              </span>
              <h1 className="mt-4 font-display font-bold text-[clamp(2rem,5vw,3.25rem)] leading-[1.06] text-primary text-balance mb-4" style={{ letterSpacing: "var(--tracking-display)" }}>
                {suburb.h1}
              </h1>
              <p className="text-foreground/75 text-base sm:text-lg leading-relaxed max-w-2xl mb-6">
                {heroIntro}
              </p>
              <HeroPoints className="mb-7" />
              <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
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
            </div>
            <div className="relative hidden overflow-hidden border border-border lg:col-span-5 lg:block">
              <Image
                src="/images/tow-truck-hero.webp"
                alt="Tilt-tray truck carrying a silver sedan"
                width={800}
                height={800}
                sizes="(min-width: 1280px) 500px, 40vw"
                loading="eager"
                className="aspect-square h-auto w-full object-cover"
              />
            </div>
          </div>
        </section>

        <div className="site-container py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
            <div className="lg:col-span-2 space-y-12 sm:space-y-14 max-w-none lg:max-w-4xl">
              <div>
                <IconHeading icon={MapPin}>
                  Car removal in {areaName} and nearby suburbs
                </IconHeading>
                {introRest && (
                  <p className="text-foreground/75 leading-relaxed text-base">
                    {introRest}
                  </p>
                )}
                <p className="mt-4 text-foreground/75 leading-relaxed text-base">
                  {suburb.localContent}
                </p>
                {nearbyAreaNames.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-sm font-display text-foreground mb-3">Nearby suburbs covered</h3>
                    <ul className="flex flex-wrap gap-2">
                      {nearbyAreaNames.map((name) => (
                        <li key={name} className="inline-flex items-center gap-1.5 border border-border bg-secondary px-3 py-1.5 text-sm text-foreground/80">
                          <MapPin className="h-3.5 w-3.5 text-accent-ink" aria-hidden="true" />
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
                  <IconHeading icon={Truck}>
                    Pickup access in {areaName}
                  </IconHeading>
                  <ul className="grid gap-2.5 sm:grid-cols-2">
                    {suburb.pickupAccessNotes.map((note) => (
                      <li key={note} className="flex items-start gap-3 border border-border bg-card p-3.5 text-sm text-foreground/80 leading-relaxed">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent-ink" strokeWidth={2.25} aria-hidden="true" />
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <IconHeading icon={CarFront}>
                  What we buy in {suburb.h1.replace("Cash for Cars ", "")}
                </IconHeading>
                <p className="text-foreground/75 leading-relaxed text-base">
                  {suburb.serviceDetails}
                </p>
              </div>

              <div>
                <IconHeading icon={BadgeCheck}>
                  Why choose Caraway in {suburb.h1.replace("Cash for Cars ", "")}?
                </IconHeading>
                <p className="text-foreground/75 leading-relaxed text-base">
                  {suburb.whyUs}
                </p>
              </div>

              {suburb.localFaqs && suburb.localFaqs.length > 0 && (
                <div>
                  <IconHeading icon={MessageCircleQuestion} tone="solid">
                    {areaName} car removal FAQs
                  </IconHeading>
                  <Accordion items={suburb.localFaqs} headingLevel={3} />
                </div>
              )}

              <div className="border border-border bg-card p-6 sm:p-8 lg:p-10">
                <h2 className="text-center text-2xl sm:text-3xl font-display text-foreground mb-8 leading-[1.15]" style={{ letterSpacing: "var(--tracking-tight)" }}>
                  Three steps to cash in hand.
                </h2>
                <IconSteps steps={STEPS} />
              </div>

              {suburb.finalCtaText && (
                <div>
                  <IconHeading icon={Phone} tone="solid">
                    Get a local pickup quote
                  </IconHeading>
                  <p className="text-foreground/75 leading-relaxed text-base mb-6">
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
              <PromiseTiles title="Our promise" />

              {relatedServiceData.length > 0 && (
                <SidebarLinks
                  label="Our services"
                  items={relatedServiceData.map((s) => ({
                    href: `/${s.slug}`,
                    label: s.h1,
                    icon: serviceIcon(s.slug),
                  }))}
                />
              )}

              {nearbySuburbData.length > 0 && (
                <SidebarLinks
                  label="Nearby areas"
                  items={nearbySuburbData.map((s) => ({
                    href: `/locations/${s.slug}`,
                    label: s.h1,
                    icon: MapPin,
                  }))}
                />
              )}

              {extraLinks.length > 0 && (
                <SidebarLinks
                  label="More from Caraway"
                  items={extraLinks.map((link) => ({
                    href: link.href,
                    label: link.label,
                    icon: ArrowRight,
                  }))}
                />
              )}

              {relatedPosts.length > 0 && (
                <SidebarLinks
                  label="Related articles"
                  items={relatedPosts.map((p) => ({
                    href: `/blog/${p.slug}`,
                    label: p.title,
                    icon: BookOpen,
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
