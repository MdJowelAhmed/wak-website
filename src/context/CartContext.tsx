"use client";

import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from "react";
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

interface CartProviderProps {
    children: ReactNode;
    initialCartCount: number;
}

export function CartProvider({ children, initialCartCount }: CartProviderProps) {
    const { isLoggedIn } = useAuth();
    const [serverCount, setServerCount] = useState(initialCartCount);
    const [cartCount, setCartCount] = useState(initialCartCount);

    // A server refresh (login, router.refresh) sends a new snapshot; adopt it.
    if (serverCount !== initialCartCount) {
        setServerCount(initialCartCount);
        setCartCount(initialCartCount);
    }

    const refreshCart = useCallback(
        () =>
            apiGetCart()
                .then((res) => setCartCount(Array.isArray(res?.data?.items) ? res.data.items.length : 0))
                // Navbar badge must not break on cart errors
                .catch(() => {}),
        []
    );

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
