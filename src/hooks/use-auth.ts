
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
export function useAuth() {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const router = useRouter();

    useEffect(() => {
        // Check localStorage on mount
        const checkAuth = () => {
            const isLogin = localStorage.getItem("isLogin") === "true";
            setIsLoggedIn(isLogin);
            setIsLoading(false);
        };

        checkAuth();

        // Listen for storage changes (for multiple tabs or manual updates)
        window.addEventListener("storage", checkAuth);
        return () => window.removeEventListener("storage", checkAuth);
    }, []);

    const login = () => {
        localStorage.setItem("isLogin", "true");
        setIsLoggedIn(true);
        // Force a page refresh to update all components if needed
        window.location.reload();
    };

    const logout = () => {
        localStorage.removeItem("isLogin");
        setIsLoggedIn(false);
        router.push("/");
        router.refresh();
    };

    return { isLoggedIn, isLoading, login, logout };
}
