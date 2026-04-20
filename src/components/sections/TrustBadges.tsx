import { ShieldCheck, Recycle, Building2, BadgeCheck } from "lucide-react";
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
  {
    icon: BadgeCheck,
    label: "No obligation",
    detail: "Free quote, yours to accept",
  },
] as const;

export function TrustBadges() {
  return (
    <section
      className="relative bg-card border-y border-border"
      aria-label="Trust and credentials"
    >
      <div className="site-container py-8 sm:py-10">
        <ul className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-5">
          {badges.map(({ icon: Icon, label, detail }) => (
            <li
              key={label}
              className="flex items-center gap-3.5"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/[0.06] text-primary ring-1 ring-primary/10">
                <Icon className="h-[18px] w-[18px]" strokeWidth={2} aria-hidden="true" />
              </span>
              <span className="flex min-w-0 flex-col leading-tight">
                <span className="text-[0.9375rem] font-semibold text-foreground">{label}</span>
                <span className="text-[0.8125rem] text-muted-foreground mt-0.5">{detail}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
