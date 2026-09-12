"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

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

export default function Newsletter() {
    const [email, setEmail] = useState("");
    const [consent, setConsent] = useState(false);
    const [subscribedEmail, setSubscribedEmail] = useState<string | null>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        setSubscribedEmail(readSubscription());
    }, []);

    const handleSubscribe = (event: React.FormEvent) => {
        event.preventDefault();
        const nextEmail = email.trim().toLowerCase();

        if (!EMAIL_PATTERN.test(nextEmail)) {
            setError("Enter a valid email address.");
            return;
        }
        if (!consent) {
            setError("Please agree to receive marketing emails.");
            return;
        }
        if (subscribedEmail === nextEmail) {
            setError("This email is already subscribed.");
            return;
        }

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ email: nextEmail, subscribedAt: Date.now() }),
        );
        setSubscribedEmail(nextEmail);
        setEmail("");
        setConsent(false);
        setError("");
        toast.success("You are subscribed. Watch your inbox for updates.");
    };

    const handleUnsubscribe = () => {
        localStorage.removeItem(STORAGE_KEY);
        setSubscribedEmail(null);
        setError("");
        toast.success("You have been unsubscribed.");
    };

    return (
        <div className="max-w-sm">
            <h3 className="mb-2 text-lg font-bold text-white">Stay Updated</h3>
            <p className="mb-4 text-sm leading-relaxed text-zinc-300">
                Get deals, new arrivals, and WorthWorld news by email.
            </p>

            {subscribedEmail ? (
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <p className="text-sm text-white">
                        Subscribed as <span className="font-semibold">{subscribedEmail}</span>
                    </p>
                    <button
                        type="button"
                        onClick={handleUnsubscribe}
                        className="mt-2 text-xs font-semibold text-primary hover:underline"
                    >
                        Unsubscribe
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubscribe} className="space-y-3" noValidate>
                    <label className="sr-only" htmlFor="newsletter-email">
                        Email address
                    </label>
                    <input
                        id="newsletter-email"
                        type="email"
                        value={email}
                        onChange={(event) => {
                            setEmail(event.target.value);
                            if (error) setError("");
                        }}
                        placeholder="Your email"
                        autoComplete="email"
                        className="h-11 w-full rounded-xl border border-white/15 bg-white/5 px-3 text-sm text-white outline-none placeholder:text-white/45 focus:border-primary"
                    />
                    <label className="flex items-start gap-2 text-xs leading-relaxed text-zinc-300">
                        <input
                            type="checkbox"
                            checked={consent}
                            onChange={(event) => {
                                setConsent(event.target.checked);
                                if (error) setError("");
                            }}
                            className="mt-0.5 h-3.5 w-3.5 shrink-0 accent-primary"
                        />
                        I agree to receive marketing emails and can unsubscribe at any time.
                    </label>
                    {error ? <p className="text-xs text-red-300">{error}</p> : null}
                    <button
                        type="submit"
                        className="h-11 w-full rounded-xl bg-primary text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
                    >
                        Subscribe
                    </button>
                </form>
            )}
        </div>
    );
}
