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
              ? "border-b border-border py-12 sm:py-16 lg:py-24"
              : "py-10 sm:py-14 lg:py-16"
          }
        >
          <div className="site-container">
            <Breadcrumbs items={breadcrumbs} />
            {eyebrow && <p className="eyebrow mt-8 mb-4">{eyebrow}</p>}
            <h1 className="mt-4 mb-5 max-w-4xl text-4xl font-semibold leading-[1.05] tracking-[-0.02em] text-foreground text-balance sm:text-5xl">
              {title}
            </h1>
            {subtitle && (
              <div className="max-w-[40rem] text-lg text-muted-foreground">
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
