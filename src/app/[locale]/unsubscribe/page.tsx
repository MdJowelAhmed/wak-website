import { Suspense } from "react";
import type { Metadata } from "next";
import { Loader2 } from "lucide-react";
import UnsubscribeClient from "./UnsubscribeClient";

export const metadata: Metadata = {
  title: "Newsletter Unsubscribe",
  description: "Manage your newsletter subscription preferences.",
};

function UnsubscribeFallback() {
  return (
    <div className="relative w-full max-w-lg">
      <div className="rounded-3xl border border-white/10 bg-secondary/95 p-8 text-center text-white shadow-2xl backdrop-blur-xl sm:p-10">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <h1 className="mb-2 text-2xl font-bold tracking-tight text-white">Loading...</h1>
        <p className="text-sm text-zinc-400">Preparing unsubscribe request...</p>
      </div>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      <Suspense fallback={<UnsubscribeFallback />}>
        <UnsubscribeClient />
      </Suspense>
    </div>
  );
}
