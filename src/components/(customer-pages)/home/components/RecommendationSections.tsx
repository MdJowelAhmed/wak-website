import { myFetch } from "../../../../../helpers/myFetch";
import type {
    RecommendationResponseData,
    RecommendedProductData,
    RecommendedServiceData,
} from "../../../../../helpers/recommendationService";
import RecommendedProducts from "./RecommendedProducts";
import RecommendedServices from "./RecommendedServices";

type ItemType = "Product" | "Service";

async function fetchRecommendations<T>(itemType: ItemType, hasAuthToken: boolean): Promise<T[]> {
    if (!hasAuthToken) return [];
    const res = await myFetch<RecommendationResponseData>(
        `/recommendations/me?limit=10&itemType=${itemType}`,
        { cache: "no-store" },
    );
    return (res?.data?.items
        ?.filter((item) => item.type === itemType)
        .map((item) => item.data) ?? []) as T[];
}

interface SectionProps<T> {
    hasAuthToken: boolean;
    fallback: T[];
}

export async function RecommendedProductsSection({
    hasAuthToken,
    fallback,
}: SectionProps<RecommendedProductData>) {
    const items = await fetchRecommendations<RecommendedProductData>("Product", hasAuthToken);
    return (
        <RecommendedProducts
            initialProducts={items.length > 0 ? items : fallback}
            isAi={items.length > 0}
        />
    );
}

export async function RecommendedServicesSection({
    hasAuthToken,
    fallback,
}: SectionProps<RecommendedServiceData>) {
    const items = await fetchRecommendations<RecommendedServiceData>("Service", hasAuthToken);
    return (
        <RecommendedServices
            initialServices={items.length > 0 ? items : fallback}
            isAi={items.length > 0}
        />
    );
}
