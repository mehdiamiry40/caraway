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
    <section
      className="relative bg-background"
      aria-label="Trust and credentials"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 border-y border-border/60">
        <ul className="flex flex-wrap items-center justify-center gap-x-8 sm:gap-x-14 gap-y-4">
          {badges.map(({ icon: Icon, label, detail }) => (
            <li
              key={label}
              className="flex items-center gap-3 text-muted-foreground"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                <Icon className="h-4.5 w-4.5" strokeWidth={1.5} aria-hidden="true" size={18} />
              </span>
              <span className="flex flex-col leading-tight">
                <span className="text-sm font-medium text-foreground">
                  {label}
                </span>
                <span className="text-xs text-muted-foreground/80">
                  {detail}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
