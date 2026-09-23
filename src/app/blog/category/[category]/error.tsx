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
      <main id="main-content" tabIndex={-1} className="flex-1 mt-header-safe flex items-center justify-center px-4">
        <div className="text-center max-w-md py-20">
          <h1 className="mb-3 text-3xl font-semibold tracking-[-0.02em] text-foreground">
            We couldn&apos;t load this category
          </h1>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            We couldn&apos;t load this category. Please try again, or{" "}
            <Link href="/blog" className="text-primary underline underline-offset-2">
              browse all posts
            </Link>.
          </p>
          <button
            onClick={reset}
            className={cn(buttonVariants({ size: "lg" }), "min-w-[140px]")}
          >
            Try again
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
