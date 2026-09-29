import type { Metadata } from "next";
import Link from "next/link";
import { Home, LogIn, Headset } from "lucide-react";

export const metadata: Metadata = {
  title: "404 - Page Not Found | WorthWorld",
  description: "The page you are looking for does not exist on WorthWorld.",
};

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#E87524] text-white antialiased font-sans flex flex-col justify-center items-center px-4 py-16 text-center selection:bg-white selection:text-[#E87524]">
        {/* 404 Number */}
        <h1 className="select-none text-8xl font-black tracking-tight drop-shadow-md sm:text-9xl md:text-[11rem] text-white">
          404
        </h1>

        {/* Title & Description */}
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl">
          Page Not Found
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/80 sm:text-base">
          The page you are looking for does not exist or has been moved.
        </p>

        {/* 3 Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <Link
            href="/"
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#54331C] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-black/10 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#3E2723] active:translate-y-0"
          >
            <Home className="h-4 w-4" />
            <span>Go to Home</span>
          </Link>

          <Link
            href="/"
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/20 hover:border-white/40 active:translate-y-0"
          >
            <LogIn className="h-4 w-4" />
            <span>Go to Login</span>
          </Link>

          <Link
            href="/contact-us"
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/20 hover:border-white/40 active:translate-y-0"
          >
            <Headset className="h-4 w-4" />
            <span>Go to Support</span>
          </Link>
        </div>
      </body>
    </html>
  );
}
