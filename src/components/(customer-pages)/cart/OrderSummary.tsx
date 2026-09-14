"use client";

import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/ui/button";
import { useCurrency } from "@/hooks/use-currency";
import { type CartItem } from "../check-out/types";

interface OrderSummaryProps {
    items: CartItem[];
}

export default function OrderSummary({ items }: OrderSummaryProps) {
    const t = useTranslations("Cart");
    const { formatPrice } = useCurrency();
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <aside className="w-full lg:w-[400px] lg:shrink-0">
            <div className="sticky top-6 rounded-2xl border border-white/10 bg-secondary p-5 shadow-lg sm:p-6">
                <h2 className="text-lg font-bold text-white">{t("summary")}</h2>
                <p className="mt-1 text-sm text-white/60">
                    {t("itemCount", { count: itemCount })}
                </p>

                <dl className="mt-5 space-y-3 border-t border-white/10 pt-4 text-sm">
                    <div className="flex justify-between gap-4">
                        <dt className="text-white/65">{t("subtotal")}</dt>
                        <dd className="font-medium text-white">{formatPrice(subtotal)}</dd>
                    </div>
                    <p className="text-xs text-white/50">{t("shippingNote")}</p>
                    <div className="flex justify-between gap-4 border-t border-white/10 pt-3">
                        <dt className="font-semibold text-white">{t("total")}</dt>
                        <dd className="text-xl font-bold text-primary">{formatPrice(subtotal)}</dd>
                    </div>
                </dl>

                <Button asChild size="lg" className="mt-6 w-full rounded-xl shadow-md shadow-primary/20">
                    <Link href="/check-out">
                        {t("checkout")}
                        <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                    </Link>
                </Button>
                <Link
                    href="/shop"
                    className="mt-3 block text-center text-sm font-semibold text-white/70 transition-colors hover:text-white"
                >
                    {t("continueShopping")}
                </Link>
            </div>
        </aside>
    );
}
