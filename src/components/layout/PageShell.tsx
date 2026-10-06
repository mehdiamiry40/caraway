import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/sections/Breadcrumbs";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageShellProps {
  breadcrumbs: BreadcrumbItem[];
  title: string;
  subtitle?: ReactNode;
  eyebrow?: string;
  /** Optional icon shown above the title in place of extra intro copy. */
  icon?: LucideIcon;
  children: ReactNode;
  /** Render the hero on the aurora surface (default) or a plain background. */
  heroVariant?: "aurora" | "plain";
}

export function PageShell({
  breadcrumbs,
  title,
  subtitle,
  eyebrow,
  icon: Icon,
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
              ? "relative overflow-hidden bg-secondary py-10 sm:py-14 lg:py-16 border-b border-border before:absolute before:inset-x-0 before:top-0 before:h-1 before:bg-gradient-to-r before:from-cta before:via-accent before:to-primary"
              : "bg-background py-8 sm:py-12 lg:py-14"
          }
        >
          <div className="site-container relative">
            <Breadcrumbs items={breadcrumbs} />
            {Icon && (
              <span className="mt-6 flex h-12 w-12 items-center justify-center bg-primary text-primary-foreground">
                <Icon className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />
              </span>
            )}
            {eyebrow && <p className={`eyebrow mb-4 ${Icon ? "mt-4" : "mt-6"}`}>{eyebrow}</p>}
            <h1
              className="font-display font-bold text-[clamp(2.25rem,5.5vw,3.75rem)] leading-[1.08] text-primary text-balance max-w-4xl mt-4 mb-5"
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
