import Shop from "@/components/(customer-pages)/shop";
import { Category } from "@/components/(customer-pages)/shop/components/ShopFilter";
import { Product } from "@/components/(customer-pages)/home/components/NewArrival";
import { nextFetch } from "../../../../helpers/myFetch";
import { getActiveCategories } from "../../../../helpers/categoryService";

interface ShopPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }> | { [key: string]: string | string[] | undefined };
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
    const resolvedSearchParams = await searchParams;

    const categoriesRes = await getActiveCategories({ type: 'product' });
    const categoriesList = categoriesRes?.data || [];

    const params = new URLSearchParams();

    if (resolvedSearchParams?.minPrice) {
        params.append("minPrice", String(resolvedSearchParams.minPrice));
    }
    if (resolvedSearchParams?.maxPrice) {
        params.append("maxPrice", String(resolvedSearchParams.maxPrice));
    }
    if (resolvedSearchParams?.category) {
        const categoryVal = String(resolvedSearchParams.category);
        const matchedCategory = categoriesList.find(
            (c) => c.slug === categoryVal || c._id === categoryVal || c.name.toLowerCase() === categoryVal.toLowerCase()
        );
        const finalCategoryParam = matchedCategory?._id || categoryVal;
        params.append("category", finalCategoryParam);
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

    const productsRes = await nextFetch<Product[]>(`/products?${params.toString()}`, {
        cache: 'force-cache',
        next: { revalidate: 3600, tags: ['products'] },
    });

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