"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";

// Reusable Cart Button
export default function CartButton() {
    const { cartCount } = useCart();

    return (
        <Link href="/cart" className="relative group cursor-pointer shrink-0" title="Shopping Cart">
            <div className="w-10 h-10 rounded-full bg-primary hover:bg-card hover:border-primary flex items-center justify-center transition-all shadow-2xs">
                <ShoppingCart className="w-5 h-5 text-foreground group-hover:text-primary transition-colors" />
            </div>
            <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-card shadow-xs">
                {cartCount}
            </span>
        </Link>
    );
}