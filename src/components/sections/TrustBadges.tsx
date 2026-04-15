import { ShieldCheck, Recycle, Building2 } from "lucide-react";
import { BUSINESS } from "@/lib/site";

const badges = [
  {
    icon: ShieldCheck,
    label: "Fully insured",
    detail: "Public liability & goods-in-transit",
  },
  {
    icon: Recycle,
    label: "Licensed recycler",
    detail: "EPA-compliant disposal",
  },
  {
    icon: Building2,
    label: "ABN registered",
    detail: `ABN ${BUSINESS.abn}`,
  },
] as const;

export function TrustBadges() {
  return (
    <section className="py-14 sm:py-20 border-y border-border/60" aria-label="Trust and credentials">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-4 divide-y sm:divide-y-0 sm:divide-x divide-border/60">
          {badges.map(({ icon: Icon, label, detail }) => (
            <div
              key={label}
              className="flex flex-col items-center text-center gap-2 pt-8 sm:pt-0 first:pt-0 sm:px-6"
            >
              <Icon className="h-6 w-6 text-primary/70" strokeWidth={1.75} aria-hidden="true" />
              <span className="mt-1 font-display font-semibold text-sm tracking-tight text-foreground">{label}</span>
              <span className="text-xs text-muted-foreground leading-snug">{detail}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
