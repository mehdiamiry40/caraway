"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

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
          <h1 className="text-3xl font-display text-primary mb-3">
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
            className="inline-flex items-center justify-center rounded-xl h-11 px-8 text-sm bg-primary text-primary-foreground shadow-md hover:bg-primary/90 hover:shadow-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Try again
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
