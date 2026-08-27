"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { myFetch } from "../../helpers/myFetch";


// Reusable Cart Button
export default function CartButton() {
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        const fetchCart = async () => {
            try {
                // Adjust fetch path according to your structure
                const res = await myFetch('/carts/', { cache: 'no-store' });
                if (res?.data?.items) {
                    setCartCount(res.data.items.length);
                }
            } catch (error) {
                console.error("Failed to fetch cart for navbar", error);
            }
        };
        fetchCart();
    }, []);

    return (
        <Link href="/cart" className="relative group cursor-pointer shrink-0">
            <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center transition-colors group-hover:bg-white border border-zinc-800/80">
                <ShoppingCart className="w-5 h-5 text-zinc-700 group-hover:text-primary" />
            </div>
            {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                    {cartCount}
                </span>
            )}
            {cartCount === 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                    0
                </span>
            )}
        </Link>
    );
}