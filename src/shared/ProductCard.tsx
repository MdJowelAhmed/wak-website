'use client';

import Image from "next/image";
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

const ProductCard = ({ product, bgColor }: { product: ProductCardProps, bgColor?: string }) => {
    const { id, name, image, currentPrice, originalPrice, discount, rating, reviews } = product as ProductCardProps
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
            className="p-2.5 sm:p-4 rounded-xl group relative transition-all duration-300 cursor-pointer flex flex-col justify-between bg-card border border-border hover:border-primary/60 shadow-xs hover:shadow-md"
        >
            {/* Top Row: Discount and Cart */}
            <div className="flex justify-between items-center mb-2 sm:mb-4">
                {discount ? (
                    <span className="bg-primary text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-md shadow-2xs">
                        -{discount}%
                    </span>
                ) : <div />}
                <button
                    onClick={(e) => handleCartClick(e)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white bg-secondary hover:bg-primary transition-all duration-200 cursor-pointer shadow-2xs"
                >
                    <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
            </div>

            {/* Product Image */}
            <div className="relative w-full h-28 sm:h-48 mb-2 sm:mb-6 flex items-center justify-center overflow-hidden">
                <div className="relative w-full h-full">
                    <Image
                        src={image}
                        alt={name}
                        fill
                        className="object-contain group-hover:scale-105 transition-transform duration-300"
                        unoptimized={true}
                    />
                </div>
            </div>

            {/* Product Info */}
            <div className="space-y-1.5 sm:space-y-2">
                <h3 className="text-foreground font-semibold text-xs sm:text-base truncate group-hover:text-primary transition-colors">{name}</h3>

                <div className="flex items-center gap-1.5 sm:gap-3">
                    <span className="text-primary font-bold text-xs sm:text-base">${currentPrice}</span>
                    {originalPrice && (
                        <span className="text-muted-text line-through text-[10px] sm:text-sm">${originalPrice}</span>
                    )}
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1">
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
