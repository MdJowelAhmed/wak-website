import { Suspense } from "react";
import UserModeReset from "./components/UserModeReset";
import UserTypes from "./components/UserTypes";
import AllBrands from "./components/AllBrands";
import Banner, { BannerSkeleton } from "./components/Banner";
import BestSelling, { BestSellingSkeleton } from "./components/BestSelling";
import FeaturedCategories from "./components/FeaturedCategories";
import Features from "./components/Features";
import NewArrival from "./components/NewArrival";
import Services from "./components/Services";
import AppDownloadSection from "./components/AppDownloadSection";
import { getActiveCategories } from "../../../../helpers/categoryService";
import { myFetch } from "../../../../helpers/myFetch";

const Home = async () => {
    // Server-side cached parallel fetch for all sections
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
        myFetch('/products/best-selling', {
            cache: 'force-cache',
            next: { revalidate: 3600, tags: ['products'] },
        }),
        myFetch('/products', {
            cache: 'force-cache',
            next: { revalidate: 3600, tags: ['products'] },
        }),
        myFetch('/services', {
            cache: 'force-cache',
            next: { revalidate: 3600, tags: ['services'] },
        }),
        myFetch('/hero-section', {
            cache: 'force-cache',
            next: { revalidate: 3600, tags: ['hero-section'] },
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
                <Banner initialBanners={heroBanners} />
            </Suspense>
            <UserTypes />
            <AllBrands
                productCategories={productCategories}
                serviceCategories={serviceCategories}
            />
            {/* <FeaturedCategories /> */}
            <Suspense fallback={<BestSellingSkeleton />}>
                <BestSelling initialProducts={bestSellingProducts} />
            </Suspense>
            <NewArrival initialProducts={newArrivalProducts} />
            <Services initialServices={servicesList} />
            <AppDownloadSection />
            <Features />
        </main>
    );
};

export default Home;