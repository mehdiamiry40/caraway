import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import dynamic from "next/dynamic";
import { Breadcrumbs } from "@/components/sections/Breadcrumbs";
import { InternalLinks } from "@/components/sections/InternalLinks";
import { BUSINESS } from "@/lib/site";

const QuoteForm = dynamic(() => import("@/components/sections/QuoteForm").then((mod) => mod.QuoteForm));
const ContactForm = dynamic(() => import("@/components/sections/ContactForm").then((mod) => mod.ContactForm));
import { Mail, MapPin, Clock } from "lucide-react";

const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "Contact Us" }
];

export default function Contact() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main id="main-content" className="flex-1 mt-header-safe">
        <section className="bg-primary text-white py-16 lg:py-24 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <Breadcrumbs items={breadcrumbs} light />
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-[1.1] mt-6 mb-6">
              Contact Us — Get a Free Cash Quote
            </h1>
            <p className="text-white/75 text-lg sm:text-xl leading-relaxed max-w-3xl">
              Ready to sell your car for cash in Brisbane? Get in touch for a free, no-obligation quote. We&apos;re available 7 days a week across Greater Brisbane.
            </p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-4 leading-snug">Get in Touch</h2>
                <p className="text-muted-foreground leading-relaxed text-base sm:text-lg">
                  The fastest way to get a cash offer is to use our online price estimator. Our Brisbane team will follow up with a confirmed quote and arrange same-day pickup in most areas.
                </p>
              </div>

              <div className="space-y-5">
                <a href={BUSINESS.emailHref} className="flex items-start gap-3 sm:gap-4 group p-4 -mx-4 rounded-lg hover:bg-muted transition-colors min-h-[44px] touch-manipulation">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 bg-accent/10 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-accent/15 transition-colors">
                    <Mail className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm group-hover:text-accent transition-colors">Email</h3>
                    <p className="text-base font-bold text-primary">{BUSINESS.email}</p>
                    <p className="text-sm text-muted-foreground">We respond within 1 hour during business hours</p>
                  </div>
                </a>

                {[
                  {
                    icon: MapPin,
                    title: "Service Area",
                    main: `All of Greater ${BUSINESS.location}`,
                    sub: BUSINESS.locationDetail,
                  },
                  {
                    icon: Clock,
                    title: "Operating Hours",
                    main: BUSINESS.hours,
                    sub: BUSINESS.hoursDetail,
                  },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3 sm:gap-4 p-4 -mx-4">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 bg-muted rounded-lg flex items-center justify-center shrink-0">
                      <item.icon className="h-5 w-5 text-primary/60" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-sm">{item.title}</h3>
                      <p className="text-muted-foreground">{item.main}</p>
                      <p className="text-sm text-muted-foreground">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-8">
              <ContactForm />

              <div className="bg-muted rounded-lg p-4 sm:p-7 md:p-8 border border-border/60">
                <h2 className="text-lg font-display font-bold text-foreground mb-1">Quick Reference</h2>
                <p className="text-sm text-muted-foreground mb-6">Everything you need to know before getting a quote</p>
                <div className="space-y-4 text-sm">
                  {[
                    { q: "What to have ready:", a: "Your car's make, model, year, approximate kilometres, and a brief description of its condition." },
                    { q: "What you'll need at pickup:", a: "Photo ID (driver's licence). Registration papers if available, but not essential." },
                    { q: "Payment method:", a: "Cash on the spot. Paid before the car leaves your property." },
                    { q: "Towing cost:", a: "Free. Always. No exceptions." },
                  ].map((item, i, arr) => (
                    <div key={item.q} className={i < arr.length - 1 ? "border-b border-border/60 pb-4" : ""}>
                      <strong className="text-foreground">{item.q}</strong>
                      <p className="text-muted-foreground mt-1">{item.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <QuoteForm />
        <InternalLinks />
      </main>

      <Footer />
    </div>
  );
}
