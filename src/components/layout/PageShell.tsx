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
              ? "bg-primary text-white py-16 lg:py-24"
              : "bg-white py-12 lg:py-16"
          }
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Breadcrumbs items={breadcrumbs} light={isPrimary} />
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-[1.1] mt-6 mb-6">
              {title}
            </h1>
            {subtitle && (
              <div
                className={
                  isPrimary
                    ? "text-white/85 text-lg sm:text-xl leading-relaxed max-w-3xl"
                    : "text-muted-foreground text-lg sm:text-xl leading-relaxed max-w-3xl"
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
