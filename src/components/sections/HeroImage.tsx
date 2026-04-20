import Image from "next/image";
import { DollarSign, Star, CheckCircle2 } from "lucide-react";

export function HeroImage() {
  return (
    <div className="relative w-full mx-auto max-w-[600px]">
      {/* Soft radial glow behind the frame */}
      <div
        aria-hidden="true"
        className="absolute inset-x-10 inset-y-14 rounded-[2rem] bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.22),transparent_70%)] blur-3xl"
      />

      {/* Main image frame */}
      <div className="relative w-full aspect-[4/3] rounded-[20px] overflow-hidden border border-border bg-card shadow-[0_1px_2px_hsl(var(--shadow-color)/0.06),0_18px_40px_-12px_hsl(var(--shadow-color)/0.22),0_48px_96px_-24px_hsl(var(--shadow-color)/0.28)]">
        <Image
          src="/images/tow-truck-hero.webp"
          alt="Caraway flatbed tow truck collecting a customer's car for cash in Brisbane — same-day pickup with free towing across Greater Brisbane"
          title="Caraway cash for cars Brisbane — free pickup"
          fill
          sizes="(max-width: 640px) 92vw, (max-width: 1024px) 90vw, 560px"
          className="object-cover"
          priority
          fetchPriority="high"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--ink)/0.25)] via-transparent to-transparent"
        />
      </div>

      {/* Floating offer chip — top-right */}
      <div
        className="hidden sm:flex absolute -top-4 -right-4 items-center gap-3 rounded-2xl bg-card border border-border px-4 py-3 shadow-[0_1px_2px_hsl(var(--shadow-color)/0.06),0_12px_32px_-10px_hsl(var(--shadow-color)/0.25)]"
        aria-hidden="true"
      >
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-success/10 text-success">
          <DollarSign className="h-4 w-4" strokeWidth={2.5} />
        </span>
        <div>
          <p className="text-[0.75rem] text-muted-foreground">Latest firm offer</p>
          <p className="font-display font-semibold text-[0.9375rem] text-foreground font-mono tabular-nums">$3,240</p>
        </div>
      </div>

      {/* Floating review chip — bottom-left */}
      <div
        className="hidden sm:flex absolute -bottom-5 -left-4 items-center gap-2.5 rounded-2xl bg-card border border-border px-4 py-2.5 shadow-[0_1px_2px_hsl(var(--shadow-color)/0.06),0_12px_32px_-10px_hsl(var(--shadow-color)/0.25)]"
        aria-hidden="true"
      >
        <div className="flex gap-0.5 text-accent">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="h-3.5 w-3.5 fill-current" />
          ))}
        </div>
        <div>
          <p className="text-[0.75rem] text-muted-foreground leading-tight">Google reviews</p>
          <p className="text-[0.8125rem] font-semibold text-foreground leading-tight inline-flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3 text-success" strokeWidth={2.5} />
            Verified 4.9 stars
          </p>
        </div>
      </div>
    </div>
  );
}
