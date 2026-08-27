'use client';

import Image from "next/image";
import { Star, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProductCardProps {
    id: number;
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
            className={`p-4 rounded-xl group relative transition-all duration-300 cursor-pointer`}
            style={{ backgroundColor: bgColor || "#fff" }}
        >
            {/* Top Row: Discount and Cart */}
            <div className="flex justify-between items-center mb-4">
                {discount ? (
                    <span className="bg-[#FFDDA5] text-[#4f2c1d] text-xs font-bold px-2 py-1 rounded-xs">
                        -{discount}%
                    </span>
                ) : <div />}
                <button onClick={(e) => handleCartClick(e)} className="w-8 h-8 rounded-full  flex items-center justify-center text-white hover:bg-primary transition-colors cursor-pointer" style={{ backgroundColor: bgColor ? "#353535" : "#4f2c1d" }}>
                    <ShoppingCart className="w-4 h-4" />
                </button>
            </div>

            {/* Product Image */}
            <div className="relative w-full h-48 mb-6 flex items-center justify-center overflow-hidden">
                <div className="relative w-full h-full">
                    <Image
                        src={image}
                        alt={name}
                        fill
                        className="object-contain"
                        unoptimized={true}
                    />
                </div>
            </div>

            {/* Product Info */}
            <div className="space-y-2">
                <h3 className="text-zinc-900 font-medium text-base truncate">{name}</h3>

                <div className="flex items-center gap-3">
                    <span className="text-primary font-semibold">${currentPrice}</span>
                    {originalPrice && (
                        <span className="text-zinc-600 line-through text-sm">${originalPrice}</span>
                    )}
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1">
                    <div className="flex">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${i < Math.floor(rating) ? "fill-[#FFC107] text-[#FFC107]" : "text-zinc-600"}`}
                            />
                        ))}
                    </div>
                    <span className="text-zinc-600 text-xs ml-1">({reviews})</span>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
