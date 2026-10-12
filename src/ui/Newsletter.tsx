"use client";

import { useState, useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { myFetch } from "../../helpers/myFetch";

const STORAGE_KEY = "newsletter_subscription";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function readSubscription(): string | null {
    if (typeof window === "undefined") return null;
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw) as { email?: unknown };
        return typeof parsed.email === "string" ? parsed.email.toLowerCase() : null;
    } catch {
        return null;
    }
}

interface NewsletterProps {
    source?: string;
    className?: string;
}

function subscribe(callback: () => void) {
    if (typeof window === "undefined") return () => {};
    window.addEventListener("storage", callback);
    window.addEventListener("newsletter_subscription_change", callback);
    return () => {
        window.removeEventListener("storage", callback);
        window.removeEventListener("newsletter_subscription_change", callback);
    };
}

function getSnapshot(): string | null {
    return readSubscription();
}

function getServerSnapshot(): string | null {
    return null;
}

export default function Newsletter({
    source = "website_footer",
    className = "",
}: NewsletterProps) {
    const t = useTranslations("Newsletter");
    const [email, setEmail] = useState("");
    const [consent, setConsent] = useState(false);
    const [hideSubscribed, setHideSubscribed] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [unsubscribing, setUnsubscribing] = useState(false);

    const storeEmail = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
    const subscribedEmail = hideSubscribed ? null : storeEmail;

    const handleSubscribe = async (event: React.FormEvent) => {
        event.preventDefault();
        const nextEmail = email.trim().toLowerCase();

        if (!EMAIL_PATTERN.test(nextEmail)) {
            setError(t("invalidEmail"));
            return;
        }
        if (!consent) {
            setError(t("needConsent"));
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await myFetch<{
                email?: string;
                status?: string;
                source?: string;
                subscribedAt?: string;
            }>("/newsletters/subscribe", {
                method: "POST",
                body: {
                    email: nextEmail,
                    source,
                },
            });

            if (res.success) {
                localStorage.setItem(
                    STORAGE_KEY,
                    JSON.stringify({ email: nextEmail, subscribedAt: Date.now() }),
                );
                window.dispatchEvent(new Event("newsletter_subscription_change"));
                setHideSubscribed(false);
                setEmail("");
                setConsent(false);
                setError("");
                toast.success(res.message || t("success"));
            } else {
                const message = res.error || res.message || "Failed to subscribe";
                setError(message);
                toast.error(message);
            }
        } catch {
            const message = "Failed to subscribe. Please try again.";
            setError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const handleUnsubscribe = async () => {
        if (!subscribedEmail) return;
        setUnsubscribing(true);
        try {
            const res = await myFetch("/newsletters/unsubscribe", {
                method: "POST",
                body: {
                    email: subscribedEmail,
                },
            });

            if (res.success) {
                localStorage.removeItem(STORAGE_KEY);
                window.dispatchEvent(new Event("newsletter_subscription_change"));
                setHideSubscribed(false);
                setError("");
                toast.success(res.message || t("unsubscribed"));
            } else {
                toast.error(res.error || res.message || "Failed to unsubscribe");
            }
        } catch {
            toast.error("Failed to unsubscribe");
        } finally {
            setUnsubscribing(false);
        }
    };

    return (
        <div className={`max-w-sm ${className}`.trim()}>
            <h3 className="mb-2 text-lg font-bold text-white">{t("title")}</h3>
            <p className="mb-4 text-sm leading-relaxed text-zinc-300">
                {t("description")}
            </p>

            {subscribedEmail ? (
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <p className="text-sm text-white">
                        {t("subscribedAs")} <span className="font-semibold">{subscribedEmail}</span>
                    </p>
                    <div className="mt-2 flex items-center gap-3">
                        <button
                            type="button"
                            onClick={handleUnsubscribe}
                            disabled={unsubscribing}
                            className="text-xs font-semibold text-primary hover:underline disabled:opacity-50 cursor-pointer"
                        >
                            {unsubscribing ? "Unsubscribing..." : t("unsubscribe")}
                        </button>
                        <span className="text-white/20">|</span>
                        <button
                            type="button"
                            onClick={() => setHideSubscribed(true)}
                            className="text-xs font-semibold text-zinc-400 hover:text-white hover:underline cursor-pointer"
                        >
                            Change email
                        </button>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSubscribe} className="space-y-3" noValidate>
                    <label className="sr-only" htmlFor="newsletter-email">
                        {t("email")}
                    </label>
                    <input
                        id="newsletter-email"
                        type="email"
                        value={email}
                        onChange={(event) => {
                            setEmail(event.target.value);
                            if (error) setError("");
                        }}
                        disabled={loading}
                        placeholder={t("placeholder")}
                        autoComplete="email"
                        className="h-11 w-full rounded-xl border border-white/15 bg-white/5 px-3 text-sm text-white outline-none placeholder:text-white/45 focus:border-primary disabled:opacity-60"
                    />
                    <label className="flex items-start gap-2 text-xs leading-relaxed text-zinc-300 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={consent}
                            onChange={(event) => {
                                setConsent(event.target.checked);
                                if (error) setError("");
                            }}
                            disabled={loading}
                            className="mt-0.5 h-3.5 w-3.5 shrink-0 accent-primary cursor-pointer"
                        />
                        <span>{t("consent")}</span>
                    </label>
                    {error ? <p className="text-xs text-red-300">{error}</p> : null}
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
                    >
                        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                        {loading ? "Subscribing..." : t("subscribe")}
                    </button>
                </form>
            )}
        </div>
    );
}
