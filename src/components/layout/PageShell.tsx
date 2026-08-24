import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/sections/Breadcrumbs";
import type { ReactNode } from "react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageShellProps {
  breadcrumbs: BreadcrumbItem[];
  title: string;
  subtitle?: ReactNode;
  eyebrow?: string;
  children: ReactNode;
  /** Render the hero on the aurora surface (default) or a plain background. */
  heroVariant?: "aurora" | "plain";
}

export function PageShell({
  breadcrumbs,
  title,
  subtitle,
  eyebrow,
  children,
  heroVariant = "aurora",
}: PageShellProps) {
  const isAurora = heroVariant === "aurora";
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-1 mt-header-safe">
        <section
          className={
            isAurora
              ? "relative overflow-hidden border-b border-border bg-ink-deep bg-cover bg-center py-16 text-on-dark-hi lg:py-20"
              : "bg-background py-8 sm:py-12 lg:py-14"
          }
          style={
            isAurora
              ? {
                  backgroundImage:
                    "linear-gradient(90deg, rgba(6,26,57,.94), rgba(10,47,104,.76) 62%, rgba(69,5,22,.26)), url('/images/tow-truck-hero.webp')",
                }
              : undefined
          }
        >
          <div className="site-container relative z-10">
            <Breadcrumbs items={breadcrumbs} light={isAurora} />
            {eyebrow && <p className={isAurora ? "t-index mt-6 text-cta-bright" : "t-index mt-6 text-accent-ink"}>{eyebrow}</p>}
            <h1
              className={`font-display text-[clamp(2.25rem,5.5vw,3.75rem)] font-medium leading-[1.04] text-balance max-w-3xl mt-5 mb-5 ${isAurora ? "text-on-dark-hi" : "text-foreground"}`}
              style={{ letterSpacing: "var(--tracking-display)" }}
            >
              {title}
            </h1>
            {subtitle && (
              <div className={`text-lg sm:text-xl leading-relaxed max-w-2xl ${isAurora ? "text-on-dark-hi/80" : "text-muted-foreground"}`}>
                {subtitle}
              </div>
            )}
          </div>
        </section>
        {children}
      </main>
      <Footer />
    </div>
  );
}
