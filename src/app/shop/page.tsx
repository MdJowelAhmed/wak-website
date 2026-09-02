import Shop from "@/components/(customer-pages)/shop";
import { Category } from "@/components/(customer-pages)/shop/components/ShopFilter";
import { Product } from "@/components/(customer-pages)/home/components/NewArrival";
import { nextFetch } from "../../../helpers/myFetch";
import { getActiveCategories } from "../../../helpers/categoryService";

interface ShopPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }> | { [key: string]: string | string[] | undefined };
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
    const resolvedSearchParams = await searchParams;

    const params = new URLSearchParams();

    if (resolvedSearchParams?.minPrice) {
        params.append("minPrice", String(resolvedSearchParams.minPrice));
    }
    if (resolvedSearchParams?.maxPrice) {
        params.append("maxPrice", String(resolvedSearchParams.maxPrice));
    }
    if (resolvedSearchParams?.category) {
        params.append("category", String(resolvedSearchParams.category));
    }
    if (resolvedSearchParams?.minRating) {
        params.append("minRating", String(resolvedSearchParams.minRating));
    }
    if (resolvedSearchParams?.discount) {
        params.append("discount", String(resolvedSearchParams.discount));
    }

    const page = resolvedSearchParams?.page ? String(resolvedSearchParams.page) : "1";
    params.append("page", page);
    params.append("limit", "12");

    const [categoriesRes, productsRes] = await Promise.all([
        getActiveCategories(),
        nextFetch<Product[]>(`/products?${params.toString()}`),
    ]);

    const categoriesList = categoriesRes?.data || [];
    const products = productsRes?.data || [];
    const pagination = productsRes?.pagination || {
        total: 0,
        page: Number(page),
        limit: 12,
        totalPage: 1,
    };

    return (
        <Shop
            products={products}
            pagination={pagination}
            categoriesList={categoriesList}
            searchParams={resolvedSearchParams || {}}
        />
    );
}