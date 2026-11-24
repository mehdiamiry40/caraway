import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { StickyMobileCTA } from "@/components/layout/StickyMobileCTA";
import { Breadcrumbs } from "@/components/sections/Breadcrumbs";
import { TrustBadges } from "@/components/sections/TrustBadges";
import { QuoteForm } from "@/components/sections/QuoteForm";
import { SellingSafelySection } from "@/components/sections/SellingSafelySection";
import { ScrollToQuoteCTA } from "@/components/sections/ScrollToQuoteCTA";
import type { ServicePage, ServiceSection } from "@/data/services";
import { services } from "@/data/services";
import { suburbs, type SuburbPage } from "@/data/suburbs";
import { getPostsForService } from "@/data/blog-posts";
import { Accordion } from "@/components/ui/accordion";
import { ArrowRight } from "lucide-react";
import { BUSINESS } from "@/lib/site";
import { getBodyAfterLead, getLeadSentence } from "@/lib/content-summary";
import { canonicalLocationSlug } from "@/lib/location-consolidation";
import { canonicalServiceSlug } from "@/lib/service-consolidation";
import {
  HeroPoints,
  PromiseList,
  SectionHeading,
  SidebarLinks,
  SidebarPanel,
  sidebarLinkClass,
} from "@/components/templates/PagePieces";

const bodyTextClass = "max-w-[72ch] text-[1.0625rem] leading-[1.7] text-foreground";

export function ServiceSectionContent({ section }: { section: ServiceSection }) {
  return (
    <div>
      <SectionHeading>{section.heading}</SectionHeading>
      <p className={bodyTextClass}>
        {section.content}
      </p>
      {section.image && (
        <figure className="mt-7">
          <Image
            src={section.image.src}
            alt={section.image.alt}
            width={section.image.width}
            height={section.image.height}
            sizes="(max-width: 1023px) calc(100vw - 2rem), 760px"
            loading="lazy"
            className="h-auto w-full rounded-md border border-border"
          />
          <figcaption className="mt-2.5 max-w-[68ch] text-sm leading-relaxed text-muted-foreground">
            {section.image.caption}
          </figcaption>
        </figure>
      )}
      {section.checklistItems && section.checklistItems.length > 0 && (
        <ul
          aria-label={`${section.heading} checklist`}
          className="list-ticks mt-6 grid gap-x-10 gap-y-4 !space-y-0 text-[1.0625rem] text-foreground sm:grid-cols-2"
        >
          {section.checklistItems.map((item) => (
            <li key={item}>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
      {section.supportLink && (
        <p className="mt-5">
          <Link href={section.supportLink.href} className="link-arrow text-[1.0625rem]">
            {section.supportLink.label}
            <ArrowRight aria-hidden="true" />
          </Link>
        </p>
      )}
    </div>
  );
}

export default function ServicePageTemplate({
  service,
}: {
  service: ServicePage;
}) {
  const canonicalRelatedServiceSlugs = [
    ...new Set(service.relatedServices.map(canonicalServiceSlug)),
  ].filter((slug) => slug !== service.slug);
  const relatedServiceData = canonicalRelatedServiceSlugs
    .map(slug => services.find(s => s.slug === slug))
    .filter((s): s is ServicePage => s !== undefined);

  const canonicalRelatedSuburbSlugs = [
    ...new Set(
      service.relatedSuburbs
        .map(canonicalLocationSlug)
        .filter((slug): slug is string => slug !== null),
    ),
  ];
  const relatedSuburbData = canonicalRelatedSuburbSlugs
    .map(slug => suburbs.find(s => s.slug === slug))
    .filter((s): s is SuburbPage => s !== undefined);

  const relatedPosts = getPostsForService(service.slug);
  // The hero leads with the first sentence, so the callout below picks up from
  // the second rather than repeating it.
  const heroIntro = getLeadSentence(service.intro);
  const introRest = getBodyAfterLead(service.intro);

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: service.h1 }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main id="main-content" tabIndex={-1} className="flex-1 pb-[5.5rem] focus-visible:outline-none lg:pb-0">
        <section className="on-band page-band section-y-hero" data-sticky-cta-suppress="true">
          <div className="site-container grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <Breadcrumbs items={breadcrumbs} light />
              <h1 className="type-h1 mt-5 text-on-dark-hi">
                {/* Keep the dash with the words before it, so a wrapped
                    line never starts with "—". */}
                {service.h1.replace(" — ", "\u00a0— ")}
              </h1>
              <p className="type-lead mt-4 max-w-2xl text-on-dark-hi">
                {heroIntro}
              </p>
              <HeroPoints className="mt-6" />
              <div className="mt-7">
                <ScrollToQuoteCTA source={service.slug} />
              </div>
              {service.reviewedAt && (
                <p className="mt-4 text-[0.9375rem] text-on-dark-hi">
                  Content reviewed{" "}
                  <time dateTime={service.reviewedAt}>
                    {new Intl.DateTimeFormat("en-AU", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      timeZone: "UTC",
                    }).format(new Date(`${service.reviewedAt}T00:00:00Z`))}
                  </time>
                </p>
              )}
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

        <QuoteForm source={service.slug} />

        <div className="border-t border-border">
        <div className="site-container py-12 lg:py-16">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-12">
            <div className="space-y-10 lg:col-span-8">
              {introRest && (
                <p className="max-w-[66ch] border-l-4 border-accent pl-4 text-lg font-semibold leading-[1.55] text-foreground sm:text-xl">
                  {introRest}
                </p>
              )}

              {service.sections.map((section) => (
                <ServiceSectionContent key={section.heading} section={section} />
              ))}

              {service.faqs.length > 0 && (
                <div>
                  <SectionHeading>
                    Frequently asked questions
                  </SectionHeading>
                  <Accordion items={service.faqs.map(f => ({ question: f.question, answer: f.answer }))} />
                </div>
              )}
            </div>

            <aside
              aria-labelledby="service-sidebar-heading"
              className="space-y-5 lg:col-span-4 lg:sticky lg:top-[calc(var(--header-h)+1.5rem+env(safe-area-inset-top))] lg:self-start"
            >
              <h2 id="service-sidebar-heading" className="sr-only">
                Service details and related resources
              </h2>
              <PromiseList title="What Caraway confirms" />

              <SidebarPanel title="Registered Brisbane business">
                <p className="mt-1.5 text-[0.9375rem] text-muted-foreground">
                  {BUSINESS.legalName}, sole trader, Brisbane QLD
                </p>
                <ul className="mt-1.5 flex flex-wrap gap-x-6">
                  <li>
                    <a href={BUSINESS.abrUrl} target="_blank" rel="noopener noreferrer" className={sidebarLinkClass}>
                      ABN {BUSINESS.abn}
                    </a>
                  </li>
                  <li>
                    <a href={BUSINESS.googleBusinessUrl} target="_blank" rel="noopener noreferrer" className={sidebarLinkClass}>
                      View Caraway on Google
                    </a>
                  </li>
                  <li>
                    <Link href="/about" className={sidebarLinkClass}>
                      About
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className={sidebarLinkClass}>
                      Contact
                    </Link>
                  </li>
                </ul>
              </SidebarPanel>

              {relatedServiceData.length > 0 && (
                <SidebarLinks
                  label="Related services"
                  items={relatedServiceData.map((s) => ({
                    href: `/${s.slug}`,
                    label: s.h1,
                  }))}
                />
              )}

              {relatedSuburbData.length > 0 && (
                <SidebarLinks
                  label="Service areas"
                  items={relatedSuburbData.map((s) => ({
                    href: `/locations/${s.slug}`,
                    label: s.h1,
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
        </div>

        {/* Blue band, then green, so neither runs into the blue footer. */}
        <TrustBadges />
        <SellingSafelySection />
      </main>

      <Footer />
      <StickyMobileCTA />
    </div>
  );
}
