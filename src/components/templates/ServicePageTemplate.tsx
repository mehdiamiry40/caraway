import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/sections/Breadcrumbs";
import { TrustBadges } from "@/components/sections/TrustBadges";
import { QuoteForm } from "@/components/sections/QuoteForm";
import { ScrollToQuoteCTA } from "@/components/sections/ScrollToQuoteCTA";
import type { ServicePage } from "@/data/services";
import { services } from "@/data/services";
import { suburbs, type SuburbPage } from "@/data/suburbs";
import { Accordion } from "@/components/ui/accordion";
import { CheckCircle2 } from "lucide-react";
import { PROMISE_POINTS } from "@/lib/site";



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

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: service.h1 }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main id="main-content" className="flex-1 mt-header-safe">
        <section className="aurora-surface py-14 sm:py-20 lg:py-24">
          <div className="site-container relative">
            <Breadcrumbs items={breadcrumbs} />
            <p className="eyebrow mt-7 mb-4">Service</p>
            <h1 className="font-display font-bold text-[clamp(2.25rem,5.5vw,3.75rem)] leading-[1.05] text-foreground text-balance max-w-3xl mb-6" style={{ letterSpacing: "var(--tracking-display)" }}>
              {service.h1}
            </h1>
            <p className="text-muted-foreground text-[1.0625rem] sm:text-xl leading-relaxed max-w-2xl mb-9">
              {service.intro}
            </p>
            <ScrollToQuoteCTA />
          </div>
        </section>

        <div className="site-container py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
            <div className="lg:col-span-2 space-y-12 sm:space-y-14 max-w-none lg:max-w-4xl">
              {service.sections.map((section, i) => (
                <div key={i}>
                  <h2 className="text-2xl sm:text-3xl lg:text-[2rem] font-display font-semibold text-foreground mb-4 leading-[1.15]" style={{ letterSpacing: "var(--tracking-tight)" }}>
                    {section.heading}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed text-[1.0625rem] sm:text-lg">
                    {section.content}
                  </p>
                </div>
              ))}

              {service.faqs.length > 0 && (
                <div className="pt-8 border-t border-border">
                  <p className="eyebrow mb-4">FAQ</p>
                  <h2 className="text-2xl sm:text-3xl lg:text-[2rem] font-display font-semibold text-foreground mb-2 leading-[1.15]" style={{ letterSpacing: "var(--tracking-tight)" }}>
                    Frequently asked questions
                  </h2>
                  <p className="text-muted-foreground mb-7 text-[0.9375rem]">Common questions about this service.</p>
                  <Accordion items={service.faqs.map(f => ({ question: f.question, answer: f.answer }))} />
                </div>
              )}
            </div>

            <aside className="space-y-5 lg:sticky lg:top-[calc(8rem+env(safe-area-inset-top))] lg:self-start">
              <div className="bg-card border border-border rounded-2xl p-6 shadow-[0_1px_2px_hsl(var(--shadow-color)/0.04)]">
                <p className="eyebrow mb-3">Why Caraway</p>
                <p className="text-[0.9375rem] font-semibold text-foreground mb-5">Brisbane&apos;s cash-for-cars buyer</p>
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
                <nav aria-label="Related services" className="bg-card border border-border rounded-2xl p-6 shadow-[0_1px_2px_hsl(var(--shadow-color)/0.04)]">
                  <p className="eyebrow mb-4">Related services</p>
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

              {relatedSuburbData.length > 0 && (
                <nav aria-label="Service areas" className="bg-card border border-border rounded-2xl p-6 shadow-[0_1px_2px_hsl(var(--shadow-color)/0.04)]">
                  <p className="eyebrow mb-4">Service areas</p>
                  <ul className="divide-y divide-border border-t border-border">
                    {relatedSuburbData.map(s => (
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
        <TrustBadges />
      </main>

      <Footer />
    </div>
  );
}
