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
    </div>
  );
}
