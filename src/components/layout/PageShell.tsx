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
              ? "aurora-surface py-14 sm:py-20 lg:py-24"
              : "bg-background py-10 sm:py-14 lg:py-20"
          }
        >
          <div className="site-container relative">
            <Breadcrumbs items={breadcrumbs} />
            {eyebrow && <p className="eyebrow mt-6 mb-4">{eyebrow}</p>}
            <h1
              className="font-display text-[clamp(2.25rem,5.5vw,3.75rem)] leading-[1.05] text-foreground text-balance max-w-3xl mt-4 mb-5"
              style={{ letterSpacing: "var(--tracking-display)" }}
            >
              {title}
            </h1>
            {subtitle && (
              <div className="text-muted-foreground text-lg sm:text-xl leading-relaxed max-w-2xl">
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
