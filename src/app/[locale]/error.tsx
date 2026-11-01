"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";
import { Link } from "@/i18n/navigation";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to an error reporting service if configured
    console.error("Unhandled client error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400">
        <AlertTriangle className="h-8 w-8" />
      </div>

      <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        Something went wrong!
      </h1>
      <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground sm:text-base">
        An unexpected error occurred while loading this page. Please try again or return to the homepage.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow transition-colors hover:bg-primary/90"
        >
          <RefreshCcw className="h-4 w-4" />
          <span>Try again</span>
        </button>

        <Link
          href="/"
          className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-accent"
        >
          <Home className="h-4 w-4" />
          <span>Go to Home</span>
        </Link>
      </div>
    </div>
  );
}

