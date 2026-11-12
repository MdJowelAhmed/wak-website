import Shop from "@/components/(customer-pages)/shop";
import { Product } from "@/components/(customer-pages)/home/components/NewArrival";
import { nextFetch } from "../../../../helpers/myFetch";
import { findCategory, getActiveCategories } from "../../../../helpers/categoryService";

type SearchParams = { [key: string]: string | string[] | undefined };

interface ShopPageProps {
    searchParams: Promise<SearchParams>;
}

const PAGE_SIZE = 12;
const PASS_THROUGH_FILTERS = ["minPrice", "maxPrice", "minRating", "discount"] as const;

function fetchProducts(searchParams: SearchParams, page: string, categoryId?: string) {
    const params = new URLSearchParams();
    for (const key of PASS_THROUGH_FILTERS) {
        if (searchParams[key]) params.append(key, String(searchParams[key]));
    }
    if (categoryId) params.append("category", categoryId);
    params.append("page", page);
    params.append("limit", String(PAGE_SIZE));

    return nextFetch<Product[]>(`/products?${params.toString()}`, {
        cache: 'force-cache',
        next: { revalidate: 3600, tags: ['products'] },
        debug: true,
    });
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
    const resolvedSearchParams = await searchParams;
    const page = resolvedSearchParams.page ? String(resolvedSearchParams.page) : "1";
    const categoryValue = resolvedSearchParams.category ? String(resolvedSearchParams.category) : undefined;

    const categoriesPromise = getActiveCategories({ type: 'product' });
    // The category filter needs the category id, so only that case waits for categories.
    const productsPromise = categoryValue
        ? categoriesPromise.then((res) =>
              fetchProducts(resolvedSearchParams, page, findCategory(res?.data || [], categoryValue)?._id || categoryValue)
          )
        : fetchProducts(resolvedSearchParams, page);

    const [categoriesRes, productsRes] = await Promise.all([categoriesPromise, productsPromise]);

    const products = productsRes?.data || [];
    const pagination = productsRes?.pagination || {
        total: 0,
        page: Number(page),
        limit: PAGE_SIZE,
        totalPage: 1,
    };

    return (
        <Shop
            products={products}
            pagination={pagination}
            categoriesList={categoriesRes?.data || []}
            searchParams={resolvedSearchParams}
        />
    );
}
