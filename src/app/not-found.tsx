import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Home, MapPin, Calculator, Car } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found | Caraway",
  description:
    "The page you requested could not be found. Return to Caraway's home page to request a cash offer.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main
        id="main-content"
        className="flex-1 mt-header-safe w-full flex items-center justify-center bg-muted px-4 sm:px-6"
      >
        <div className="w-full max-w-lg text-center py-16 sm:py-20">
          <div className="w-20 h-20 rounded-full bg-primary/[0.06] flex items-center justify-center mx-auto mb-8">
            <span className="text-4xl font-display font-bold text-primary/40">404</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-4">
            Page not found
          </h1>
          <p className="text-muted-foreground leading-relaxed mb-10 max-w-sm mx-auto">
            That address doesn&apos;t match anything on our site. Try the
            home page or browse our services to find cash for cars in your area.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center flex-wrap">
            <Link
              href="/"
              className={cn(
                buttonVariants({ variant: "default" }),
                "inline-flex items-center gap-2 justify-center min-h-[44px] touch-manipulation",
              )}
            >
              <Home className="h-4 w-4" />
              Back to home
            </Link>
            <Link
              href="/cash-for-cars-brisbane"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "inline-flex items-center gap-2 justify-center min-h-[44px] touch-manipulation",
              )}
            >
              <Car className="h-4 w-4" />
              Our services
            </Link>
            <Link
              href="/locations"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "inline-flex items-center gap-2 justify-center min-h-[44px] touch-manipulation",
              )}
            >
              <MapPin className="h-4 w-4" />
              Find your suburb
            </Link>
          </div>
          <div className="mt-10 pt-8 border-t border-border/30">
            <p className="text-sm text-muted-foreground">
              Need help?{" "}
              <Link
                href="/#price-estimator"
                className="text-primary font-semibold hover:text-accent transition-colors inline-flex items-center gap-1"
              >
                <Calculator className="h-3.5 w-3.5" />
                Get an instant quote
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
