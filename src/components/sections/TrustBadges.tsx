import { Building2, Clock3, Recycle, ShieldCheck } from "lucide-react";
import { BUSINESS } from "@/lib/site";

const badges = [
  {
    icon: ShieldCheck,
    label: "Fully insured",
    detail: "Public liability and goods-in-transit cover on every pickup.",
  },
  {
    icon: Recycle,
    label: "Licensed recycler",
    detail: "EPA-compliant handling for scrap, damaged, and end-of-life vehicles.",
  },
  {
    icon: Clock3,
    label: "7 days a week",
    detail: `${BUSINESS.hours} for calls and quotes across Greater Brisbane.`,
  },
  {
    icon: Building2,
    label: "ABN registered",
    detail: `Caraway Pty Ltd · ABN ${BUSINESS.abn}`,
  },
] as const;

export function TrustBadges() {
  return (
    <section
      className="relative overflow-hidden py-12 text-primary-foreground [background:var(--footer-wash)] sm:py-16"
      aria-label="Trust and credentials"
    >
      <div aria-hidden="true" className="absolute inset-0 opacity-60 [background:radial-gradient(circle_at_top,hsl(var(--accent)/0.2),transparent_38%)]" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 max-w-2xl">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-primary-foreground/65">
            Credentials
          </p>
          <h2 className="mt-3 text-2xl font-display font-bold tracking-tight text-primary-foreground sm:text-3xl">
            Real operator details, not vague promises.
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {badges.map(({ icon: Icon, label, detail }) => (
            <div
              key={label}
              className="rounded-[1.5rem] border border-white/10 bg-white/6 px-5 py-5 backdrop-blur-sm"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/8 text-accent">
                <Icon className="h-5 w-5" strokeWidth={1.85} aria-hidden="true" />
              </div>
              <p className="mt-4 font-display text-lg font-semibold tracking-tight text-primary-foreground">
                {label}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-primary-foreground/75">
                {detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
