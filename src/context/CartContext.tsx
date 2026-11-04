"use client";

import { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from "react";
import { apiGetCart } from "../../helpers/cartService";
import { useAuth } from "./AuthContext";

interface CartContextValue {
    cartCount: number;
    refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextValue>({
    cartCount: 0,
    refreshCart: async () => {},
});

export function CartProvider({ children }: { children: ReactNode }) {
    const { isLoggedIn } = useAuth();
    const [cartCount, setCartCount] = useState(0);

    const refreshCart = useCallback(async () => {
        if (!isLoggedIn) {
            setCartCount(0);
            return;
        }
        try {
            const res = await apiGetCart();
            if (res?.data?.items) {
                setCartCount(res.data.items.length);
            } else {
                setCartCount(0);
            }
        } catch {
            // silently fail — navbar shouldn't break on cart error
        }
    }, [isLoggedIn]);

    // Fetch on mount and when auth changes
    useEffect(() => {
        if (!isLoggedIn) {
            setCartCount(0);
            return;
        }

        refreshCart();

        const handleAuthChange = () => {
            refreshCart();
        };

        window.addEventListener("auth-change", handleAuthChange);
        return () => window.removeEventListener("auth-change", handleAuthChange);
    }, [isLoggedIn, refreshCart]);

    const contextValue = useMemo<CartContextValue>(
        () => ({ cartCount, refreshCart }),
        [cartCount, refreshCart]
    );

    return (
        <CartContext.Provider value={contextValue}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}
