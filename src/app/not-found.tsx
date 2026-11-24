import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export const metadata: Metadata = {
  title: { absolute: "Page not found — Caraway" },
  description:
    "We couldn't find that page. Go to Caraway's home page to get a quote.",
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
        className="on-band flex-1 w-full bg-primary text-on-dark-hi"
      >
        <div className="site-container py-16 sm:py-24">
          <div className="max-w-xl">
            <p className="eyebrow-on-dark">
              <span>404</span>
            </p>
            <h1 className="type-h1 mt-2 text-on-dark-hi">
              Page not found
            </h1>
            <p className="type-lead mt-4 max-w-md text-on-dark-hi">
              That address doesn&apos;t match anything on our site. Try the
              home page or browse our services to find cash for cars in your area.
            </p>
            <div className="mt-8 flex flex-col flex-wrap gap-3 sm:flex-row">
              <Link
                href="/"
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "ring-offset-primary touch-manipulation",
                )}
              >
                Back to home
              </Link>
              <Link
                href="/"
                className={cn(
                  buttonVariants({ variant: "outlineOnDark" }),
                  "ring-offset-primary touch-manipulation",
                )}
              >
                Our services
              </Link>
              <Link
                href="/locations"
                className={cn(
                  buttonVariants({ variant: "outlineOnDark" }),
                  "ring-offset-primary touch-manipulation",
                )}
              >
                Find your suburb
              </Link>
              <Link
                href="/contact"
                className={cn(
                  buttonVariants({ variant: "outlineOnDark" }),
                  "ring-offset-primary touch-manipulation",
                )}
              >
                Contact us
              </Link>
            </div>
            <p className="mt-8 border-t border-on-dark-hi/40 pt-5 text-base text-on-dark-hi">
              Need help?{" "}
              <Link
                href="/#quote-form"
                className="font-bold text-on-dark-hi underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
              >
                Get my quote
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
