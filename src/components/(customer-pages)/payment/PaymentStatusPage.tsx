"use client";

import { Suspense } from "react";
import { CheckCircle2, XCircle, ShoppingBag, RotateCcw, ShoppingCart } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

type PaymentStatus = "success" | "failed";

function PaymentStatusContent({ status }: { status: PaymentStatus }) {
    const t = useTranslations(status === "success" ? "OrderSuccess" : "OrderFailed");
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("session_id");
    const isSuccess = status === "success";

    return (
        <div className="mx-auto mt-6 w-full max-w-lg rounded-2xl border border-white/10 bg-secondary p-8 text-center shadow-lg md:p-12">
            <div className="flex justify-center">
                <div
                    className={`flex h-20 w-20 items-center justify-center rounded-full ${
                        isSuccess ? "bg-emerald-500/15" : "bg-red-500/15"
                    }`}
                >
                    {isSuccess ? (
                        <CheckCircle2 className="h-10 w-10 text-emerald-400" />
                    ) : (
                        <XCircle className="h-10 w-10 text-red-400" />
                    )}
                </div>
            </div>

            <div className="mt-6 space-y-2">
                <h1 className="text-2xl font-bold tracking-tight text-white">{t("title")}</h1>
                <p className="text-sm leading-relaxed text-white/75">{t("description")}</p>
                {sessionId ? (
                    <p className="mt-4 break-all text-xs text-white/50">{t("sessionId", { id: sessionId })}</p>
                ) : null}
            </div>

            <div className="mt-8 space-y-3">
                {isSuccess ? (
                    <>
                        <Link
                            href="/profile/product-orders"
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-semibold text-white shadow-md shadow-primary/20 transition-colors hover:bg-primary-hover"
                        >
                            <ShoppingBag className="h-5 w-5" />
                            {t("viewOrders")}
                        </Link>
                        <Link
                            href="/shop"
                            className="flex w-full items-center justify-center rounded-xl border border-white/15 bg-white/5 px-4 py-3 font-semibold text-white transition-colors hover:bg-white/10"
                        >
                            {t("continueShopping")}
                        </Link>
                    </>
                ) : (
                    <>
                        <Link
                            href="/check-out"
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-semibold text-white shadow-md shadow-primary/20 transition-colors hover:bg-primary-hover"
                        >
                            <RotateCcw className="h-5 w-5" />
                            {t("tryAgain")}
                        </Link>
                        <Link
                            href="/cart"
                            className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-3 font-semibold text-white transition-colors hover:bg-white/10"
                        >
                            <ShoppingCart className="h-5 w-5" />
                            {t("backToCart")}
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}

function PaymentStatusFallback({ status }: { status: PaymentStatus }) {
    const t = useTranslations(status === "success" ? "OrderSuccess" : "OrderFailed");
    return (
        <div className="flex justify-center py-20">
            <p className="text-white/60">{t("loading")}</p>
        </div>
    );
}

export default function PaymentStatusPage({ status }: { status: PaymentStatus }) {
    return (
        <div className="min-h-[calc(100vh-280px)] px-4 py-12">
            <Suspense fallback={<PaymentStatusFallback status={status} />}>
                <PaymentStatusContent status={status} />
            </Suspense>
        </div>
    );
}
