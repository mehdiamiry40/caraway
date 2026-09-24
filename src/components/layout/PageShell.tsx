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
              ? "relative overflow-hidden bg-secondary py-12 sm:py-16 lg:py-20"
              : "bg-background py-8 sm:py-12 lg:py-14"
          }
        >
          <div className="site-container relative">
            <Breadcrumbs items={breadcrumbs} />
            {eyebrow && <p className="eyebrow mt-6 mb-4">{eyebrow}</p>}
            <h1
              className="font-display text-[clamp(2.25rem,5vw,3.5rem)] leading-[1.12] text-primary text-balance max-w-4xl mt-5 mb-5"
              style={{ letterSpacing: "var(--tracking-display)" }}
            >
              {title}
            </h1>
            {subtitle && (
              <div className="text-primary/80 text-lg leading-relaxed max-w-2xl">
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
