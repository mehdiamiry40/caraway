"use client";

import { Component, type ReactNode } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error(
      "[error-boundary]",
      JSON.stringify({
        digest: (error as Error & { digest?: string }).digest,
        message: error.message,
        name: error.name,
        route: typeof window !== "undefined" ? window.location.pathname : undefined,
        componentStack: info.componentStack,
      }),
    );
  }

  private handleReset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col min-h-screen">
          <Header />
          <main
            id="main-content"
            className="flex-1 mt-header-safe flex items-center justify-center px-4"
          >
            <div className="text-center max-w-md py-20">
              <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-4">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-display text-primary mb-3">
                Something went wrong
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                We hit an unexpected error. Please try again, or head back home.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={this.handleReset}
                  className={cn(buttonVariants({ size: "lg" }), "min-w-[140px]")}
                >
                  Try again
                </button>
                <Link
                  href="/"
                  className={cn(
                    buttonVariants({ size: "lg", variant: "outline" }),
                    "min-w-[140px]",
                  )}
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

    return this.props.children;
  }
}
