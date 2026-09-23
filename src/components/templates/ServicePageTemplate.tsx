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
import { BUSINESS, PROMISE_POINTS } from "@/lib/site";
import { getBodyAfterLead, getLeadSentence } from "@/lib/content-summary";
import { canonicalLocationSlug } from "@/lib/location-consolidation";
import { canonicalServiceSlug } from "@/lib/service-consolidation";

export function ServiceSectionContent({ section }: { section: ServiceSection }) {
  return (
    <div>
      <h2 className="mb-4 text-2xl font-semibold tracking-[-0.02em] text-foreground">
        {section.heading}
      </h2>
      <p className="text-base text-muted-foreground">
        {section.content}
      </p>
      {section.image && (
        <figure className="mt-6 overflow-hidden rounded border border-border bg-secondary">
          <Image
            src={section.image.src}
            alt={section.image.alt}
            width={section.image.width}
            height={section.image.height}
            sizes="(max-width: 1023px) calc(100vw - 2rem), 760px"
            loading="lazy"
            className="h-auto w-full"
          />
          <figcaption className="border-t border-border px-4 py-3 text-sm text-muted-foreground">
            {section.image.caption}
          </figcaption>
        </figure>
      )}
      {section.checklistItems && section.checklistItems.length > 0 && (
        <ul
          aria-label={`${section.heading} checklist`}
          className="mt-5 border-t border-border text-base text-muted-foreground"
        >
          {section.checklistItems.map((item) => (
            <li key={item} className="border-b border-border py-3">
              {item}
            </li>
          ))}
        </ul>
      )}
      {section.supportLink && (
        <Link
          href={section.supportLink.href}
          className="mt-3 inline-flex min-h-11 items-center text-sm text-primary underline decoration-primary/35 underline-offset-4 hover:decoration-primary"
        >
          {section.supportLink.label}
        </Link>
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

      <main id="main-content" tabIndex={-1} className="flex-1 mt-header-safe pb-[5.5rem] focus-visible:outline-none lg:pb-0">
        <section className="border-b border-border py-12 sm:py-16 lg:py-24">
          <div className="site-container">
            <Breadcrumbs items={breadcrumbs} />
            <p className="eyebrow mt-8 mb-4">Service</p>
            <h1 className="mb-5 max-w-4xl text-4xl font-semibold leading-[1.05] tracking-[-0.02em] text-foreground text-balance sm:text-5xl">
              {service.h1}
            </h1>
            <p className="mb-8 max-w-[40rem] text-lg text-muted-foreground">
              {heroIntro}
            </p>
            <ScrollToQuoteCTA source={service.slug} />
            {service.reviewedAt && (
              <p className="mt-6 text-xs text-muted-foreground">
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
        </section>

        <QuoteForm source={service.slug} />

        <div className="site-container border-t border-border py-16 sm:py-20 lg:py-28">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
            <div className="max-w-[65ch] space-y-16 lg:col-span-8">
              {introRest && (
                <div>
                  <p className="text-lg text-foreground">
                    {introRest}
                  </p>
                </div>
              )}

              {service.sections.map((section) => (
                <ServiceSectionContent key={section.heading} section={section} />
              ))}

              {service.faqs.length > 0 && (
                <div>
                  <p className="eyebrow mb-4">FAQ</p>
                  <h2 className="mb-2 text-2xl font-semibold tracking-[-0.02em] text-foreground">
                    Frequently asked questions
                  </h2>
                  <Accordion items={service.faqs.map(f => ({ question: f.question, answer: f.answer }))} />
                </div>
              )}
            </div>

            <aside
              aria-labelledby="service-sidebar-heading"
              className="space-y-10 lg:col-span-4 lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:self-start"
            >
              <h2 id="service-sidebar-heading" className="sr-only">
                Service details and related resources
              </h2>
              <div>
                <h3 className="eyebrow mb-3">What Caraway confirms</h3>
                <ul className="border-t border-border">
                  {PROMISE_POINTS.map(item => (
                    <li key={item} className="border-b border-border py-2.5 text-sm text-foreground">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="eyebrow mb-3">Registered Brisbane business</h3>
                <p className="text-sm text-muted-foreground">
                  Caraway is the registered business name of {BUSINESS.legalName},
                  a sole trader based in Brisbane, Queensland.
                </p>
                <ul className="mt-4 space-y-1 text-sm">
                  <li>
                    <a
                      href={BUSINESS.abrUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center text-primary underline decoration-primary/35 underline-offset-4 hover:decoration-primary"
                    >
                      ABN {BUSINESS.abn}
                    </a>
                  </li>
                  <li>
                    <a
                      href={BUSINESS.googleBusinessUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center text-primary underline decoration-primary/35 underline-offset-4 hover:decoration-primary"
                    >
                      View Caraway on Google
                    </a>
                  </li>
                  <li className="flex min-h-[44px] items-center gap-3">
                    <Link className="text-primary underline decoration-primary/35 underline-offset-4 hover:decoration-primary" href="/about">
                      About
                    </Link>
                    <Link className="text-primary underline decoration-primary/35 underline-offset-4 hover:decoration-primary" href="/contact">
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>

              {relatedServiceData.length > 0 && (
                <nav aria-label="Related services">
                  <h3 className="eyebrow mb-3">Related services</h3>
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

              {relatedSuburbData.length > 0 && (
                <nav aria-label="Service areas">
                  <h3 className="eyebrow mb-3">Service areas</h3>
                  <ul className="divide-y divide-border border-y border-border">
                    {relatedSuburbData.map(s => (
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
        <TrustBadges />
      </main>

      <Footer />
      <StickyMobileCTA />
    </div>
  );
}
