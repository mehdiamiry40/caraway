import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/sections/Breadcrumbs";
import { InternalLinks } from "@/components/sections/InternalLinks";
import { Accordion } from "@/components/ui/accordion";
import { BUSINESS } from "@/lib/site";
import { Phone, MessageCircle } from "lucide-react";

const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "FAQ" }
];

const faqCategories = [
  {
    category: "Pricing & Payment",
    faqs: [
      { question: "How much will I get for my car in Brisbane?", answer: "Every car is different. We calculate your offer based on make, model, year, condition, mileage, and the current market. Brisbane sellers typically receive between $150 and $9,999. We always aim to beat competing offers." },
      { question: "How do you determine my car's value?", answer: "We use real-time market data including current scrap metal prices, parts demand, and recent comparable sales in Brisbane. Our valuations are transparent — we'll explain exactly how we arrived at your offer." },
      { question: "When and how do I get paid?", answer: "You're paid in cash on the spot when our driver arrives to collect your vehicle — before the car leaves your property. No bank transfers, no waiting periods, no cheques." },
      { question: "Can you match or beat a quote I've received elsewhere?", answer: "We'll certainly try. If you've received a competing offer, let us know the amount and we'll do our best to match or exceed it. We're competitive on pricing across Brisbane." }
    ]
  },
  {
    category: "Vehicle Requirements",
    faqs: [
      { question: "What types of cars do you buy?", answer: "We buy all types — sedans, utes, 4WDs, SUVs, vans, trucks, and commercial vehicles. Old cars, damaged cars, scrap cars, accident write-offs, flood-damaged vehicles, and more. Running or not." },
      { question: "Do I need a Roadworthy Certificate (RWC)?", answer: "No. We buy cars as-is in any condition. A roadworthy certificate is not required to sell your vehicle to Caraway." },
      { question: "Can I sell a car without registration?", answer: "Yes. We buy unregistered, deregistered, and expired-registration vehicles across Brisbane. No current registration is needed." },
      { question: "Do you buy cars that don't run or start?", answer: "Absolutely. Non-running, mechanically failed, and immobile vehicles are among the most common types we purchase. Our tow truck will handle the rest." },
      { question: "Can I sell a car I still owe finance on?", answer: "In some cases, yes. Contact us to discuss your specific situation. We may be able to arrange payout of remaining finance as part of the sale." }
    ]
  },
  {
    category: "Process & Logistics",
    faqs: [
      { question: "How does the selling process work?", answer: "It's three simple steps: (1) Contact us with your car details for a free quote. (2) Accept our offer. (3) We pick up your car and pay you cash. The whole process can be completed in under an hour." },
      { question: "How fast can you pick up my car?", answer: "We offer same-day pickup across most Brisbane suburbs. Contact us before midday and we can usually arrange afternoon collection." },
      { question: "Is your towing really free?", answer: "Yes — 100% free towing anywhere in Greater Brisbane. There are no hidden towing fees, no deductions, and no surprises. The quoted price is what you receive." },
      { question: "What paperwork do I need?", answer: "Just your photo ID (driver's licence). Registration papers help speed things up but aren't essential. We handle all vehicle transfer documentation." },
      { question: "Do I need to be home for the pickup?", answer: "Ideally yes, as we pay cash in person and need to verify your ID. However, we can sometimes make alternative arrangements — just ask when booking." }
    ]
  },
  {
    category: "Service Area & Availability",
    faqs: [
      { question: "What areas of Brisbane do you cover?", answer: "We cover all of Greater Brisbane — north to Caboolture, south to Beenleigh, west to Ipswich, and east to Cleveland. This includes Logan, Moreton Bay, Redland City, and Ipswich council areas." },
      { question: "Do you charge extra for outer suburbs?", answer: "No. Whether you're in the CBD or Caboolture, our service is the same price — free towing and competitive cash offers regardless of your location." },
      { question: "Are you available on weekends?", answer: "Yes. We operate 7 days a week, Monday to Sunday, 7am to 7pm. Weekend pickups are available across all service areas." },
      { question: "What happens to my car after you buy it?", answer: "Depending on condition, we either resell it, salvage usable parts, or responsibly recycle it at a licensed Queensland facility. All fluids and hazardous materials are disposed of according to EPA regulations." }
    ]
  }
];

export const allFaqs = faqCategories.flatMap(c => c.faqs);

export default function FAQPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main id="main-content" className="flex-1 mt-header-safe">
        <section className="bg-gradient-to-br from-primary via-primary to-primary/90 text-white py-16 lg:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent/[0.08] via-transparent to-transparent pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <Breadcrumbs items={breadcrumbs} light />
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-[1.1] mt-6 mb-6">
              Cash for Cars Brisbane — FAQ
            </h1>
            <p className="text-white/75 text-lg sm:text-xl leading-relaxed max-w-3xl">
              Everything you need to know about selling your car for cash in Brisbane. Can&apos;t find your answer? Call us on <a href={BUSINESS.phoneHref} className="text-accent hover:underline font-semibold">{BUSINESS.phone}</a>.
            </p>
          </div>
        </section>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 space-y-14">
          {faqCategories.map((category, idx) => (
            <div key={category.category}>
              <div className="flex items-center gap-3 mb-6">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm">{idx + 1}</span>
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground leading-snug">
                  {category.category}
                </h2>
              </div>
              <Accordion items={category.faqs.map(f => ({ question: f.question, answer: f.answer }))} />
            </div>
          ))}

          <div className="rounded-2xl border border-primary/10 bg-gradient-to-br from-primary/[0.05] via-primary/[0.02] to-accent/[0.03] p-5 sm:p-8 md:p-12 text-center">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-primary mb-3">Still Have Questions?</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Our Brisbane team is happy to help. Call us or visit our contact page.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={BUSINESS.phoneHref}
                className="inline-flex items-center justify-center gap-2 bg-accent text-white rounded-full py-3.5 px-7 font-semibold hover:bg-accent/90 shadow-md shadow-accent/20 hover:shadow-lg hover:shadow-accent/25 transition-all"
              >
                <Phone className="h-4 w-4" />
                Call {BUSINESS.phone}
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 border-2 border-primary/20 text-primary rounded-full py-3.5 px-7 font-semibold hover:bg-primary hover:text-white hover:border-primary transition-all"
              >
                <MessageCircle className="h-4 w-4" />
                Contact Us
              </Link>
            </div>
          </div>
        </div>

        <InternalLinks />
      </main>

      <Footer />
    </div>
  );
}
