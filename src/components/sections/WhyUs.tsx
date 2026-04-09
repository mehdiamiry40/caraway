import { Zap, ShieldCheck, CarFront, FileText, Check } from "lucide-react";

const reasons = [
  {
    icon: <Zap className="w-5 h-5" />,
    title: "Paid when we pick up",
    description: "We don't drive away with your keys until you've been paid the agreed amount.",
  },
  {
    icon: <CarFront className="w-5 h-5" />,
    title: "Towing's on us",
    description: "If we buy it, we bring the truck. No surprise deductions for collection in our service area.",
  },
  {
    icon: <ShieldCheck className="w-5 h-5" />,
    title: "Rough to written off",
    description: "Old daily drivers, damaged, unregistered, scrap — we'll tell you straight if it's a fit.",
  },
  {
    icon: <FileText className="w-5 h-5" />,
    title: "Transfer paperwork",
    description: "We handle the QLD transfer side so you're not stuck in a queue at the counter.",
  },
];

export function WhyUs() {
  return (
    <section id="why-us" className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          <div className="lg:col-span-5">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-primary mb-5 md:mb-6 leading-tight text-balance">
              Why Brisbane Sellers Choose Caraway
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Private buyers flake. Dealers lowball trade-ins. We&apos;re a buyer — you get one price, one pickup, done.
            </p>

            <ul className="space-y-3.5">
              {["Brisbane-based team", "Licensed removal & disposal partners", "Upfront if we're not interested"].map((item) => (
                <li key={item} className="flex items-center gap-3 text-foreground">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-primary shrink-0" strokeWidth={3} />
                  </div>
                  <span className="text-sm font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {reasons.map((reason) => (
              <div
                key={reason.title}
                className="group bg-white p-4 sm:p-6 rounded-2xl border border-border/60 hover:border-primary/20 transition-colors duration-200"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center mb-4 text-primary">
                  {reason.icon}
                </div>
                <h3 className="text-base font-display font-bold text-primary mb-2">{reason.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{reason.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
