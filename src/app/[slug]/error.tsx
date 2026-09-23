"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(
      "[error-boundary]",
      JSON.stringify({
        digest: error.digest,
        message: error.message,
        name: error.name,
        route: typeof window !== "undefined" ? window.location.pathname : undefined,
      }),
    );
  }, [error]);
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main id="main-content" className="flex-1 mt-header-safe flex items-center justify-center px-4">
        <div className="text-center max-w-md py-20">
          <h1 className="text-3xl font-display text-primary mb-3">
            We couldn&apos;t load this page
          </h1>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Something went wrong on our end. Please try again, or head back home.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={reset}
              className={cn(buttonVariants({ size: "lg" }), "min-w-[140px]")}
            >
              Try again
            </button>
            <Link
              href="/"
              className={cn(buttonVariants({ size: "lg", variant: "link" }), "min-w-[140px]")}
            >
              Back to home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
