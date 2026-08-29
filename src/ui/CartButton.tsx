"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";

// Reusable Cart Button
export default function CartButton() {
    const { cartCount } = useCart();

    return (
        <Link href="/cart" className="relative group cursor-pointer shrink-0">
            <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center transition-colors group-hover:bg-white border border-zinc-800/80">
                <ShoppingCart className="w-5 h-5 text-zinc-700 group-hover:text-primary" />
            </div>
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                {cartCount}
            </span>
        </Link>
    );
}