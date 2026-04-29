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
  /** Backwards-compatible prop, kept so existing call-sites still type-check. */
  heroVariant?: "aurora" | "plain";
}

export function PageShell({
  breadcrumbs,
  title,
  subtitle,
  eyebrow,
  children,
}: PageShellProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-1 mt-header-safe">
        <section className="bg-background py-10 sm:py-14 lg:py-16 border-b border-border">
          <div className="site-container">
            <Breadcrumbs items={breadcrumbs} />
            {eyebrow && <p className="eyebrow mt-6 mb-3">{eyebrow}</p>}
            <h1
              className="font-medium text-[clamp(2rem,5vw,3rem)] leading-tight text-foreground text-balance max-w-3xl mt-4 mb-4"
              style={{ letterSpacing: "var(--tracking-display)" }}
            >
              {title}
            </h1>
            {subtitle && (
              <div className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-2xl">
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
