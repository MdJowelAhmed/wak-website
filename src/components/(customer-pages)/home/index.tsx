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
import { getActiveCategories } from "../../../../helpers/categoryService";
import { myFetch } from "../../../../helpers/myFetch";
import { normalizeShoppingCountryCode } from "../../../../helpers/regions";
import { headers } from "next/headers";

const Home = async () => {
    const headerStore = await headers();
    const countryCode = normalizeShoppingCountryCode(headerStore.get("x-country-code"));
    const countryQuery = `countryCode=${encodeURIComponent(countryCode)}`;

    const [
        prodRes,
        servRes,
        bestSellingRes,
        newArrivalsRes,
        servicesRes,
        heroRes,
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
    ]);

    const productCategories = prodRes?.data || [];
    const serviceCategories = servRes?.data || [];
    const bestSellingProducts = bestSellingRes?.data || [];
    const newArrivalProducts = newArrivalsRes?.data || [];
    const servicesList = servicesRes?.data || [];
    const heroBanners = heroRes?.data || [];

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
            <Suspense fallback={<BestSellingSkeleton />}>
                <BestSelling key={countryCode} initialProducts={bestSellingProducts} />
            </Suspense>
            <NewArrival key={countryCode} initialProducts={newArrivalProducts} />
            <Services initialServices={servicesList} />
            <AppDownloadSection />
            <Features />
        </main>
    );
};

export default Home;