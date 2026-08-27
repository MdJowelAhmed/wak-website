'use client';

import { useEffect } from "react";

export default function UserModeReset() {
    useEffect(() => {
        // Initialize user-mode cookie to 'customer' if it doesn't exist
        const hasCookie = document.cookie.includes("user-mode=");
        if (!hasCookie) {
            document.cookie = "user-mode=customer; path=/; max-age=31536000";
        }
    }, []);

    return null; // Renders absolutely nothing visually
}
