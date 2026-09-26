"use client";

import { useState } from "react";
import { Loader2, Minus, Plus, Shield, ShoppingCart, Star, Truck, Zap } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/ui/button";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/hooks/use-currency";
import { useRouter } from "@/i18n/navigation";
import { cartAddBody } from "../../../../../helpers/product-variant";
import { myFetch } from "../../../../../helpers/myFetch";
import { type ProductDetailsData } from "../types";

function OptionPicker({
    label,
    options,
    value,
    onChange,
}: {
    label: string;
    options: string[];
    value: string;
    onChange: (next: string) => void;
}) {
    return (
        <div>
            <p className="text-sm font-medium text-white">{label}</p>
            <div className="mt-2 flex flex-wrap gap-2">
                {options.map((option) => {
                    const selected = value === option;
                    return (
                        <button
                            key={option}
                            type="button"
                            onClick={() => onChange(selected ? "" : option)}
                            aria-pressed={selected}
                            className={`cursor-pointer rounded-xl border px-3 py-2 text-sm font-semibold transition-colors ${
                                selected
                                    ? "border-primary bg-primary text-white"
                                    : "border-white/15 bg-white/10 text-white hover:border-primary/60"
                            }`}
                        >
                            {option}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default function ProductInfo({ product }: { product: ProductDetailsData }) {
    const t = useTranslations("ShopDetails");
    const router = useRouter();
    const { refreshCart } = useCart();
    const { formatPrice } = useCurrency();
    const [qty, setQty] = useState(1);
    const [color, setColor] = useState("");
    const [size, setSize] = useState("");
    const [isAdding, setIsAdding] = useState(false);
    const [isBuying, setIsBuying] = useState(false);
    const inStock = product.stock > 0;
    const maxQty = Math.max(1, product.stock);
    const busy = isAdding || isBuying;
    const hasColors = product.colors.length > 0;
    const hasSizes = product.sizes.length > 0;

    const selectedVariant = () => {
        if (hasColors && !color) {
            toast.error(t("selectColor"));
            return null;
        }
        if (hasSizes && !size) {
            toast.error(t("selectSize"));
            return null;
        }
        return { color, size };
    };

    const addToCart = async () => {
        const variant = selectedVariant();
        if (!variant) return false;

        const res = await myFetch("/carts/", {
            method: "POST",
            body: cartAddBody(product.id, qty, variant),
        });
        if (!res?.success) {
            toast.error(res?.message || t("addError"));
            return false;
        }
        await refreshCart();
        return true;
    };

    const handleAddToCart = async () => {
        if (!inStock || busy) return;
        setIsAdding(true);
        try {
            const added = await addToCart();
            if (added) toast.success(t("addedToCart"));
        } catch {
            toast.error(t("addError"));
        } finally {
            setIsAdding(false);
        }
    };

    const handleBuyNow = async () => {
        if (!inStock || busy) return;
        setIsBuying(true);
        try {
            const added = await addToCart();
            if (added) router.push("/check-out");
        } catch {
            toast.error(t("checkoutError"));
        } finally {
            setIsBuying(false);
        }
    };

    return (
        <section className="rounded-2xl border border-white/10 bg-secondary p-5 shadow-lg sm:p-6">
            <div className="flex flex-wrap items-end gap-3">
                <p className="text-3xl font-bold tracking-tight text-primary">
                    {formatPrice(product.price)}
                </p>
                {product.originalPrice ? (
                    <p className="text-lg text-white/50 line-through">
                        {formatPrice(product.originalPrice)}
                    </p>
                ) : null}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
                <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                            key={index}
                            className={`h-4 w-4 ${
                                index < Math.floor(product.rating)
                                    ? "fill-primary text-primary"
                                    : "fill-white/15 text-white/15"
                            }`}
                        />
                    ))}
                </div>
                <span className="text-sm font-semibold text-white">{product.rating.toFixed(1)}</span>
                <span className="text-sm text-white/65">
                    ({t("reviewCount", { count: product.reviews })})
                </span>
            </div>

            <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <div>
                    <dt className="text-white/55">{t("stock")}</dt>
                    <dd className="mt-0.5 font-semibold text-white">
                        {inStock ? t("available", { count: product.stock }) : t("outOfStock")}
                    </dd>
                </div>
                {product.sku ? (
                    <div>
                        <dt className="text-white/55">{t("sku")}</dt>
                        <dd className="mt-0.5 font-semibold text-white">{product.sku}</dd>
                    </div>
                ) : null}
            </dl>

            <div className="mt-6 flex flex-col gap-4">
                {hasColors ? (
                    <OptionPicker
                        label={t("color")}
                        options={product.colors}
                        value={color}
                        onChange={setColor}
                    />
                ) : null}
                {hasSizes ? (
                    <OptionPicker
                        label={t("size")}
                        options={product.sizes}
                        value={size}
                        onChange={setSize}
                    />
                ) : null}

                <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-white">{t("quantity")}</span>
                    <div className="flex items-center rounded-xl border border-white/15 bg-white/10">
                        <button
                            type="button"
                            onClick={() => setQty((value) => Math.max(1, value - 1))}
                            disabled={!inStock || qty <= 1}
                            className="flex h-10 w-10 cursor-pointer items-center justify-center text-white transition-colors hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                            aria-label={t("decreaseQty")}
                        >
                            <Minus className="h-4 w-4" />
                        </button>
                        <span className="min-w-10 text-center text-sm font-bold text-white">{qty}</span>
                        <button
                            type="button"
                            onClick={() => setQty((value) => Math.min(maxQty, value + 1))}
                            disabled={!inStock || qty >= maxQty}
                            className="flex h-10 w-10 cursor-pointer items-center justify-center text-white transition-colors hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                            aria-label={t("increaseQty")}
                        >
                            <Plus className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleAddToCart}
                        disabled={!inStock || busy}
                        className="flex-1 rounded-xl border-white/20 text-white hover:bg-white/10 hover:text-white"
                    >
                        {isAdding ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShoppingCart className="h-4 w-4" />}
                        {t("addToCart")}
                    </Button>
                    <Button
                        type="button"
                        onClick={handleBuyNow}
                        disabled={!inStock || busy}
                        className="flex-1 rounded-xl shadow-md shadow-primary/20"
                    >
                        {isBuying ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
                        {t("buyNow")}
                    </Button>
                </div>
            </div>

            <div className="mt-6 grid gap-3 border-t border-white/10 pt-5 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                    <Truck className="mt-0.5 h-4 w-4 text-primary" />
                    <div>
                        <p className="text-sm font-semibold text-white">{t("delivery")}</p>
                        <p className="text-xs text-white/65">
                            {product.localDeliveryFee != null
                                ? t("localDelivery", { price: formatPrice(product.localDeliveryFee) })
                                : t("calculatedAtCheckout")}
                        </p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <Shield className="mt-0.5 h-4 w-4 text-primary" />
                    <div>
                        <p className="text-sm font-semibold text-white">{t("secureCheckout")}</p>
                        <p className="text-xs text-white/65">{t("protectedPayment")}</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
