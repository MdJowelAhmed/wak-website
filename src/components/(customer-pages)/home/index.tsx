import { Suspense } from "react";
import UserModeReset from "./components/UserModeReset";
import UserTypes from "./components/UserTypes";
import AllBrands from "./components/AllBrands";
import Banner, { BannerSkeleton } from "./components/Banner";
import BestSelling, { BestSellingSkeleton } from "./components/BestSelling";
import Features from "./components/Features";
import NewArrival from "./components/NewArrival";
import Services from "./components/Services";
import AppDownloadSection from "./components/AppDownloadSection";
import RecommendedProducts, { RecommendedProductsSkeleton } from "./components/RecommendedProducts";
import RecommendedServices, { RecommendedServicesSkeleton } from "./components/RecommendedServices";
import { getActiveCategories } from "../../../../helpers/categoryService";
import { myFetch } from "../../../../helpers/myFetch";
import { normalizeShoppingCountryCode } from "../../../../helpers/regions";
import {
    RecommendationResponseData,
    RecommendedProductData,
    RecommendedServiceData,
} from "../../../../helpers/recommendationService";
import { cookies, headers } from "next/headers";
import { mapHeroBanners } from "../../../../helpers/mapHeroBanner";

const Home = async () => {
    const [headerStore, cookieStore] = await Promise.all([headers(), cookies()]);
    const countryCode = normalizeShoppingCountryCode(headerStore.get("x-country-code"));
    const countryQuery = `countryCode=${encodeURIComponent(countryCode)}`;
    const hasAuthToken = Boolean(cookieStore.get("accessToken")?.value);

    const [
        prodRes,
        servRes,
        bestSellingRes,
        newArrivalsRes,
        servicesRes,
        heroRes,
        recProdRes,
        recServRes,
    ] = await Promise.all([
        getActiveCategories({ type: 'product' }),
        getActiveCategories({ type: 'service' }),
        myFetch(`/products/best-selling?${countryQuery}`, {
            cache: 'force-cache',
            next: { revalidate: 3600, tags: ['products', `products-best-selling-${countryCode}`] },
        }),
        myFetch(`/products?${countryQuery}`, {
            cache: 'force-cache',
            next: { revalidate: 3600, tags: ['products', `products-${countryCode}`] },
        }),
        myFetch('/services', {
            cache: 'force-cache',
            next: { revalidate: 3600, tags: ['services'] },
        }),
        myFetch(`/hero-section?countryCode=${encodeURIComponent(countryCode)}`, {
            cache: 'force-cache',
            next: { revalidate: 3600, tags: [`hero-section-${countryCode}`] },
        }),
        // Only request personalized recommendations when the user is logged in
        hasAuthToken
            ? myFetch<RecommendationResponseData>(`/recommendations/me?limit=10&itemType=Product`, {
                cache: 'no-store',
            })
            : Promise.resolve(null),
        hasAuthToken
            ? myFetch<RecommendationResponseData>(`/recommendations/me?limit=10&itemType=Service`, {
                cache: 'no-store',
            })
            : Promise.resolve(null),
    ]);

    const productCategories = prodRes?.data || [];
    const serviceCategories = servRes?.data || [];
    const bestSellingProducts = bestSellingRes?.data || [];
    const newArrivalProducts = newArrivalsRes?.data || [];
    const servicesList = servicesRes?.data || [];
    const heroBanners = mapHeroBanners(heroRes?.data);

    const recProducts = (recProdRes?.data?.items
        ?.filter((it) => it.type === "Product")
        ?.map((it) => it.data) || []) as RecommendedProductData[];

    const recServices = (recServRes?.data?.items
        ?.filter((it) => it.type === "Service")
        ?.map((it) => it.data) || []) as RecommendedServiceData[];

    const recommendedProducts = recProducts.length > 0
        ? recProducts
        : bestSellingProducts.slice(0, 5);

    const recommendedServices = recServices.length > 0
        ? recServices
        : servicesList.slice(0, 5);

    return (
        <main className="w-full">
            <UserModeReset />
            <Suspense fallback={<BannerSkeleton />}>
                <Banner key={countryCode} initialBanners={heroBanners} />
            </Suspense>
            <UserTypes />
            <AllBrands
                productCategories={productCategories}
                serviceCategories={serviceCategories}
            />

            {/* Recommended Products Section */}
            <Suspense fallback={<RecommendedProductsSkeleton />}>
                <RecommendedProducts
                    key={`rec-products-${countryCode}`}
                    initialProducts={recommendedProducts}
                    isAi={recProducts.length > 0}
                />
            </Suspense>

            <Suspense fallback={<BestSellingSkeleton />}>
                <BestSelling key={countryCode} initialProducts={bestSellingProducts} />
            </Suspense>
            <NewArrival key={countryCode} initialProducts={newArrivalProducts} />

            {/* Recommended Services Section */}
            <Suspense fallback={<RecommendedServicesSkeleton />}>
                <RecommendedServices
                    key="rec-services"
                    initialServices={recommendedServices}
                    isAi={recServices.length > 0}
                />
            </Suspense>

            <Services initialServices={servicesList} />
            <AppDownloadSection />
            <Features />
        </main>
    );
};

export default Home;
