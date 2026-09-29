"use client";

import { useState } from "react";
import {
    Loader2,
    Minus,
    Plus,
    Shield,
    ShoppingCart,
    Star,
    Truck,
    Zap,
    AlertTriangle,
    CheckCircle2,
} from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/ui/button";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/hooks/use-currency";
import { useRouter } from "@/i18n/navigation";
import { cartAddBody } from "../../../../../helpers/product-variant";
import { myFetch } from "../../../../../helpers/myFetch";
import { type ProductDetailsData, type ProductVariantItem } from "../types";

interface ProductInfoProps {
    product: ProductDetailsData;
    onSelectImage?: (imgUrl: string) => void;
}

export default function ProductInfo({ product, onSelectImage }: ProductInfoProps) {
    const t = useTranslations("ShopDetails");
    const router = useRouter();
    const { refreshCart } = useCart();
    const { formatPrice } = useCurrency();

    const [color, setColor] = useState("");
    const [size, setSize] = useState("");
    const [qty, setQty] = useState(1);
    const [isAdding, setIsAdding] = useState(false);
    const [isBuying, setIsBuying] = useState(false);

    // Active variant matching the selected color
    const activeVariant: ProductVariantItem | undefined = color
        ? product.variants.find((v) => v.color.toLowerCase() === color.toLowerCase())
        : undefined;

    // Available sizes: scoped to active variant if available, otherwise all product sizes
    const availableSizes: string[] =
        activeVariant && activeVariant.sizes.length > 0
            ? activeVariant.sizes
            : product.sizes;

    // Determine current stock depending on whether a color variant is selected
    const currentStock = activeVariant !== undefined ? activeVariant.stock : product.stock;
    const inStock = currentStock > 0;
    const maxQty = Math.max(1, currentStock);
    const busy = isAdding || isBuying;

    const hasColors = product.colors.length > 0;
    const hasSizes = product.sizes.length > 0;
    const lowStockLimit = product.lowStockThreshold ?? 5;
    const isLowStock = inStock && currentStock <= lowStockLimit;

    // Handle Color Change
    const handleColorChange = (newColor: string) => {
        const nextColor = color === newColor ? "" : newColor;
        setColor(nextColor);

        if (nextColor) {
            const variant = product.variants.find((v) => v.color.toLowerCase() === nextColor.toLowerCase());
            if (variant) {
                // If variant has an image, switch gallery
                if (variant.image && onSelectImage) {
                    onSelectImage(variant.image);
                }
                // If currently chosen size is not in this variant's sizes, reset size
                if (size && variant.sizes.length > 0 && !variant.sizes.includes(size)) {
                    setSize("");
                }
                // Clamp quantity to variant stock
                if (qty > variant.stock && variant.stock > 0) {
                    setQty(variant.stock);
                }
            }
        }
    };

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
            {/* Price & Discounts */}
            <div className="flex flex-wrap items-end gap-3">
                <p className="text-3xl font-bold tracking-tight text-primary">
                    {formatPrice(product.price)}
                </p>
                {product.originalPrice ? (
                    <p className="text-lg text-white/50 line-through">
                        {formatPrice(product.originalPrice)}
                    </p>
                ) : null}
                {product.discount ? (
                    <span className="rounded-lg bg-primary/20 px-2 py-0.5 text-xs font-bold text-primary border border-primary/30">
                        -{product.discount}% OFF
                    </span>
                ) : null}
            </div>

            {/* Ratings & Reviews */}
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

            {/* Stock & SKU Info */}
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                    <dt className="text-white/55">{t("stock")}</dt>
                    <dd className="mt-0.5 font-semibold text-white">
                        {inStock ? (
                            <span>
                                {activeVariant
                                    ? `${currentStock} available (${activeVariant.color})`
                                    : t("available", { count: currentStock })}
                            </span>
                        ) : (
                            <span className="text-red-400 font-semibold">{t("outOfStock")}</span>
                        )}
                    </dd>
                </div>
                {product.sku ? (
                    <div>
                        <dt className="text-white/55">{t("sku")}</dt>
                        <dd className="mt-0.5 font-semibold text-white">{product.sku}</dd>
                    </div>
                ) : null}
            </dl>

            {/* Low Stock Warning Banner */}
            {isLowStock && (
                <div className="mt-4 flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3.5 py-2 text-xs font-medium text-amber-200">
                    <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400" />
                    <span>
                        Only {currentStock} left in stock
                        {activeVariant ? ` for ${activeVariant.color}` : ""} - order soon!
                    </span>
                </div>
            )}

            {/* Variant Selectors & Quantity */}
            <div className="mt-5 border-t border-white/10 pt-5 flex flex-col gap-5">
                {/* Color Picker with Variant Image Thumbnails */}
                {hasColors && (
                    <div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="font-medium text-white">{t("color")}</span>
                            {color && (
                                <span className="text-xs font-semibold text-primary">{color}</span>
                            )}
                        </div>
                        <div className="mt-2.5 flex flex-wrap gap-2.5">
                            {product.colors.map((c) => {
                                const selected = color.toLowerCase() === c.toLowerCase();
                                const variantItem = product.variants.find(
                                    (v) => v.color.toLowerCase() === c.toLowerCase()
                                );
                                const isOutOfStock = variantItem !== undefined && variantItem.stock === 0;

                                return (
                                    <button
                                        key={c}
                                        type="button"
                                        onClick={() => handleColorChange(c)}
                                        aria-pressed={selected}
                                        disabled={isOutOfStock}
                                        className={`group relative flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
                                            selected
                                                ? "border-primary bg-primary text-white shadow-md shadow-primary/25"
                                                : "border-white/15 bg-white/10 text-white hover:border-primary/60 hover:bg-white/15"
                                        } ${isOutOfStock ? "opacity-40 cursor-not-allowed line-through" : ""}`}
                                    >
                                        {variantItem?.image ? (
                                            <span className="relative h-5 w-5 shrink-0 overflow-hidden rounded-md border border-white/20">
                                                <Image
                                                    src={variantItem.image}
                                                    alt={c}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </span>
                                        ) : null}
                                        <span>{c}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Size Picker */}
                {hasSizes && (
                    <div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="font-medium text-white">{t("size")}</span>
                            {size && (
                                <span className="text-xs font-semibold text-primary">{size}</span>
                            )}
                        </div>
                        <div className="mt-2.5 flex flex-wrap gap-2">
                            {product.sizes.map((s) => {
                                const selected = size === s;
                                const isAvailableInActiveVariant =
                                    availableSizes.length === 0 || availableSizes.includes(s);

                                return (
                                    <button
                                        key={s}
                                        type="button"
                                        onClick={() => setSize(selected ? "" : s)}
                                        aria-pressed={selected}
                                        disabled={!isAvailableInActiveVariant}
                                        className={`cursor-pointer rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
                                            selected
                                                ? "border-primary bg-primary text-white shadow-md shadow-primary/25"
                                                : isAvailableInActiveVariant
                                                ? "border-white/15 bg-white/10 text-white hover:border-primary/60 hover:bg-white/15"
                                                : "border-white/10 bg-white/5 text-white/30 cursor-not-allowed line-through"
                                        }`}
                                    >
                                        {s}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Quantity Controls */}
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

                {/* Add to Cart & Buy Now Buttons */}
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

            {/* Top Highlights (Below Add to Cart & Buy Now) */}
            {product.highlights && product.highlights.length > 0 && (
                <div className="mt-6 border-t border-white/10 pt-5">
                    <h3 className="mb-2.5 text-xs font-bold uppercase tracking-wider text-white/60">
                        {t("topHighlights") || "Top Highlights"}
                    </h3>
                    <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {product.highlights.map((highlight, idx) => (
                            <li
                                key={`${highlight.label}-${idx}`}
                                className="flex items-start gap-2 rounded-xl border border-white/10 bg-white/5 p-2.5 text-xs text-white/90"
                            >
                                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                                <div>
                                    <span className="font-semibold text-white">{highlight.label}: </span>
                                    <span>{highlight.value}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Description (Below Top Highlights) */}
            {product.description && (
                <div className="mt-5 border-t border-white/10 pt-4">
                    <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-white/60">
                        {t("description") || "Description"}
                    </h3>
                    {/<[a-z][\s\S]*>/i.test(product.description) ? (
                        <div
                            className="text-sm leading-relaxed text-white/85 [&_p]:mb-2.5 [&_p:last-child]:mb-0 [&_strong]:text-white [&_strong]:font-semibold"
                            dangerouslySetInnerHTML={{ __html: product.description }}
                        />
                    ) : (
                        <p className="text-sm leading-relaxed text-white/85">{product.description}</p>
                    )}
                </div>
            )}

            {/* Delivery & Security Badges */}
            <div className="mt-6 grid gap-3 border-t border-white/10 pt-5 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                    <Truck className="mt-0.5 h-4 w-4 text-primary" />
                    <div>
                        <p className="text-sm font-semibold text-white">{t("delivery")}</p>
                        <p className="text-xs text-white/65">
                            {product.localDeliveryFee != null
                                ? product.localDeliveryFee === 0
                                    ? "Free Local Delivery"
                                    : t("localDelivery", { price: formatPrice(product.localDeliveryFee) })
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
