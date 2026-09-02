"use client";

import { useState, useEffect } from "react";
import { getActiveCategories, Category, CategoryQueryParams } from "../../helpers/categoryService";

export function useCategories(params?: CategoryQueryParams) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const fetchCategories = async () => {
            setLoading(true);
            try {
                const res = await getActiveCategories(params);
                if (isMounted) {
                    if (res?.data) {
                        let filtered = res.data;
                        if (params?.isFeatured !== undefined) {
                            filtered = filtered.filter((c) => c.isFeatured === params.isFeatured);
                        }
                        setCategories(filtered);
                    }
                    setError(res?.error || null);
                }
            } catch (err: any) {
                if (isMounted) {
                    setError(err?.message || "Failed to fetch categories");
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
    }, [params?.type, params?.isFeatured, params?.limit]);

    return { categories, loading, error };
}
