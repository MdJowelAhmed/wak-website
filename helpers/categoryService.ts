import { myFetch, FetchResponse } from "./myFetch";

export interface Category {
    _id: string;
    name: string;
    slug: string;
    image: string;
    type: string;
    isFeatured?: boolean;
}

export interface CategoryQueryParams {
    type?: 'product' | 'service';
    isFeatured?: boolean;
    limit?: number;
}

/** Matches a URL `category` value against a category's slug, id or name. */
export function findCategory(categories: Category[], value: string): Category | undefined {
    const normalized = value.toLowerCase();
    return categories.find(
        (c) => c.slug === value || c._id === value || c.name.toLowerCase() === normalized
    );
}

export async function getActiveCategories(
    params?: CategoryQueryParams
): Promise<FetchResponse<Category[]>> {
    const query = new URLSearchParams();

    if (params?.type) {
        query.append("type", params.type);
    }
    if (params?.isFeatured !== undefined) {
        query.append("isFeatured", String(params.isFeatured));
    }
    if (params?.limit) {
        query.append("limit", String(params.limit));
    }

    const queryString = query.toString() ? `?${query.toString()}` : "";
    return await myFetch<Category[]>(`/categories/active${queryString}`, {
        cache: "force-cache",
        next: {
            revalidate: 3600, 
            tags: ["categories"],
        },
    });
}
