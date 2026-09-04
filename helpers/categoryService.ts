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
