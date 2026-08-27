"use client";

import { useState } from "react";
import { Star, ShoppingCart, Zap, Truck, RotateCcw, Shield } from "lucide-react";
import Link from "next/link";
import { myFetch } from "../../../../../helpers/myFetch";
import { toast } from "sonner";

interface Highlight {
    label: string;
    value: string;
}

interface ProductInfoProps {
    productId: string;
    name: string;
    price: number;
    originalPrice?: number;
    discount?: number;
    rating: number;
    reviews: number;
    aboutItems: string[];
    highlights: Highlight[];
}

const guarantees = [
    { icon: Truck, label: "Free Delivery", sub: "On orders over $200" },
    { icon: RotateCcw, label: "Easy Returns", sub: "30-day return policy" },
    { icon: Shield, label: "2 Year Warranty", sub: "Full coverage" },
];

export default function ProductInfo({
    productId,
    name,
    price,
    originalPrice,
    discount,
    rating,
    reviews,
    aboutItems,
    highlights,
}: ProductInfoProps) {
    const [qty, setQty] = useState(1);
    const [addingToCart, setAddingToCart] = useState(false);

    const decrement = () => setQty((q) => Math.max(1, q - 1));
    const increment = () => setQty((q) => q + 1);

    const handleAddToCart = async () => {
        setAddingToCart(true);
        try {
            const res = await myFetch('/carts/', {
                method: 'POST',
                body: { product: productId, quantity: qty }
            });
            if (res?.success) {
                toast.success("Added to cart successfully!");
            } else {
                toast.error(res?.message || "Failed to add to cart");
            }
        } catch (error) {
            toast.error("An error occurred while adding to cart");
        } finally {
            setAddingToCart(false);
        }
    };

    const savings = originalPrice ? originalPrice - price : 0;

    return (
        <div className="flex flex-col h-full">

            <div className=" space-y-5">

                {/* ── Name ── */}

                <p className="text-2xl  font-semibold text-white leading-tight tracking-tight ">
                    {name}
                </p>


                {/* ── Price ── */}
                <div className="flex items-center gap-3 flex-wrap ">
                    <span className="text-3xl font-semibold text-primary tracking-tight">
                        ${price.toLocaleString()}
                    </span>
                    {originalPrice && (
                        <span className="text-white/70 line-through text-xl">
                            ${originalPrice.toLocaleString()}
                        </span>
                    )}
                </div>

                {/* ── Rating ── */}
                <div className="flex items-center gap-3 ">
                    <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`w-4 h-4 ${i < Math.floor(rating)
                                    ? "fill-[#FFC107] text-[#FFC107]"
                                    : "text-white/20 fill-white/20"
                                    }`}
                            />
                        ))}
                    </div>
                    <span className="text-white font-semibold text-sm">{rating}</span>
                    <span className="text-white/90 text-sm">({reviews} reviews)</span>
                </div>

                <div className="flex flex-col gap-4 ">
                    {/* Qty row */}
                    <div className="flex items-center gap-4">
                        <span className="text-white text-sm">Quantity</span>
                        <div className="flex items-center bg-white/10 backdrop-blur-sm border border-white/80 rounded-xl overflow-hidden">
                            <button
                                onClick={decrement}
                                className="w-10 h-10 text-white hover:text-white hover:bg-[#FF6700]/20 transition-all font-semibold text-xl cursor-pointer"
                            >
                                −
                            </button>
                            <span className="w-12 text-center text-white font-bold text-base border-x border-white/8">
                                {qty}
                            </span>
                            <button
                                onClick={increment}
                                className="w-10 h-10 text-white hover:text-white hover:bg-[#FF6700]/20 transition-all font-semibold text-xl cursor-pointer"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button 
                            onClick={handleAddToCart}
                            disabled={addingToCart}
                            className="w-full sm:flex-1 flex items-center justify-center gap-2 bg-transparent hover:bg-primary border border-white/75  text-white font-semibold py-3.5 rounded-xl text-sm transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                        >
                            <ShoppingCart className="w-4 h-4" />
                            {addingToCart ? "Adding..." : "Add to Cart"}
                        </button>
                        <Link
                            href="/check-out"
                            className="w-full sm:flex-1 flex items-center justify-center gap-2 bg-[#FF6700] hover:bg-orange-500 text-white font-semibold py-3.5 rounded-xl text-sm transition-all active:scale-95 shadow-xl shadow-orange-900/40 cursor-pointer"
                        >
                            <Zap className="w-4 h-4 fill-white" />
                            Buy Now
                        </Link>
                    </div>


                </div>
            </div>

            {/* ── Divider ── */}
            <div className="border-t border-white/5 pt-4" />

            {/* ── About this item ── */}
            <div className="my-4">
                <h3 className="text-sm font-medium text-white   mb-2">
                    About this item
                </h3>
                <ul className="space-y-2.5">
                    {aboutItems.map((item, idx) => (
                        <li key={idx} className="text-sm text-white/85 leading-relaxed font-light">
                            {item}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="border-t border-white/5 pt-4" />
            {/* ── Top Highlights ── */}
            <div className="">
                <h3 className="text-sm font-medium text-white  mb-4">
                    Specifications
                </h3>
                <div className="grid grid-cols-1 gap-y-3">
                    {highlights?.map(({ label, value }) => (
                        <div key={label} className="flex items-start gap-2 text-sm">
                            <span className="w-40 text-white/70 shrink-0">{label}</span>
                            <span className="text-white/95 ">{value}</span>
                        </div>
                    ))}
                </div>
            </div>


        </div>
    );
}
