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

    const refreshCart = useCallback(
        () =>
            apiGetCart()
                .then((res) => setCartCount(Array.isArray(res?.data?.items) ? res.data.items.length : 0))
                // Navbar badge must not break on cart errors
                .catch(() => {}),
        []
    );

    useEffect(() => {
        if (isLoggedIn) {
            void refreshCart();
        }
    }, [isLoggedIn, refreshCart]);

    const visibleCount = isLoggedIn ? cartCount : 0;

    const contextValue = useMemo<CartContextValue>(
        () => ({ cartCount: visibleCount, refreshCart }),
        [visibleCount, refreshCart]
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
