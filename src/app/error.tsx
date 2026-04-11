"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.error("Root error:", error);
    }
  }, [error]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main id="main-content" className="flex-1 mt-header-safe flex items-center justify-center px-4">
        <div className="text-center max-w-md py-20">
          <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-4">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-display font-bold text-primary mb-3">
            Something went wrong
          </h1>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            We hit an unexpected error. Please try again, or head back home.
          </p>
          {error.digest && (
            <p className="text-xs text-muted-foreground mb-6">
              Reference: <code className="font-mono">{error.digest}</code>
            </p>
          )}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={reset}
              className={cn(buttonVariants({ size: "lg" }), "min-w-[140px]")}
            >
              Try again
            </button>
            <Link
              href="/"
              className={cn(buttonVariants({ size: "lg", variant: "outline" }), "min-w-[140px]")}
            >
              Go home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
