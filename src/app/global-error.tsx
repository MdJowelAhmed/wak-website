"use client";

import { AlertTriangle, RefreshCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-16 text-center text-gray-900 antialiased dark:bg-gray-950 dark:text-gray-100">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400">
          <AlertTriangle className="h-8 w-8" />
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Application Error
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-gray-600 sm:text-base dark:text-gray-400">
          A critical system error occurred. Our engineering team has been notified.
        </p>

        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-orange-600 px-6 py-3 text-sm font-semibold text-white shadow transition-all hover:bg-orange-700 active:scale-95"
          >
            <RefreshCcw className="h-4 w-4" />
            <span>Reload Application</span>
          </button>
        </div>
      </body>
    </html>
  );
}

