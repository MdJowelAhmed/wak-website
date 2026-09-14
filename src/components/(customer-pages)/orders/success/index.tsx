"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, ShoppingBag } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

function OrderSuccessContent() {
    const t = useTranslations("OrderSuccess");
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("session_id");

    return (
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-8 md:p-12 shadow-sm border border-zinc-100 max-w-lg w-full text-center space-y-6 mx-auto mt-10">
            <div className="flex justify-center">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
            </div>

            <div className="space-y-2">
                <h1 className="text-2xl font-bold text-zinc-900">{t("title")}</h1>
                <p className="text-zinc-900">{t("description")}</p>
                {sessionId && (
                    <p className="text-xs text-zinc-900 mt-4 break-all">
                        {t("sessionId", { id: sessionId })}
                    </p>
                )}
            </div>

            <div className="pt-6 space-y-3">
                <Link
                    href="/profile/orders"
                    className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-orange-500 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
                >
                    <ShoppingBag className="w-5 h-5" />
                    {t("viewOrders")}
                </Link>
                <Link
                    href="/"
                    className="w-full flex items-center justify-center bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold py-3 px-4 rounded-xl transition-colors"
                >
                    {t("continueShopping")}
                </Link>
            </div>
        </div>
    );
}

function OrderSuccessFallback() {
    const t = useTranslations("OrderSuccess");
    return (
        <div className="flex justify-center mt-20">
            <p className="text-zinc-500">{t("loading")}</p>
        </div>
    );
}

export default function OrderSuccess() {
    return (
        <div className="min-h-[calc(100vh-280px)]  py-12 px-4">
            <Suspense fallback={<OrderSuccessFallback />}>
                <OrderSuccessContent />
            </Suspense>
        </div>
    );
}
