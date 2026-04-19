import Image from "next/image";

export function HeroImage() {
  return (
    <div className="relative w-full">
      <div
        aria-hidden="true"
        className="absolute inset-x-6 inset-y-10 rounded-[2rem] bg-[radial-gradient(ellipse_at_center,hsl(var(--grad-violet)/0.38),transparent_70%)] blur-3xl"
      />

      <div
        className="relative mx-auto w-full max-w-[580px] aspect-[4/3] rounded-2xl overflow-hidden ring-1 ring-[hsl(var(--shadow-color)/0.08)] bg-card shadow-[0_1px_2px_hsl(var(--shadow-color)/0.04),0_12px_28px_hsl(var(--shadow-color)/0.08),0_48px_96px_-16px_hsl(var(--shadow-color)/0.18)]"
      >
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
          className="absolute inset-0 bg-gradient-to-tr from-[hsl(var(--ink)/0.22)] via-transparent to-[hsl(var(--grad-violet)/0.14)]"
        />
      </div>

      <div
        className="absolute -bottom-4 left-3 sm:-bottom-6 sm:left-10 quote-card w-[min(240px,76%)] sm:w-[min(260px,72%)] px-3 py-2.5 sm:px-4 sm:py-3 text-[0.75rem] sm:text-[0.8125rem]"
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
    </div>
  );
}
