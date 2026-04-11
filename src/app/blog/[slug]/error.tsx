"use client";

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
  if (process.env.NODE_ENV === "development") {
    console.error(error);
  }
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 mt-header-safe flex items-center justify-center px-4">
        <div className="text-center max-w-md py-20">
          <h1 className="text-3xl font-display font-bold text-primary mb-3">
            Something went wrong
          </h1>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            We couldn&apos;t load this post. Please try again, or{" "}
            <Link href="/blog" className="text-primary font-semibold underline underline-offset-2">
              browse all posts
            </Link>.
          </p>
          <button
            onClick={reset}
            className="inline-flex items-center justify-center rounded-xl h-11 px-8 text-sm font-semibold bg-primary text-white shadow-md hover:bg-primary/90 hover:shadow-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Try again
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
