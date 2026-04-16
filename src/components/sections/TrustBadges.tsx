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
    <section className="relative overflow-hidden py-10 sm:py-16 text-primary-foreground [background:var(--footer-wash)]" aria-label="Trust and credentials">
      <div aria-hidden="true" className="absolute inset-0 opacity-60 [background:radial-gradient(circle_at_top,hsl(var(--accent)/0.2),transparent_38%)]" />
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
          {badges.map(({ icon: Icon, label, detail }) => (
            <div
              key={label}
              className="flex flex-col items-center text-center gap-2 sm:px-6"
            >
              <Icon className="h-6 w-6 text-accent" strokeWidth={1.75} aria-hidden="true" />
              <span className="mt-1 font-display font-semibold text-sm tracking-tight text-primary-foreground">{label}</span>
              <span className="text-xs text-primary-foreground/80 leading-snug">{detail}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
