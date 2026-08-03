import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { StickyMobileCTA } from "@/components/layout/StickyMobileCTA";
import { Breadcrumbs } from "@/components/sections/Breadcrumbs";
import { TrustBadges } from "@/components/sections/TrustBadges";
import { QuoteForm } from "@/components/sections/QuoteForm";
import { SellingSafelySection } from "@/components/sections/SellingSafelySection";
import { ScrollToQuoteCTA } from "@/components/sections/ScrollToQuoteCTA";
import type { ServicePage } from "@/data/services";
import { services } from "@/data/services";
import { suburbs, type SuburbPage } from "@/data/suburbs";
import { getPostsForService } from "@/data/blog-posts";
import { Accordion } from "@/components/ui/accordion";
import { CheckCircle2 } from "lucide-react";
import { PROMISE_POINTS } from "@/lib/site";
import { getBodyAfterLead, getLeadSentence } from "@/lib/content-summary";

export default function ServicePageTemplate({
  service,
}: {
  service: ServicePage;
}) {
  const relatedServiceData = service.relatedServices
    .map(slug => services.find(s => s.slug === slug))
    .filter((s): s is ServicePage => s !== undefined);

  const relatedSuburbData = service.relatedSuburbs
    .map(slug => suburbs.find(s => s.slug === slug))
    .filter((s): s is SuburbPage => s !== undefined);

  const relatedPosts = getPostsForService(service.slug);
  // The hero leads with the first sentence, so the callout below picks up from
  // the second rather than repeating it.
  const heroIntro = getLeadSentence(service.intro);
  const introRest = getBodyAfterLead(service.intro);

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: service.h1 }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main id="main-content" tabIndex={-1} className="flex-1 mt-header-safe pb-[5.5rem] focus-visible:outline-none lg:pb-0">
        <section className="aurora-surface py-8 sm:py-11 lg:py-14">
          <div className="site-container relative">
            <Breadcrumbs items={breadcrumbs} />
            <p className="eyebrow mt-5 mb-3">Service</p>
            <h1 className="font-display font-bold text-[clamp(2rem,5vw,3.5rem)] leading-[1.06] text-primary text-balance max-w-4xl mb-4" style={{ letterSpacing: "var(--tracking-display)" }}>
              {service.h1}
            </h1>
            <p className="text-foreground/75 text-base sm:text-lg leading-relaxed max-w-2xl mb-7">
              {heroIntro}
            </p>
            <ScrollToQuoteCTA />
          </div>
        </section>

        <QuoteForm />

        <div className="site-container py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
            <div className="lg:col-span-2 space-y-12 sm:space-y-14 max-w-none lg:max-w-4xl">
              {introRest && (
                <div className="border-l-4 border-accent bg-secondary px-5 py-5 sm:px-6">
                  <p className="text-foreground/80 leading-relaxed text-base sm:text-lg">
                    {introRest}
                  </p>
                </div>
              )}

              {service.sections.map((section, i) => (
                <div key={i}>
                  <h2 className="text-2xl sm:text-3xl lg:text-[2rem] font-display text-foreground mb-4 leading-[1.15]" style={{ letterSpacing: "var(--tracking-tight)" }}>
                    {section.heading}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed text-base sm:text-lg">
                    {section.content}
                  </p>
                </div>
              ))}

              {service.faqs.length > 0 && (
                <div className="pt-6 border-t border-border/60">
                  <p className="eyebrow mb-4">FAQ</p>
                  <h2 className="text-2xl sm:text-3xl lg:text-[2rem] font-display text-foreground mb-2 leading-[1.15]" style={{ letterSpacing: "var(--tracking-tight)" }}>
                    Frequently asked questions
                  </h2>
                  <Accordion items={service.faqs.map(f => ({ question: f.question, answer: f.answer }))} />
                </div>
              )}
            </div>

            <aside className="space-y-5 lg:sticky lg:top-[calc(8rem+env(safe-area-inset-top))] lg:self-start">
              <div className="bg-card border border-border p-5 sm:p-6 shadow-sm">
                <h3 className="text-sm font-display mb-1 text-foreground">Why Caraway</h3>
                <p className="text-xs text-muted-foreground mb-5">Brisbane&apos;s cash-for-cars buyer</p>
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
                <nav aria-label="Related services" className="bg-card border border-border p-5 sm:p-6 shadow-sm">
                  <h3 className="text-sm font-display mb-4 text-foreground">Related services</h3>
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

              {relatedSuburbData.length > 0 && (
                <nav aria-label="Service areas" className="bg-card border border-border p-5 sm:p-6 shadow-sm">
                  <h3 className="text-sm font-display mb-4 text-foreground">Service areas</h3>
                  <ul className="divide-y divide-border/60 border-t border-border/60">
                    {relatedSuburbData.map(s => (
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
        <TrustBadges />
      </main>

      <Footer />
      <StickyMobileCTA />
    </div>
  );
}
