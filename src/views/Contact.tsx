import dynamic from "next/dynamic";
import { PageShell } from "@/components/layout/PageShell";
import { BUSINESS } from "@/lib/site";

const ContactForm = dynamic(() => import("@/components/sections/ContactForm").then((mod) => mod.ContactForm));
import { Building2, Clock, Mail, MapPin } from "lucide-react";

const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "Contact Us" }
];

export default function Contact() {
  return (
    <PageShell
      breadcrumbs={breadcrumbs}
      title="Contact Us — Get a Free Cash Quote"
      subtitle={
        <p>
          Ready to sell your car for cash in Brisbane? Get in touch for a free, no-obligation quote. We&apos;re available 7 days a week across Greater Brisbane.
        </p>
      }
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-28">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 lg:gap-14">
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-foreground mb-4 leading-snug tracking-tight">Get in Touch</h2>
              <p className="text-muted-foreground leading-relaxed text-base sm:text-lg">
                The fastest way to get a cash offer is to use our online price estimator. Our Brisbane team will follow up with a confirmed quote and arrange same- or next-day pickup in most areas.
              </p>
            </div>

            <div className="space-y-5">
              <a href={BUSINESS.emailHref} className="flex items-start gap-3 sm:gap-4 group rounded-xl border border-border/60 bg-card p-5 sm:p-6 hover:border-primary/40 hover:shadow-sm transition-all min-h-[44px] touch-manipulation">
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
                  icon: Building2,
                  title: "Registered office",
                  main: BUSINESS.addressFormatted,
                  sub: "Mail and admin only — not open to the public. We don’t accept vehicle drop-offs; pickups are always at your location.",
                },
                {
                  icon: MapPin,
                  title: "Service area",
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
                <div key={item.title} className="flex items-start gap-3 sm:gap-4 rounded-xl border border-border/60 bg-card p-5 sm:p-6">
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

            <div className="rounded-xl border border-border/60 bg-card p-5 sm:p-6">
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
    </PageShell>
  );
}
