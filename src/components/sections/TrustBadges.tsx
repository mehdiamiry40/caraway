import { Check, ShieldCheck, Recycle, Building2 } from "lucide-react";
import { BUSINESS } from "@/lib/site";

const credentials = [
  {
    icon: ShieldCheck,
    label: "Fully insured",
  },
  {
    icon: Recycle,
    label: "Licensed recycler",
  },
  {
    icon: Building2,
    label: `ABN ${BUSINESS.abn}`,
  },
] as const;

const quickPromises = [
  "Free pickup, every postcode",
  "No paperwork headaches",
  "Firm offer, no haggling",
  "Any make or condition",
];

export function TrustBadges() {
  return (
    <section
      className="relative bg-background border-b border-border/70"
      aria-label="Trust and credentials"
    >
      <div className="site-container py-8 sm:py-10">
        {/* Row 1 — four quick promise items separated by green checks */}
        <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 sm:gap-x-10">
          {quickPromises.map((p) => (
            <li
              key={p}
              className="flex items-center gap-2.5 text-sm sm:text-base font-medium text-foreground/85"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cta/15 text-cta">
                <Check size={14} strokeWidth={3} aria-hidden="true" />
              </span>
              {p}
            </li>
          ))}
        </ul>

        {/* Row 2 — credential pills, tiny, muted */}
        <ul className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {credentials.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-primary"
            >
              <Icon size={13} strokeWidth={2} aria-hidden="true" />
              {label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
