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
import { RecommendedProductsSkeleton } from "./components/RecommendedProducts";
import { RecommendedServicesSkeleton } from "./components/RecommendedServices";
import {
    RecommendedProductsSection,
    RecommendedServicesSection,
} from "./components/RecommendationSections";
import { getActiveCategories } from "../../../../helpers/categoryService";
import { myFetch } from "../../../../helpers/myFetch";
import { normalizeShoppingCountryCode } from "../../../../helpers/regions";
import { cookies, headers } from "next/headers";
import { mapHeroBanners } from "../../../../helpers/mapHeroBanner";

const NEW_ARRIVAL_COUNT = 6;
const SERVICES_COUNT = 10;

const Home = async () => {
    const [headerStore, cookieStore] = await Promise.all([headers(), cookies()]);
    const countryCode = normalizeShoppingCountryCode(headerStore.get("x-country-code"));
    const countryQuery = `countryCode=${encodeURIComponent(countryCode)}`;
    const hasAuthToken = Boolean(cookieStore.get("accessToken")?.value);

    const [prodRes, servRes, bestSellingRes, newArrivalsRes, servicesRes, heroRes] = await Promise.all([
        getActiveCategories({ type: 'product' }),
        getActiveCategories({ type: 'service' }),
        myFetch(`/products/best-selling?${countryQuery}`, {
            cache: 'force-cache',
            next: { revalidate: 3600, tags: ['products', `products-best-selling-${countryCode}`] },
        }),
        myFetch(`/products?${countryQuery}&limit=${NEW_ARRIVAL_COUNT}`, {
            cache: 'force-cache',
            next: { revalidate: 3600, tags: ['products', `products-${countryCode}`] },
        }),
        myFetch(`/services?limit=${SERVICES_COUNT}`, {
            cache: 'force-cache',
            next: { revalidate: 3600, tags: ['services'] },
        }),
        myFetch(`/hero-section?countryCode=${encodeURIComponent(countryCode)}`, {
            cache: 'force-cache',
            next: { revalidate: 3600, tags: [`hero-section-${countryCode}`] },
        }),
    ]);

    const productCategories = prodRes?.data || [];
    const serviceCategories = servRes?.data || [];
    const bestSellingProducts = bestSellingRes?.data || [];
    const newArrivalProducts = newArrivalsRes?.data || [];
    const servicesList = servicesRes?.data || [];
    const heroBanners = mapHeroBanners(heroRes?.data);

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

            <Suspense fallback={<RecommendedProductsSkeleton />}>
                <RecommendedProductsSection
                    key={`rec-products-${countryCode}`}
                    hasAuthToken={hasAuthToken}
                    fallback={bestSellingProducts.slice(0, 5)}
                />
            </Suspense>

            <Suspense fallback={<BestSellingSkeleton />}>
                <BestSelling key={countryCode} initialProducts={bestSellingProducts} />
            </Suspense>
            <NewArrival key={countryCode} initialProducts={newArrivalProducts} />

            <Suspense fallback={<RecommendedServicesSkeleton />}>
                <RecommendedServicesSection
                    hasAuthToken={hasAuthToken}
                    fallback={servicesList.slice(0, 5)}
                />
            </Suspense>

            <Services initialServices={servicesList} />
            <AppDownloadSection />
            <Features />
        </main>
    );
};

export default Home;
