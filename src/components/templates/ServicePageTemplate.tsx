import { createElement } from "react";
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
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BadgeDollarSign,
  Banknote,
  BookOpen,
  Building2,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  Info,
  Mail,
  MapPin,
  MessageCircleQuestion,
  Receipt,
  SearchCheck,
  Star,
  Truck,
} from "lucide-react";
import { BUSINESS, PROMISE_POINTS } from "@/lib/site";
import { getBodyAfterLead, getLeadSentence } from "@/lib/content-summary";
import { canonicalLocationSlug } from "@/lib/location-consolidation";
import { canonicalServiceSlug } from "@/lib/service-consolidation";
import { sectionIcon, serviceIcon } from "@/lib/service-icons";

const HERO_POINTS = [
  { icon: BadgeDollarSign, label: PROMISE_POINTS[0] },
  { icon: CalendarClock, label: PROMISE_POINTS[1] },
  { icon: Truck, label: PROMISE_POINTS[2] },
] as const;

const CONFIRM_ICONS: LucideIcon[] = [
  BadgeDollarSign,
  CalendarClock,
  Truck,
  SearchCheck,
  Banknote,
  Receipt,
];

const CONFIRM_POINTS = PROMISE_POINTS.map((label, index) => ({
  label,
  icon: CONFIRM_ICONS[index] ?? CheckCircle2,
}));

const sideLinkClass =
  "inline-flex min-h-11 items-center gap-2 whitespace-nowrap text-primary underline-offset-4 hover:underline";

function SidebarLinks({
  label,
  items,
}: {
  label: string;
  items: { href: string; label: string; icon: LucideIcon }[];
}) {
  return (
    <nav aria-label={label} className="border border-border bg-card p-5 sm:p-6">
      <h3 className="font-display text-base mb-3 text-foreground">{label}</h3>
      <ul className="divide-y divide-border/60 border-t border-border/60">
        {items.map(({ href, label: itemLabel, icon: Icon }) => (
          <li key={href}>
            <Link
              href={href}
              className="group flex min-h-[44px] items-center gap-3 py-2.5 text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              <Icon className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              <span className="flex-1">{itemLabel}</span>
              <ChevronRight
                className="h-4 w-4 shrink-0 text-border transition-colors group-hover:text-primary"
                aria-hidden="true"
              />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function ServiceSectionContent({ section }: { section: ServiceSection }) {
  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center bg-secondary text-primary">
          {createElement(sectionIcon(section.heading), {
            className: "h-6 w-6",
            strokeWidth: 1.75,
            "aria-hidden": true,
          })}
        </span>
        <h2 className="text-2xl sm:text-3xl font-display text-foreground leading-[1.15]" style={{ letterSpacing: "var(--tracking-tight)" }}>
          {section.heading}
        </h2>
      </div>
      <p className="text-foreground/75 leading-relaxed text-base">
        {section.content}
      </p>
      {section.image && (
        <figure className="mt-6 overflow-hidden border border-border bg-muted">
          <Image
            src={section.image.src}
            alt={section.image.alt}
            width={section.image.width}
            height={section.image.height}
            sizes="(max-width: 1023px) calc(100vw - 2rem), 760px"
            loading="lazy"
            className="h-auto w-full"
          />
          <figcaption className="border-t border-border bg-card px-4 py-2.5 text-xs leading-relaxed text-muted-foreground sm:px-5">
            {section.image.caption}
          </figcaption>
        </figure>
      )}
      {section.checklistItems && section.checklistItems.length > 0 && (
        <ul
          aria-label={`${section.heading} checklist`}
          className="mt-5 grid gap-2.5 text-sm text-foreground/80 sm:grid-cols-2"
        >
          {section.checklistItems.map((item) => (
            <li key={item} className="flex items-start gap-3 border border-border bg-card p-3.5 leading-relaxed">
              <CheckCircle2
                className="mt-0.5 h-4 w-4 shrink-0 text-accent-ink"
                strokeWidth={2.25}
                aria-hidden="true"
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
      {section.supportLink && (
        <Link
          href={section.supportLink.href}
          className="mt-3 inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-primary underline underline-offset-4 hover:text-accent-ink"
        >
          {section.supportLink.label}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
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
        <section className="aurora-surface py-8 sm:py-11 lg:py-14">
          <div className="site-container relative grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <Breadcrumbs items={breadcrumbs} />
              <span className="mt-6 flex h-12 w-12 items-center justify-center bg-primary text-primary-foreground">
                {createElement(serviceIcon(service.slug), {
                  className: "h-6 w-6",
                  strokeWidth: 1.75,
                  "aria-hidden": true,
                })}
              </span>
              <h1 className="mt-4 font-display font-bold text-[clamp(2rem,5vw,3.25rem)] leading-[1.06] text-primary text-balance mb-4" style={{ letterSpacing: "var(--tracking-display)" }}>
                {service.h1}
              </h1>
              <p className="text-foreground/75 text-base sm:text-lg leading-relaxed max-w-2xl mb-6">
                {heroIntro}
              </p>
              <ul className="mb-7 flex flex-wrap gap-2">
                {HERO_POINTS.map(({ icon: Icon, label }) => (
                  <li
                    key={label}
                    className="inline-flex items-center gap-2 border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground/85"
                  >
                    <Icon className="h-4 w-4 text-accent-ink" aria-hidden="true" />
                    {label}
                  </li>
                ))}
              </ul>
              <ScrollToQuoteCTA source={service.slug} />
              {service.reviewedAt && (
                <p className="mt-4 text-xs text-foreground/65">
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

        <QuoteForm source={service.slug} />

        <div className="site-container py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
            <div className="lg:col-span-2 space-y-12 sm:space-y-14 max-w-none lg:max-w-4xl">
              {introRest && (
                <div className="flex gap-4 border-l-4 border-accent bg-secondary px-5 py-5 sm:px-6">
                  <Info className="mt-0.5 h-5 w-5 shrink-0 text-accent-ink" aria-hidden="true" />
                  <p className="text-foreground/80 leading-relaxed text-base">
                    {introRest}
                  </p>
                </div>
              )}

              {service.sections.map((section) => (
                <ServiceSectionContent key={section.heading} section={section} />
              ))}

              {service.faqs.length > 0 && (
                <div className="pt-6 border-t border-border/60">
                  <div className="mb-2 flex items-center gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center bg-primary text-primary-foreground">
                      <MessageCircleQuestion className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-display text-foreground leading-[1.15]" style={{ letterSpacing: "var(--tracking-tight)" }}>
                      Frequently asked questions
                    </h2>
                  </div>
                  <Accordion items={service.faqs.map(f => ({ question: f.question, answer: f.answer }))} />
                </div>
              )}
            </div>

            <aside
              aria-labelledby="service-sidebar-heading"
              className="space-y-5 lg:sticky lg:top-[calc(8rem+env(safe-area-inset-top))] lg:self-start"
            >
              <h2 id="service-sidebar-heading" className="sr-only">
                Service details and related resources
              </h2>
              <div className="border border-border bg-card p-5 sm:p-6">
                <h3 className="font-display text-base text-foreground mb-4">What Caraway confirms</h3>
                <ul className="grid grid-cols-2 gap-2.5">
                  {CONFIRM_POINTS.map(({ icon: Icon, label }) => (
                    <li
                      key={label}
                      className="flex flex-col items-center gap-2 bg-secondary px-2 py-3.5 text-center text-xs font-medium leading-snug text-foreground/85"
                    >
                      <Icon className="h-5 w-5 text-primary" strokeWidth={1.75} aria-hidden="true" />
                      {label}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border border-border bg-card p-5 sm:p-6">
                <h3 className="font-display text-base text-foreground mb-1">Registered Brisbane business</h3>
                <p className="text-xs text-muted-foreground">
                  {BUSINESS.legalName}, sole trader, Brisbane QLD
                </p>
                <ul className="mt-3 flex flex-wrap gap-x-5 text-sm">
                  <li>
                    <a href={BUSINESS.abrUrl} target="_blank" rel="noopener noreferrer" className={sideLinkClass}>
                      <Building2 className="h-4 w-4 shrink-0 text-accent-ink" aria-hidden="true" />
                      ABN {BUSINESS.abn}
                    </a>
                  </li>
                  <li>
                    <a href={BUSINESS.googleBusinessUrl} target="_blank" rel="noopener noreferrer" className={sideLinkClass}>
                      <Star className="h-4 w-4 shrink-0 text-accent-ink" aria-hidden="true" />
                      View Caraway on Google
                    </a>
                  </li>
                  <li>
                    <Link href="/about" className={sideLinkClass}>
                      <Info className="h-4 w-4 shrink-0 text-accent-ink" aria-hidden="true" />
                      About
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className={sideLinkClass}>
                      <Mail className="h-4 w-4 shrink-0 text-accent-ink" aria-hidden="true" />
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>

              {relatedServiceData.length > 0 && (
                <SidebarLinks
                  label="Related services"
                  items={relatedServiceData.map((s) => ({
                    href: `/${s.slug}`,
                    label: s.h1,
                    icon: serviceIcon(s.slug),
                  }))}
                />
              )}

              {relatedSuburbData.length > 0 && (
                <SidebarLinks
                  label="Service areas"
                  items={relatedSuburbData.map((s) => ({
                    href: `/locations/${s.slug}`,
                    label: s.h1,
                    icon: MapPin,
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
        <TrustBadges />
      </main>

      <Footer />
      <StickyMobileCTA />
    </div>
  );
}
