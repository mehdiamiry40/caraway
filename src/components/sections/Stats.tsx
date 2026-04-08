import { CalendarDays, MapPin, Truck, Banknote } from "lucide-react";

/** Service promises — not audited financial or volume statistics. */
const stats = [
  { value: "7 days", label: "Phone & online quotes", icon: CalendarDays },
  { value: "Greater Brisbane", label: "Pickup arranged with you", icon: MapPin },
  { value: "$0", label: "Towing when we buy", icon: Truck },
  { value: "Cash", label: "Paid on collection", icon: Banknote },
];

export function Stats() {
  return (
    <section className="relative bg-white border-b border-border/40" aria-label="What to expect">
      {/* Subtle top accent line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" aria-hidden />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="group relative flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left gap-4"
              >
                {/* Vertical divider between items (hidden on first, hidden on mobile for odd items) */}
                {index > 0 && (
                  <div className="hidden lg:block absolute -left-3 top-1/2 -translate-y-1/2 h-10 w-px bg-border/60" aria-hidden />
                )}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/5 border border-primary/10 group-hover:bg-primary/10 group-hover:border-primary/20 transition-colors duration-300">
                  <Icon className="h-5 w-5 text-primary" strokeWidth={1.75} />
                </div>
                <div className="min-w-0">
                  <p className="text-lg sm:text-xl font-display font-bold text-primary leading-tight">
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1 leading-snug">
                    {stat.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
