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
  children: ReactNode;
  /** Render the section as full-width with a darker background. Default: true (teal hero) */
  heroVariant?: "primary" | "white";
}

export function PageShell({
  breadcrumbs,
  title,
  subtitle,
  children,
  heroVariant = "primary",
}: PageShellProps) {
  const isPrimary = heroVariant === "primary";
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-1 mt-header-safe">
        <section
          className={
            isPrimary
              ? "bg-primary text-white py-14 sm:py-20 lg:py-28"
              : "bg-white py-10 sm:py-14 lg:py-20"
          }
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Breadcrumbs items={breadcrumbs} light={isPrimary} />
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-[1.1] tracking-tight mt-5 mb-4 sm:mb-6">
              {title}
            </h1>
            {subtitle && (
              <div
                className={
                  isPrimary
                    ? "text-white/85 text-lg sm:text-xl leading-relaxed max-w-3xl text-balance"
                    : "text-muted-foreground text-lg sm:text-xl leading-relaxed max-w-3xl text-balance"
                }
              >
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
