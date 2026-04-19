import Image from "next/image";
import { ShieldCheck, Timer } from "lucide-react";

export function HeroImage() {
  return (
    <div className="relative w-full max-w-[560px] mx-auto">
      {/* Decorative gradient halo */}
      <div
        aria-hidden="true"
        className="absolute -inset-8 rounded-[3rem] bg-[radial-gradient(ellipse_at_30%_30%,hsl(var(--grad-violet)/0.30),transparent_60%),radial-gradient(ellipse_at_75%_75%,hsl(var(--grad-pink)/0.22),transparent_60%)] blur-3xl"
      />

      {/* Decorative dotted grid (top-right) */}
      <div
        aria-hidden="true"
        className="absolute -top-4 -right-4 h-24 w-24 opacity-60 hidden sm:block"
        style={{
          backgroundImage:
            "radial-gradient(circle, hsl(var(--primary) / 0.30) 1px, transparent 1px)",
          backgroundSize: "10px 10px",
          maskImage: "radial-gradient(circle, black 60%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(circle, black 60%, transparent 100%)",
        }}
      />

      {/* Image card */}
      <div className="relative aspect-[4/5] sm:aspect-[5/6] rounded-[2rem] overflow-hidden ring-1 ring-[hsl(var(--shadow-color)/0.08)] bg-card shadow-[0_2px_4px_hsl(var(--shadow-color)/0.06),0_24px_48px_hsl(var(--shadow-color)/0.10),0_64px_120px_-24px_hsl(var(--shadow-color)/0.22)]">
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
          className="absolute inset-0 bg-gradient-to-tr from-[hsl(var(--ink)/0.32)] via-transparent to-[hsl(var(--grad-violet)/0.14)]"
        />
      </div>

      {/* Top-right "quote in ~60s" floating chip */}
      <div
        className="absolute -top-3 -right-3 sm:-top-4 sm:-right-5 rotate-[4deg] rounded-2xl bg-card border border-border shadow-[0_12px_28px_hsl(var(--shadow-color)/0.12)] pl-2.5 pr-3.5 py-2 flex items-center gap-2.5"
        aria-hidden="true"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-success/10 text-success">
          <Timer className="h-4.5 w-4.5" strokeWidth={1.75} size={18} />
        </span>
        <div className="leading-tight">
          <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
            Avg. quote
          </p>
          <p className="text-sm font-bold text-foreground tabular-nums">~60 seconds</p>
        </div>
      </div>

      {/* Bottom-left "offer sent" terminal-style card */}
      <div
        className="absolute -bottom-5 -left-3 sm:-bottom-6 sm:-left-6 rotate-[-2deg] quote-card w-[min(280px,80%)] px-4 py-3 text-[0.8125rem]"
        aria-hidden="true"
      >
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#FF5F56]" />
          <span className="h-2 w-2 rounded-full bg-[#FFBD2E]" />
          <span className="h-2 w-2 rounded-full bg-[#27C93F]" />
          <span className="ml-auto text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-[hsl(var(--on-dark))]">
            Offer sent
          </span>
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="text-[hsl(var(--on-dark))]">2011 Toyota Camry</span>
          <span className="font-mono tabular-nums text-base font-medium text-[hsl(var(--on-dark-hi))]">
            $3,450
          </span>
        </div>
      </div>

      {/* Bottom-right "insured pickup" pill */}
      <div
        className="absolute bottom-2 -right-2 sm:bottom-6 sm:-right-4 rotate-[3deg] rounded-full bg-card border border-border shadow-[0_10px_22px_hsl(var(--shadow-color)/0.10)] px-3 py-1.5 flex items-center gap-1.5"
        aria-hidden="true"
      >
        <ShieldCheck className="h-3.5 w-3.5 text-primary" strokeWidth={2} />
        <span className="text-[11px] font-semibold text-foreground whitespace-nowrap">
          Insured pickup
        </span>
      </div>
    </div>
  );
}
