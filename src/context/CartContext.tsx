"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { myFetch } from "../../helpers/myFetch";

interface CartContextValue {
    cartCount: number;
    refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextValue>({
    cartCount: 0,
    refreshCart: async () => {},
});

export function CartProvider({ children }: { children: ReactNode }) {
    const [cartCount, setCartCount] = useState(0);

    const refreshCart = useCallback(async () => {
        try {
            const res = await myFetch("/carts/", { cache: "no-store" });
            if (res?.data?.items) {
                setCartCount(res.data.items.length);
            } else {
                setCartCount(0);
            }
        } catch {
            // silently fail — navbar shouldn't break on cart error
        }
    }, []);

    // Fetch on mount and when auth changes
    useEffect(() => {
        refreshCart();

        const handleAuthChange = () => {
            refreshCart();
        };

        window.addEventListener("auth-change", handleAuthChange);
        return () => window.removeEventListener("auth-change", handleAuthChange);
    }, [refreshCart]);

    return (
        <CartContext.Provider value={{ cartCount, refreshCart }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}
