import { ShieldCheck, Recycle, FileCheck, Building2, Star } from "lucide-react";
import { BUSINESS } from "@/lib/site";

const badges = [
  {
    icon: ShieldCheck,
    label: "Fully Insured",
    detail: "Public liability & goods-in-transit",
  },
  {
    icon: Recycle,
    label: "Licensed Recycler",
    detail: "EPA-compliant disposal",
  },
  {
    icon: FileCheck,
    label: "TMR Paperwork",
    detail: "Transfer handled for you",
  },
  {
    icon: Building2,
    label: "ABN Registered",
    detail: `ABN ${BUSINESS.abn}`,
  },
  {
    icon: Star,
    label: "Seller stories",
    detail: "Recent feedback on this page",
  },
] as const;

export function TrustBadges() {
  return (
    <section className="section-y" aria-label="Trust and credentials">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {badges.map(({ icon: Icon, label, detail }) => (
            <div
              key={label}
              className="flex flex-col items-center text-center gap-2 rounded-lg border border-border/60 bg-muted/40 p-4 sm:p-5"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
              </span>
              <span className="font-display font-bold text-sm text-foreground leading-tight">{label}</span>
              <span className="text-xs text-muted-foreground leading-snug">{detail}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
