import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import dynamic from "next/dynamic";
import { Breadcrumbs } from "@/components/sections/Breadcrumbs";
import { InternalLinks } from "@/components/sections/InternalLinks";
import { TrustBadges } from "@/components/sections/TrustBadges";

const QuoteForm = dynamic(() => import("@/components/sections/QuoteForm").then((mod) => mod.QuoteForm));
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
        <section className="bg-primary text-white py-16 lg:py-24 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <Breadcrumbs items={breadcrumbs} light />
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-[1.1] tracking-tight mt-6 mb-6">
              {service.h1}
            </h1>
            <p className="text-white/75 text-lg sm:text-xl leading-relaxed max-w-3xl mb-10">
              {service.intro}
            </p>
            <ScrollToQuoteCTA />
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
            <div className="lg:col-span-2 space-y-10 sm:space-y-12 max-w-none lg:max-w-4xl">
              {service.sections.map((section, i) => (
                <div key={i} className="group">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-foreground mb-4 leading-snug tracking-tight">
                    {section.heading}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed text-base sm:text-lg">
                    {section.content}
                  </p>
                </div>
              ))}

              {service.faqs.length > 0 && (
                <div className="pt-4 border-t border-border/40">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-foreground mb-2 leading-snug tracking-tight">
                    Frequently Asked Questions
                  </h2>
                  <p className="text-muted-foreground mb-8">Common questions about this service.</p>
                  <Accordion items={service.faqs.map(f => ({ question: f.question, answer: f.answer }))} />
                </div>
              )}
            </div>

            <aside className="space-y-6 lg:sticky lg:top-[calc(8rem+env(safe-area-inset-top))] lg:self-start">
              <div className="bg-card border border-border/60 rounded-xl shadow-[0_2px_12px_-6px_rgba(20,52,88,0.04)] p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-display font-bold mb-1">Why Caraway?</h3>
                <p className="text-xs text-muted-foreground mb-5">Brisbane&apos;s trusted cash-for-cars service</p>
                <ul className="space-y-3.5">
                  {PROMISE_POINTS.map(item => (
                    <li key={item} className="flex items-center gap-3 text-sm text-foreground/80">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/10">
                        <CheckCircle2 className="h-3.5 w-3.5 text-accent shrink-0" />
                      </span>
                      <span className="font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {relatedServiceData.length > 0 && (
                <nav aria-label="Related services" className="bg-card border border-border/60 rounded-xl shadow-[0_2px_12px_-6px_rgba(20,52,88,0.04)] p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-display font-bold mb-4">Related Services</h3>
                  <ul className="space-y-1">
                    {relatedServiceData.map(s => (
                      <li key={s.slug}>
                        <Link
                          href={`/${s.slug}`}
                          className="flex items-center gap-2 text-sm text-primary hover:text-accent transition-colors min-h-[44px] py-2 px-2 -mx-2 rounded-lg hover:bg-muted/50"
                        >
                          <span className="w-1 h-1 rounded-full bg-accent/50 shrink-0" />
                          {s.h1}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              )}

              {relatedSuburbData.length > 0 && (
                <nav aria-label="Service areas" className="bg-card border border-border/60 rounded-xl shadow-[0_2px_12px_-6px_rgba(20,52,88,0.04)] p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-display font-bold mb-4">Service Areas</h3>
                  <ul className="space-y-1">
                    {relatedSuburbData.map(s => (
                      <li key={s.slug}>
                        <Link
                          href={`/locations/${s.slug}`}
                          className="flex items-center gap-2 text-sm text-primary hover:text-accent transition-colors min-h-[44px] py-2 px-2 -mx-2 rounded-lg hover:bg-muted/50"
                        >
                          <span className="w-1 h-1 rounded-full bg-accent/50 shrink-0" />
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
        <InternalLinks currentSlug={service.slug} />
      </main>

      <Footer />
    </div>
  );
}
