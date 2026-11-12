"use client";

import { useState, useEffect } from "react";
import { getActiveCategories, Category, CategoryQueryParams } from "../../helpers/categoryService";

export function useCategories(params?: CategoryQueryParams, enabled: boolean = true) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(enabled);
    const [error, setError] = useState<string | null>(null);
    const type = params?.type;
    const isFeatured = params?.isFeatured;
    const limit = params?.limit;

    useEffect(() => {
        if (!enabled) return;
        let isMounted = true;

        const fetchCategories = async () => {
            setLoading(true);
            try {
                const res = await getActiveCategories({ type, isFeatured, limit });
                if (!isMounted) return;
                if (res?.data) {
                    setCategories(
                        isFeatured === undefined ? res.data : res.data.filter((c) => c.isFeatured === isFeatured)
                    );
                }
                setError(res?.error || null);
            } catch (err: unknown) {
                if (isMounted) {
                    setError(err instanceof Error ? err.message : "Failed to fetch categories");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchCategories();

        return () => {
            isMounted = false;
        };
    }, [enabled, type, isFeatured, limit]);

    return { categories, loading, error };
}
