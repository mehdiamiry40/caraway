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
      <div className="site-container py-8 sm:py-10 border-y border-border">
        <ul className="flex flex-wrap items-center justify-center gap-x-8 sm:gap-x-14 gap-y-4">
          {badges.map(({ icon: Icon, label, detail }) => (
            <li
              key={label}
              className="flex items-center gap-3 text-foreground/80"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary shrink-0">
                <Icon className="h-[18px] w-[18px]" strokeWidth={2} aria-hidden="true" />
              </span>
              <span className="flex flex-col leading-tight">
                <span className="text-sm font-bold text-foreground">
                  {label}
                </span>
                <span className="text-xs text-foreground/70 font-medium">
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
