'use client';

import Link from 'next/link';
import { Heart } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function WishlistButton() {
    const [wishlistCount, setWishlistCount] = useState(0);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('wishlist_count');
            if (saved) {
                setWishlistCount(parseInt(saved, 10) || 0);
            }
        }
    }, []);

    return (
        <Link
            href="/profile"
            className="relative group cursor-pointer shrink-0"
            title="Wishlist"
        >
            <div className="w-10 h-10 rounded-full bg-section-bg hover:bg-card border border-border hover:border-primary flex items-center justify-center transition-all shadow-2xs">
                <Heart className="w-5 h-5 text-foreground group-hover:text-primary transition-colors" />
            </div>
            {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-card shadow-xs">
                    {wishlistCount}
                </span>
            )}
        </Link>
    );
}
