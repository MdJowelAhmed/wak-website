'use client';

import { useState } from "react";
import { Star, ShoppingCart, Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/hooks/use-currency";
import { myFetch } from "../../helpers/myFetch";

interface ProductCardProps {
    id: string | number;
    productId?: string;
    name: string;
    image: string;
    currentPrice: number;
    originalPrice?: number;
    discount?: number;
    rating: number;
    reviews: number;
}

const ProductCard = ({ product }: { product: ProductCardProps }) => {
    const { id, productId, name, image, currentPrice, originalPrice, discount, rating, reviews } = product;
    const router = useRouter();
    const { refreshCart } = useCart();
    const { formatPrice } = useCurrency();
    const [addingToCart, setAddingToCart] = useState(false);

    const handleClick = () => {
        const cookies = document.cookie;
        const hasMode = cookies.includes("user-mode=customer");

        if (!hasMode) {
            document.cookie = "user-mode=customer; path=/; max-age=31536000";
        }

        router.push(`/shop/${id}`);
        router.refresh();
    };

    const handleCartClick = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (addingToCart) return;

        setAddingToCart(true);
        try {
            const res = await myFetch("/carts/", {
                method: "POST",
                body: { product: productId || String(id), quantity: 1 },
            });
            if (res?.success) {
                toast.success("Added to cart");
                await refreshCart();
            } else {
                toast.error(res?.message || "Failed to add to cart");
            }
        } catch {
            toast.error("Could not add this product to cart");
        } finally {
            setAddingToCart(false);
        }
    };

    return (
        <div
            onClick={handleClick}
            className={`group relative h-full overflow-hidden rounded-xl sm:rounded-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between  hover:border-primary/60 shadow-xs hover:shadow-md  bg-secondary`}
        >
            {/* Cover Image with Badges */}
            <div className="relative w-full h-32 sm:h-48 overflow-hidden bg-section-bg">
                <Image
                    src={image}
                    alt={name}
                    fill
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-linear-to-b from-black/20 via-transparent to-black/30 pointer-events-none" />

                {/* Discount Badge */}
                {discount ? (
                    <span className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 bg-primary text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-md shadow-md">
                        -{discount}%
                    </span>
                ) : null}

                {/* Cart Button */}
                <button
                    type="button"
                    onClick={handleCartClick}
                    disabled={addingToCart}
                    className="absolute top-2 right-2 z-10 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-secondary/80 text-white shadow-md transition-all duration-200 hover:scale-105 hover:bg-primary disabled:cursor-not-allowed disabled:opacity-70 sm:top-3 sm:right-3 sm:h-8 sm:w-8"
                    aria-label="Add to cart"
                >
                    {addingToCart ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin sm:h-4 sm:w-4" />
                    ) : (
                        <ShoppingCart className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    )}
                </button>
            </div>

            {/* Product Info */}
            <div className="p-2.5 sm:p-4 space-y-1.5 sm:space-y-2 flex-1 flex flex-col justify-between">
                <div>
                    <h3 className="text-foreground font-semibold text-xs sm:text-base truncate group-hover:text-foreground/80 transition-colors">
                        {name}
                    </h3>

                    <div className="flex items-center gap-1.5 sm:gap-3 mt-1">
                        <span className="text-primary font-bold text-xs sm:text-base">{formatPrice(currentPrice)}</span>
                        {originalPrice && (
                            <span className="text-muted-text line-through text-[10px] sm:text-sm">{formatPrice(originalPrice)}</span>
                        )}
                    </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 pt-1">
                    <div className="flex">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${i < Math.floor(rating) ? "fill-[#FFC107] text-[#FFC107]" : "text-border"}`}
                            />
                        ))}
                    </div>
                    <span className="text-muted-text text-[10px] sm:text-xs ml-0.5 sm:ml-1">({reviews})</span>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;

