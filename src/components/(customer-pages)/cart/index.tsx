"use client";

import { useRef, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import CartItemRow from "./CartItemRow";
import OrderSummary from "./OrderSummary";
import { Button } from "@/ui/button";
import { myFetch } from "../../../../helpers/myFetch";
import { useCart } from "@/context/CartContext";
import type { CartItem } from "../check-out/types";

export default function ProductCart({ initialItems }: { initialItems: CartItem[] }) {
    const t = useTranslations("Cart");
    const [items, setItems] = useState(initialItems);
    const [pendingIds, setPendingIds] = useState<string[]>([]);
    const pendingRef = useRef(new Set<string>());
    const { refreshCart } = useCart();

    const setPending = (id: string, pending: boolean) => {
        if (pending) pendingRef.current.add(id);
        else pendingRef.current.delete(id);
        setPendingIds([...pendingRef.current]);
    };

    const handleRemove = async (id: string) => {
        const itemToRemove = items.find((item) => item.id === id);
        if (!itemToRemove || pendingRef.current.has(id)) return;

        const previous = items;
        setPending(id, true);
        setItems(items.filter((item) => item.id !== id));

        try {
            const res = await myFetch(`/carts/products/${itemToRemove.productId}`, {
                method: "DELETE",
            });
            if (!res?.success) {
                setItems(previous);
                toast.error(res?.message || t("removeError"));
                return;
            }
            await refreshCart();
        } catch {
            setItems(previous);
            toast.error(t("removeError"));
        } finally {
            setPending(id, false);
        }
    };

    const handleQuantityChange = async (id: string, newQuantity: number) => {
        const itemToUpdate = items.find((item) => item.id === id);
        if (!itemToUpdate || newQuantity < 1 || pendingRef.current.has(id)) return;

        const previous = items;
        const isIncrementing = newQuantity > itemToUpdate.quantity;
        setPending(id, true);
        setItems(items.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)));

        try {
            const res = await myFetch(
                isIncrementing ? "/carts/increment" : "/carts/decrement",
                {
                    method: "PATCH",
                    body: { product: itemToUpdate.productId },
                },
            );
            if (!res?.success) {
                setItems(previous);
                toast.error(res?.message || t("quantityError"));
                return;
            }
            await refreshCart();
        } catch {
            setItems(previous);
            toast.error(t("quantityError"));
        } finally {
            setPending(id, false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="px-4 py-16 sm:px-6">
                <div className="container mx-auto max-w-lg rounded-2xl border border-white/10 bg-secondary px-6 py-14 text-center shadow-lg">
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 text-primary">
                        <ShoppingCart className="h-7 w-7" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">{t("emptyTitle")}</h1>
                    <p className="mt-2 text-sm text-white/70">{t("emptyDescription")}</p>
                    <Button asChild size="lg" className="mt-6 rounded-xl shadow-md shadow-primary/20">
                        <Link href="/shop">{t("browseProducts")}</Link>
                    </Button>
                </div>
            </div>
        );
    }

    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div className="px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
            <div className="container mx-auto max-w-7xl">
                <header className="mb-8">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/80">{t("eyebrow")}</p>
                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">{t("heading")}</h1>
                    <p className="mt-1 text-sm text-white/75">
                        {t("readyForCheckout", { count: itemCount })}
                    </p>
                </header>

                <div className="flex flex-col gap-8 lg:flex-row">
                    <div className="min-w-0 flex-1 space-y-4">
                        {items.map((item) => (
                            <CartItemRow
                                key={item.id}
                                item={item}
                                disabled={pendingIds.includes(item.id)}
                                onRemove={handleRemove}
                                onQuantityChange={handleQuantityChange}
                            />
                        ))}
                    </div>
                    <OrderSummary items={items} />
                </div>
            </div>
        </div>
    );
}
