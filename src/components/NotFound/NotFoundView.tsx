"use client";

import React from "react";
import { Link } from "@/i18n/navigation";
import { Home, LogIn, Headset } from "lucide-react";
import AuthModal from "@/components/(auth-pages)";

interface NotFoundViewProps {
  title?: string;
  description?: string;
  backHomeText?: string;
}

export default function NotFoundView({
  title = "Page Not Found",
  description = "The page you are looking for does not exist or has been moved.",
  backHomeText = "Go to Home",
}: NotFoundViewProps) {
  return (
    <div className="flex min-h-[65vh] w-full flex-col items-center justify-center px-4 py-16 text-center text-white">
      {/* 404 Number */}
      <h1 className="select-none text-8xl font-black tracking-tight drop-shadow-md sm:text-9xl md:text-[11rem] text-white">
        404
      </h1>

      {/* Title & Description */}
      <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl">
        {title}
      </h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/80 sm:text-base">
        {description}
      </p>

      {/* 3 Simple Action Buttons */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
        {/* Go to Home */}
        <Link
          href="/"
          className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-secondary px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-black/10 transition-all duration-200 hover:-translate-y-0.5 hover:bg-secondary-hover active:translate-y-0"
        >
          <Home className="h-4 w-4" />
          <span>{backHomeText}</span>
        </Link>

        {/* Go to Login */}
        <AuthModal
          trigger={
            <button
              type="button"
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/20 hover:border-white/40 active:translate-y-0"
            >
              <LogIn className="h-4 w-4" />
              <span>Go to Login</span>
            </button>
          }
        />

        {/* Go to Support */}
        <Link
          href="/contact-us"
          className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/20 hover:border-white/40 active:translate-y-0"
        >
          <Headset className="h-4 w-4" />
          <span>Go to Support</span>
        </Link>
      </div>
    </div>
  );
}
