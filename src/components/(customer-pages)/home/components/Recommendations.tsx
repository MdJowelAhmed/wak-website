"use client";

import { useEffect, useState, useTransition, useMemo } from "react";
import { Sparkles, ShoppingBag, Briefcase, ArrowRight } from "lucide-react";
import ProductCard from "@/shared/ProductCard";
import ServiceCard from "@/shared/ServiceCard";
import { productRequiresVariant } from "../../../../../helpers/product-variant";
import { resolveImageUrl } from "../../../../../helpers/resolveImageUrl";
import {
    RecommendationResponseData,
    RecommendedItem,
    RecommendedProductData,
    RecommendedServiceData,
    getPersonalizedRecommendations,
} from "../../../../../helpers/recommendationService";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useAuth } from "@/hooks/use-auth";

interface RecommendationsProps {
    initialRecommendations?: RecommendationResponseData | null;
}

export const RecommendationsSkeleton = ({ count = 5 }: { count?: number }) => {
    return (
        <section className="py-[50px] bg-background border-b border-border/40">
            <div className="container mx-auto px-4">
                {/* Header Skeleton */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="h-6 w-32 bg-primary/20 rounded-full animate-pulse" />
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                        <div className="space-y-2">
                            <div className="h-8 sm:h-9 w-64 bg-white/15 rounded-lg animate-pulse" />
                            <div className="h-4 w-48 sm:w-80 bg-white/10 rounded-md animate-pulse" />
                        </div>
                        <div className="flex gap-2">
                            <div className="h-9 w-20 bg-white/10 rounded-full animate-pulse" />
                            <div className="h-9 w-24 bg-white/10 rounded-full animate-pulse" />
                        </div>
                    </div>
                </div>

                {/* Grid Skeleton */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                    {Array.from({ length: count }).map((_, index) => (
                        <div
                            key={index}
                            className={`p-2.5 sm:p-4 rounded-xl bg-card border border-card-border flex flex-col justify-between gap-3 animate-pulse ${
                                index >= 4 ? "hidden xl:flex" : "flex"
                            }`}
                        >
                            <div className="flex justify-between items-center mb-2">
                                <div className="h-4 w-12 bg-white/10 rounded-xs" />
                                <div className="w-7 h-7 rounded-full bg-white/10" />
                            </div>
                            <div className="relative w-full h-28 sm:h-44 bg-white/10 rounded-xl" />
                            <div className="space-y-2">
                                <div className="h-4 w-3/4 bg-white/15 rounded-md" />
                                <div className="h-4 w-1/2 bg-primary/30 rounded-md" />
                                <div className="h-3 w-1/3 bg-white/10 rounded-md" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const Recommendations = ({ initialRecommendations = null }: RecommendationsProps) => {
    const router = useRouter();
    const { isLoggedIn, isLoading: authLoading } = useAuth();
    const t = useTranslations("Home");

    const [recommendations, setRecommendations] = useState<RecommendationResponseData | null>(
        initialRecommendations
    );
    const [loading, setLoading] = useState<boolean>(!initialRecommendations && isLoggedIn);
    const [activeTab, setActiveTab] = useState<"all" | "products" | "services">("all");
    const [, startTransition] = useTransition();

    // Helper to safely fetch translation with fallback
    const safeT = (key: string, fallback: string): string => {
        try {
            return t.has(key as never) ? t(key as never) : fallback;
        } catch {
            return fallback;
        }
    };

    // Client-side fetch when authenticated and no initial data or user logs in
    useEffect(() => {
        if (!isLoggedIn) {
            if (!initialRecommendations) {
                setRecommendations(null);
            }
            setLoading(false);
            return;
        }

        let isMounted = true;

        const fetchRecommendations = async () => {
            try {
                if (!recommendations) {
                    setLoading(true);
                }
                const res = await getPersonalizedRecommendations({ limit: 12, itemType: "All" });
                if (isMounted && res.success && res.data) {
                    setRecommendations(res.data);
                }
            } catch {
                // Silently handle error
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        // If we don't have recommendations yet or user just authenticated
        if (!recommendations || recommendations.items.length === 0) {
            fetchRecommendations();
        }

        return () => {
            isMounted = false;
        };
    }, [isLoggedIn, recommendations, initialRecommendations]);

    // Split items into Products and Services
    const { productItems, serviceItems, allItems } = useMemo(() => {
        const items: RecommendedItem[] = recommendations?.items || [];
        const products = items.filter((it) => it.type === "Product");
        const services = items.filter((it) => it.type === "Service");
        return {
            productItems: products,
            serviceItems: services,
            allItems: items,
        };
    }, [recommendations]);

    // Handle view all navigation
    const handleViewAllProducts = () => {
        const cookies = document.cookie;
        if (!cookies.includes("user-mode=customer")) {
            document.cookie = "user-mode=customer; path=/; max-age=31536000";
        }
        router.push("/shop");
        router.refresh();
    };

    const handleViewAllServices = () => {
        const cookies = document.cookie;
        if (!cookies.includes("user-mode=service")) {
            document.cookie = "user-mode=service; path=/; max-age=31536000";
        }
        router.push("/services");
        router.refresh();
    };

    // If loading
    if (loading || (authLoading && !recommendations)) {
        return <RecommendationsSkeleton count={5} />;
    }

    // If user is not logged in or has no recommended items, gracefully don't render
    if (!isLoggedIn && (!recommendations || allItems.length === 0)) {
        return null;
    }

    if (allItems.length === 0) {
        return null;
    }

    const hasProducts = productItems.length > 0;
    const hasServices = serviceItems.length > 0;
    const hasBoth = hasProducts && hasServices;
    const isAiCollaborative = recommendations?.source === "ai_collaborative";

    return (
        <section className="py-[50px] bg-background relative overflow-hidden">
            {/* Subtle background glow */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none -z-10" />
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none -z-10" />

            <div className="container mx-auto px-4">
                {/* Main Header */}
                <div className="mb-8 md:mb-10">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
                        <div className="flex items-center gap-2.5">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 backdrop-blur-xs">
                                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                                {isAiCollaborative
                                    ? safeT("recommendations.eyebrow", "Personalized For You")
                                    : safeT("recommendations.trending", "Trending For You")}
                            </span>
                            <span className="text-xs text-foreground/50 hidden sm:inline">
                                {isAiCollaborative
                                    ? safeT("recommendations.badge", "AI Tailored")
                                    : safeT("recommendations.badge", "Top Picks")}
                            </span>
                        </div>

                        {/* Filter Tabs if both products and services exist */}
                        {hasBoth && (
                            <div className="flex items-center p-1 bg-secondary/80 backdrop-blur-md rounded-xl border border-white/5 text-xs sm:text-sm font-medium">
                                <button
                                    onClick={() => startTransition(() => setActiveTab("all"))}
                                    className={`px-3 sm:px-4 py-1.5 rounded-lg transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                                        activeTab === "all"
                                            ? "bg-primary text-primary-foreground shadow-sm font-semibold"
                                            : "text-foreground/70 hover:text-foreground hover:bg-white/5"
                                    }`}
                                >
                                    <Sparkles className="w-3.5 h-3.5" />
                                    <span>{safeT("recommendations.all", "All")}</span>
                                    <span className="text-[11px] opacity-75">({allItems.length})</span>
                                </button>

                                <button
                                    onClick={() => startTransition(() => setActiveTab("products"))}
                                    className={`px-3 sm:px-4 py-1.5 rounded-lg transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                                        activeTab === "products"
                                            ? "bg-primary text-primary-foreground shadow-sm font-semibold"
                                            : "text-foreground/70 hover:text-foreground hover:bg-white/5"
                                    }`}
                                >
                                    <ShoppingBag className="w-3.5 h-3.5" />
                                    <span>{safeT("recommendations.products", "Products")}</span>
                                    <span className="text-[11px] opacity-75">({productItems.length})</span>
                                </button>

                                <button
                                    onClick={() => startTransition(() => setActiveTab("services"))}
                                    className={`px-3 sm:px-4 py-1.5 rounded-lg transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                                        activeTab === "services"
                                            ? "bg-primary text-primary-foreground shadow-sm font-semibold"
                                            : "text-foreground/70 hover:text-foreground hover:bg-white/5"
                                    }`}
                                >
                                    <Briefcase className="w-3.5 h-3.5" />
                                    <span>{safeT("recommendations.services", "Services")}</span>
                                    <span className="text-[11px] opacity-75">({serviceItems.length})</span>
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-between items-end">
                        <div>
                            <h2 className="title mb-1!">{safeT("recommendations.title", "Recommended For You")}</h2>
                            <p className="text-xs sm:text-sm text-foreground/60 max-w-xl">
                                {safeT(
                                    "recommendations.subtitle",
                                    "AI-tailored products and services handpicked based on your taste and activity"
                                )}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content Sections */}
                <div className="space-y-12">
                    {/* Products Block */}
                    {hasProducts && (activeTab === "all" || activeTab === "products") && (
                        <div>
                            {hasBoth && activeTab === "all" && (
                                <div className="flex items-center justify-between mb-4 pb-2 border-b border-border/50">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-6 bg-primary rounded-xs" />
                                        <h3 className="text-base sm:text-lg font-bold text-foreground">
                                            {safeT("recommendations.recommendedProducts", "Recommended Products")}
                                        </h3>
                                    </div>
                                    <button
                                        onClick={handleViewAllProducts}
                                        className="flex items-center gap-1.5 text-xs sm:text-sm text-foreground font-semibold hover:text-primary transition-colors group cursor-pointer"
                                    >
                                        <span>{safeT("recommendations.viewAllProducts", "View All")}</span>
                                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform rtl:rotate-180" />
                                    </button>
                                </div>
                            )}

                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                                {productItems.map((item, index) => {
                                    const product = item.data as RecommendedProductData;
                                    return (
                                        <div
                                            key={product._id || item.id}
                                            className={index >= 5 && activeTab === "all" ? "hidden xl:block" : "block"}
                                        >
                                            <ProductCard
                                                product={{
                                                    id: product.slug || product._id,
                                                    productId: product._id,
                                                    name: product.name,
                                                    image: resolveImageUrl(product.images?.[0]) || "/placeholder.jpg",
                                                    currentPrice: product.discountPrice || product.price,
                                                    originalPrice: product.price,
                                                    discount: product.discountPrice
                                                        ? Math.round(
                                                              ((product.price - product.discountPrice) / product.price) *
                                                                  100
                                                          )
                                                        : 0,
                                                    rating: product.ratingAverage || 0,
                                                    reviews: product.ratingCount || 0,
                                                    requiresVariant: productRequiresVariant(product),
                                                }}
                                            />
                                        </div>
                                    );
                                })}
                            </div>

                            {activeTab === "products" && (
                                <div className="mt-8 text-center">
                                    <button
                                        onClick={handleViewAllProducts}
                                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-primary/30 text-primary font-semibold text-sm hover:bg-primary hover:text-primary-foreground transition-all duration-200 cursor-pointer shadow-xs"
                                    >
                                        <span>{safeT("recommendations.viewAllProducts", "Explore All Products")}</span>
                                        <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Services Block */}
                    {hasServices && (activeTab === "all" || activeTab === "services") && (
                        <div>
                            {hasBoth && activeTab === "all" && (
                                <div className="flex items-center justify-between mb-4 pb-2 border-b border-border/50">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-6 bg-accent rounded-xs" />
                                        <h3 className="text-base sm:text-lg font-bold text-foreground">
                                            {safeT("recommendations.recommendedServices", "Recommended Services")}
                                        </h3>
                                    </div>
                                    <button
                                        onClick={handleViewAllServices}
                                        className="flex items-center gap-1.5 text-xs sm:text-sm text-foreground font-semibold hover:text-accent transition-colors group cursor-pointer"
                                    >
                                        <span>{safeT("recommendations.viewAllServices", "View All")}</span>
                                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform rtl:rotate-180" />
                                    </button>
                                </div>
                            )}

                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6">
                                {serviceItems.map((item) => {
                                    const service = item.data as RecommendedServiceData;
                                    const creatorName =
                                        service.creator?.name || safeT("services.unknown", "Wak Provider");
                                    return (
                                        <ServiceCard
                                            key={service._id || item.id}
                                            id={service.slug || service._id}
                                            name={creatorName}
                                            avatar={
                                                resolveImageUrl(service.creator?.profileImage) ||
                                                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                                    creatorName
                                                )}&background=random`
                                            }
                                            rating={service.averageRating ?? service.ratingAverage ?? 0}
                                            reviewCount={service.ratingCount ?? service.bookingsCount ?? 0}
                                            category={
                                                service.category?.name ||
                                                safeT("services.fallbackCategory", "Service")
                                            }
                                            description={service.name || ""}
                                            price={service.price || 0}
                                            coverImage={
                                                resolveImageUrl(service.image || service.images?.[0]) ||
                                                "/placeholder.jpg"
                                            }
                                        />
                                    );
                                })}
                            </div>

                            {activeTab === "services" && (
                                <div className="mt-8 text-center">
                                    <button
                                        onClick={handleViewAllServices}
                                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-accent/40 text-accent font-semibold text-sm hover:bg-accent hover:text-white transition-all duration-200 cursor-pointer shadow-xs"
                                    >
                                        <span>{safeT("recommendations.viewAllServices", "Explore All Services")}</span>
                                        <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Recommendations;
