import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import dynamic from "next/dynamic";
import { Breadcrumbs } from "@/components/sections/Breadcrumbs";
import { InternalLinks } from "@/components/sections/InternalLinks";

const QuoteForm = dynamic(() => import("@/components/sections/QuoteForm").then((mod) => mod.QuoteForm));
import { ScrollToQuoteCTA } from "@/components/sections/ScrollToQuoteCTA";
import type { ServicePage } from "@/data/services";
import { services } from "@/data/services";
import { suburbs, type SuburbPage } from "@/data/suburbs";
import { Accordion } from "@/components/ui/accordion";
import { CheckCircle2 } from "lucide-react";
import { BUSINESS } from "@/lib/site";

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

      <main id="main-content" className="flex-1 mt-14 lg:mt-[104px]">
        <section className="bg-gradient-to-br from-primary via-primary to-primary/90 text-white py-16 lg:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent/[0.08] via-transparent to-transparent pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <Breadcrumbs items={breadcrumbs} light />
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-[1.1] mt-6 mb-6">
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
            <div className="lg:col-span-2 space-y-12">
              {service.sections.map((section, i) => (
                <div key={i} className="group">
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-4 leading-snug">
                    {section.heading}
                  </h2>
                  <div className="w-12 h-1 bg-accent/60 rounded-full mb-5" />
                  <p className="text-muted-foreground leading-relaxed text-base sm:text-lg">
                    {section.content}
                  </p>
                </div>
              ))}

              {service.faqs.length > 0 && (
                <div className="pt-4 border-t border-border/40">
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-2 leading-snug">
                    Frequently Asked Questions
                  </h2>
                  <p className="text-muted-foreground mb-8">Common questions about this service.</p>
                  <Accordion items={service.faqs.map(f => ({ question: f.question, answer: f.answer }))} />
                </div>
              )}
            </div>

            <aside className="space-y-6 lg:sticky lg:top-32 lg:self-start">
              <div className="bg-gradient-to-b from-primary/[0.07] to-primary/[0.02] border border-primary/10 rounded-2xl p-6">
                <h3 className="font-display font-bold text-lg mb-1">Why Caraway?</h3>
                <p className="text-xs text-muted-foreground mb-5">Brisbane&apos;s trusted cash-for-cars service</p>
                <ul className="space-y-3.5">
                  {["Up to $9,999 cash", "Same-day pickup", "Free towing always", "No RWC needed", "All makes & models", "7 days a week"].map(item => (
                    <li key={item} className="flex items-center gap-3 text-sm text-foreground/80">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/10">
                        <CheckCircle2 className="h-3.5 w-3.5 text-accent shrink-0" />
                      </span>
                      <span className="font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gradient-to-b from-accent/10 to-accent/[0.03] border border-accent/15 rounded-2xl p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-3">
                  <span className="text-accent text-xl" aria-hidden="true">&#9742;</span>
                </div>
                <h3 className="font-display font-bold text-lg mb-1">Call for an Instant Quote</h3>
                <p className="text-sm text-muted-foreground mb-5">Speak to our Brisbane team now</p>
                <a
                  href={BUSINESS.phoneHref}
                  className="flex items-center justify-center gap-2 bg-accent text-white rounded-full py-3.5 px-6 font-semibold hover:bg-accent/90 shadow-md shadow-accent/20 hover:shadow-lg hover:shadow-accent/25 transition-all"
                >
                  {BUSINESS.phone}
                </a>
              </div>

              {relatedServiceData.length > 0 && (
                <div className="border border-border/60 rounded-2xl p-6 bg-white">
                  <h3 className="font-display font-bold text-lg mb-4">Related Services</h3>
                  <ul className="space-y-1">
                    {relatedServiceData.map(s => (
                      <li key={s.slug}>
                        <Link
                          href={`/${s.slug}`}
                          className="flex items-center gap-2 text-sm text-primary hover:text-accent transition-colors py-1.5 px-2 -mx-2 rounded-lg hover:bg-muted/50"
                        >
                          <span className="w-1 h-1 rounded-full bg-accent/50 shrink-0" />
                          {s.h1}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {relatedSuburbData.length > 0 && (
                <div className="border border-border/60 rounded-2xl p-6 bg-white">
                  <h3 className="font-display font-bold text-lg mb-4">Service Areas</h3>
                  <ul className="space-y-1">
                    {relatedSuburbData.map(s => (
                      <li key={s.slug}>
                        <Link
                          href={`/locations/${s.slug}`}
                          className="flex items-center gap-2 text-sm text-primary hover:text-accent transition-colors py-1.5 px-2 -mx-2 rounded-lg hover:bg-muted/50"
                        >
                          <span className="w-1 h-1 rounded-full bg-accent/50 shrink-0" />
                          {s.h1}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </aside>
          </div>
        </div>

        <QuoteForm />
        <InternalLinks currentSlug={service.slug} />
      </main>

      <Footer />
    </div>
  );
}
