"use client";

import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BUSINESS } from "@/lib/site";

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
      <main className="flex-1 mt-14 lg:mt-[104px] flex items-center justify-center px-4">
        <div className="text-center max-w-md py-20">
          <h1 className="text-3xl font-display font-bold text-primary mb-3">
            Something went wrong
          </h1>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            We couldn&apos;t load this location. Please try again, or call us at{" "}
            <a
              href={BUSINESS.phoneHref}
              className="text-primary font-semibold underline underline-offset-2"
            >
              {BUSINESS.phone}
            </a>.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={reset}
              className="inline-flex items-center justify-center rounded-full h-11 px-8 text-sm font-semibold bg-primary text-white hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Try again
            </button>
            <Link
              href="/locations"
              className="inline-flex items-center justify-center rounded-full h-11 px-8 text-sm font-semibold border-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              All locations
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
