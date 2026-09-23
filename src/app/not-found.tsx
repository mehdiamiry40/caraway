import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export const metadata: Metadata = {
  title: { absolute: "Page not found — Caraway" },
  description:
    "The page you requested could not be found. Return to Caraway's home page to request a cash offer.",
  // Explicitly override the root index directive; Next also injects a noindex
  // tag for 404 responses, and both signals must agree.
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main
        id="main-content"
        className="flex-1 mt-header-safe w-full"
      >
        <div className="site-container py-24 sm:py-32">
          <p className="eyebrow mb-4">404</p>
          <h1 className="mb-4 text-4xl font-semibold tracking-[-0.02em] text-foreground sm:text-5xl">
            Page not found
          </h1>
          <p className="mb-10 max-w-md text-lg text-muted-foreground">
            That address doesn&apos;t match anything on our site. Try the
            home page or browse our services to find cash for cars in your area.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6">
            <Link
              href="/"
              className={cn(
                buttonVariants({ variant: "default" }),
                "touch-manipulation",
              )}
            >
              Back to home
            </Link>
            <Link
              href="/cash-for-cars-brisbane"
              className={cn(
                buttonVariants({ variant: "link" }),
                "touch-manipulation",
              )}
            >
              Our services
            </Link>
            <Link
              href="/locations"
              className={cn(
                buttonVariants({ variant: "link" }),
                "touch-manipulation",
              )}
            >
              Find your suburb
            </Link>
            <Link
              href="/contact"
              className={cn(
                buttonVariants({ variant: "link" }),
                "touch-manipulation",
              )}
            >
              Contact us
            </Link>
          </div>
          <div className="mt-10 pt-8 border-t border-border/30">
            <p className="text-sm text-muted-foreground">
              Need help?{" "}
              <Link
                href="/#quote-form"
                className="text-primary link-underline"
              >
                Request a quote
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
