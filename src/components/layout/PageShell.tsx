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
   * Optional line above the title. Leave it out when it would only repeat
   * the last breadcrumb — the title band already says where the reader is.
   */
  eyebrow?: string;
  children: ReactNode;
}

/** Inner-page frame: header, a blue title band with white type, the page. */
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
      <main id="main-content" tabIndex={-1} className="flex-1 focus-visible:outline-none">
        <section className="on-band page-band section-y-hero">
          <div className="site-container">
            <Breadcrumbs items={breadcrumbs} light />
            {eyebrow && <p className="eyebrow-on-dark mt-6">{eyebrow}</p>}
            <h1 className={`type-h1 max-w-4xl text-on-dark-hi ${eyebrow ? "mt-1.5" : "mt-5"}`}>
              {title}
            </h1>
            {subtitle && (
              <div className="type-lead page-band-lead mt-4 max-w-3xl text-on-dark-hi">
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
