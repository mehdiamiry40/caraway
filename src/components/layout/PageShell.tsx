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
  /**
   * Optional kicker above the title. Leave it out when it would only repeat
   * the last breadcrumb — the title band already says where the reader is.
   */
  eyebrow?: string;
  children: ReactNode;
  /** Render the title on the stone band (default) or on plain paper. */
  heroVariant?: "band" | "plain";
}

export function PageShell({
  breadcrumbs,
  title,
  subtitle,
  eyebrow,
  children,
  heroVariant = "band",
}: PageShellProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-1 mt-header-safe focus-visible:outline-none">
        <section
          className={
            heroVariant === "band"
              ? "page-band section-y-hero"
              : "bg-background section-y-hero"
          }
        >
          <div className="site-container">
            <Breadcrumbs items={breadcrumbs} />
            {eyebrow && <p className="eyebrow mt-7">{eyebrow}</p>}
            <h1 className={`type-h1 max-w-4xl text-primary ${eyebrow ? "mt-3" : "mt-6"}`}>
              {title}
            </h1>
            {subtitle && (
              <div className="type-lead mt-5 max-w-2xl text-foreground/80">
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
