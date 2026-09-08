'use client';

import { Star, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProductCardProps {
    id: string | number;
    name: string;
    image: string;
    currentPrice: number;
    originalPrice?: number;
    discount?: number;
    rating: number;
    reviews: number;
}

const ProductCard = ({ product }: { product: ProductCardProps }) => {
    const { id, name, image, currentPrice, originalPrice, discount, rating, reviews } = product as ProductCardProps;
    const router = useRouter();

    const handleClick = () => {
        const cookies = document.cookie;
        const hasMode = cookies.includes("user-mode=customer");

        if (!hasMode) {
            document.cookie = "user-mode=customer; path=/; max-age=31536000";
        }

        router.push(`/shop/${id}`);
        router.refresh();
    };

    const handleCartClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        router.push(`/cart`);
        router.refresh();
    };

    return (
        <div
            onClick={handleClick}
            className={`group relative h-full overflow-hidden rounded-xl sm:rounded-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between  hover:border-primary/60 shadow-xs hover:shadow-md  bg-primary/10`}
        >
            {/* Cover Image with Badges */}
            <div className="relative w-full h-32 sm:h-48 overflow-hidden bg-section-bg">
                <img
                    src={image}
                    alt={name}
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
                    onClick={handleCartClick}
                    className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white bg-secondary/80 hover:bg-primary transition-all duration-200 cursor-pointer shadow-md hover:scale-105"
                    aria-label="Add to cart"
                >
                    <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
            </div>

            {/* Product Info */}
            <div className="p-2.5 sm:p-4 space-y-1.5 sm:space-y-2 flex-1 flex flex-col justify-between">
                <div>
                    <h3 className="text-foreground font-semibold text-xs sm:text-base truncate group-hover:text-primary transition-colors">
                        {name}
                    </h3>

                    <div className="flex items-center gap-1.5 sm:gap-3 mt-1">
                        <span className="text-primary font-bold text-xs sm:text-base">${currentPrice}</span>
                        {originalPrice && (
                            <span className="text-muted-text line-through text-[10px] sm:text-sm">${originalPrice}</span>
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
                    <span className="text-body-text text-[10px] sm:text-xs ml-0.5 sm:ml-1">({reviews})</span>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;

