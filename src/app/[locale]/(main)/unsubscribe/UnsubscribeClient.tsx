"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  MailX,
  Mail,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { Link } from "@/i18n/navigation";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { myFetch } from "../../../../../helpers/myFetch";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type UnsubscribeStatus = "idle" | "loading" | "success" | "error";

export default function UnsubscribeClient() {
  const searchParams = useSearchParams();
  const token = searchParams?.get("token") || "";
  const initialEmail = searchParams?.get("email") || "";

  const [status, setStatus] = useState<UnsubscribeStatus>("idle");
  const [message, setMessage] = useState<string>("");
  const [emailInput, setEmailInput] = useState<string>(initialEmail);
  const [unsubscribedEmail, setUnsubscribedEmail] = useState<string>(initialEmail);
  const [manualEmailMode, setManualEmailMode] = useState<boolean>(!token);

  const handleConfirmUnsubscribe = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const shouldUseEmail = manualEmailMode || !token;

    if (shouldUseEmail) {
      const cleanEmail = emailInput.trim().toLowerCase();
      if (!cleanEmail || !EMAIL_PATTERN.test(cleanEmail)) {
        toast.error("Please enter a valid email address.");
        return;
      }
    }

    setStatus("loading");

    try {
      const payload = shouldUseEmail
        ? { email: emailInput.trim().toLowerCase() }
        : { token };

      const res = await myFetch<{
        email?: string;
        status?: string;
      }>("/newsletters/unsubscribe", {
        method: "POST",
        body: payload,
      });

      if (res.success) {
        setStatus("success");
        const successMsg =
          res.message || "You have been successfully unsubscribed from our newsletter";
        setMessage(successMsg);
        if (res.data?.email) {
          setUnsubscribedEmail(res.data.email);
        } else if (shouldUseEmail) {
          setUnsubscribedEmail(emailInput.trim().toLowerCase());
        }

        if (typeof window !== "undefined") {
          localStorage.removeItem("newsletter_subscription");
        }

        toast.success(successMsg);
      } else {
        setStatus("error");
        const errorMsg =
          res.error || res.message || "Invalid or expired unsubscribe link.";
        setMessage(errorMsg);
        toast.error(errorMsg);
      }
    } catch {
      setStatus("error");
      const fallbackError = "A network error occurred. Please try again.";
      setMessage(fallbackError);
      toast.error(fallbackError);
    }
  };

  return (
    <div className="relative w-full max-w-lg">
      {/* Decorative gradient glow */}
      <div className="pointer-events-none absolute -inset-1 rounded-3xl bg-gradient-to-r from-primary/30 via-red-500/20 to-primary/30 opacity-70 blur-xl" />

      <div className="relative rounded-3xl border border-white/10 bg-secondary/95 p-8 text-center text-white shadow-2xl backdrop-blur-xl sm:p-10">
        {/* State: IDLE */}
        {status === "idle" && (
          <div>
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/10">
              <MailX className="h-8 w-8 text-primary" />
            </div>

            <h1 className="mb-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Newsletter Unsubscribe
            </h1>

            {manualEmailMode ? (
              <div>
                <p className="mb-6 text-sm leading-relaxed text-zinc-300">
                  Enter your email address below to stop receiving marketing newsletters and updates.
                </p>
                <form onSubmit={handleConfirmUnsubscribe} className="space-y-4">
                  <div className="relative text-left">
                    <label htmlFor="unsub-email" className="sr-only">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                      <Input
                        id="unsub-email"
                        type="email"
                        required
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="your.email@example.com"
                        className="h-12 rounded-xl border-white/15 bg-white/5 pl-10 pr-4 text-white placeholder:text-zinc-500 focus-visible:border-primary focus-visible:ring-primary"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="destructive"
                    size="lg"
                    className="w-full h-12 rounded-xl font-semibold shadow-lg hover:shadow-red-500/20"
                  >
                    Confirm Unsubscribe
                  </Button>
                </form>

                {token && (
                  <button
                    type="button"
                    onClick={() => setManualEmailMode(false)}
                    className="mt-4 text-xs text-zinc-400 hover:text-white hover:underline cursor-pointer"
                  >
                    Use link token instead
                  </button>
                )}
              </div>
            ) : (
              <div>
                <p className="mb-8 text-sm leading-relaxed text-zinc-300">
                  Are you sure you want to stop receiving newsletters, special offers, and product updates from WorthWorld?
                </p>

                <div className="flex flex-col gap-3">
                  <Button
                    type="button"
                    onClick={() => handleConfirmUnsubscribe()}
                    variant="destructive"
                    size="lg"
                    className="w-full h-12 rounded-xl font-semibold shadow-lg hover:shadow-red-500/20"
                  >
                    Confirm Unsubscribe
                  </Button>

                  <Button
                    asChild
                    variant="ghost"
                    size="lg"
                    className="w-full h-12 rounded-xl text-zinc-300 hover:text-white hover:bg-white/5"
                  >
                    <Link href="/">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Keep Subscription & Return Home
                    </Link>
                  </Button>
                </div>

                <div className="mt-6 border-t border-white/10 pt-4">
                  <button
                    type="button"
                    onClick={() => setManualEmailMode(true)}
                    className="text-xs text-zinc-400 hover:text-white hover:underline cursor-pointer"
                  >
                    Want to unsubscribe a specific email address instead?
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* State: LOADING */}
        {status === "loading" && (
          <div className="py-8">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
            <h2 className="mb-2 text-xl font-bold text-white">Processing your request...</h2>
            <p className="text-sm text-zinc-400">
              Please wait while we update your email preferences.
            </p>
          </div>
        )}

        {/* State: SUCCESS */}
        {status === "success" && (
          <div>
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 ring-1 ring-emerald-500/30">
              <CheckCircle2 className="h-8 w-8 text-emerald-400" />
            </div>

            <h2 className="mb-2 text-2xl font-bold text-white sm:text-3xl">
              Unsubscribed Successfully
            </h2>

            <p className="mb-2 text-sm text-emerald-400 font-medium">
              {message}
            </p>

            {unsubscribedEmail ? (
              <p className="mb-8 text-xs text-zinc-400">
                You will no longer receive marketing emails at{" "}
                <span className="font-semibold text-zinc-200">{unsubscribedEmail}</span>.
              </p>
            ) : (
              <p className="mb-8 text-xs text-zinc-400">
                Your email preferences have been updated.
              </p>
            )}

            <div className="flex flex-col gap-3">
              <Button asChild size="lg" className="w-full h-12 rounded-xl">
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
            </div>
          </div>
        )}

        {/* State: ERROR */}
        {status === "error" && (
          <div>
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/10 ring-1 ring-rose-500/30">
              <AlertCircle className="h-8 w-8 text-rose-400" />
            </div>

            <h2 className="mb-2 text-2xl font-bold text-white sm:text-3xl">
              Unable to Unsubscribe
            </h2>

            <p className="mb-6 text-sm text-rose-300 font-medium">
              {message}
            </p>

            <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-left text-xs text-zinc-300 mb-6">
              <p className="font-semibold text-white mb-1">Having trouble?</p>
              <p>The link might have expired or has already been used. You can unsubscribe by typing your email address directly below.</p>
            </div>

            <div className="space-y-3">
              <Button
                type="button"
                onClick={() => {
                  setManualEmailMode(true);
                  setStatus("idle");
                }}
                variant="outline"
                size="lg"
                className="w-full h-12 rounded-xl border-white/20 text-white hover:bg-white/10"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Unsubscribe with Email Address
              </Button>

              <Button
                asChild
                variant="ghost"
                size="lg"
                className="w-full h-12 rounded-xl text-zinc-300 hover:text-white"
              >
                <Link href="/">Return to Home</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
