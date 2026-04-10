import { MessageSquare, DollarSign, Truck, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: <MessageSquare className="w-6 h-6" />,
    title: "Tell us what it is",
    description: "Call or use the form — make, model, year, condition, suburb. Photos help if you have them.",
  },
  {
    icon: <DollarSign className="w-6 h-6" />,
    title: "Get a number",
    description: "We give a ballpark on the phone or after a quick call-back. Final figure is locked in before we send a truck.",
  },
  {
    icon: <Truck className="w-6 h-6" />,
    title: "We collect, you get paid",
    description: "Pickup time that suits you. Cash (or agreed payment method) before the vehicle leaves your place.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="section-y bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-18">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-primary text-balance">
            How Cash for Cars Works in Brisbane
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            We buy the car directly. If we&apos;re not the right fit, we&apos;ll say so — we&apos;d rather you know upfront than waste a day.
          </p>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <div className="hidden md:block absolute top-7 left-[calc(16.67%+28px)] right-[calc(16.67%+28px)] h-px bg-border z-0" aria-hidden />

          {steps.map((step, index) => (
            <div key={step.title} className="relative flex flex-col items-center text-center group">
              {index > 0 && (
                <div className="md:hidden flex items-center justify-center -mt-2 mb-2 text-primary/30" aria-hidden>
                  <ArrowRight className="w-5 h-5 rotate-90" />
                </div>
              )}
              <div className="relative mb-6 z-10">
                <div className="w-14 h-14 rounded-lg bg-muted border border-border/60 flex items-center justify-center text-primary group-hover:border-primary/30 transition-all duration-300">
                  {step.icon}
                </div>
                <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center ring-2 ring-white">
                  {index + 1}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-display font-bold text-primary mb-2 sm:mb-3">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed max-w-[300px] text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
