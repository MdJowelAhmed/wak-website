"use client";

import { Sparkles, ArrowRight } from "lucide-react";
import ProductCard from "@/shared/ProductCard";
import { productRequiresVariant } from "../../../../../helpers/product-variant";
import { resolveImageUrl } from "../../../../../helpers/resolveImageUrl";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";

export interface RecommendedProduct {
    _id: string;
    name: string;
    images: string[];
    price: number;
    discountPrice?: number;
    ratingAverage?: number;
    ratingCount?: number;
    slug?: string;
    colors?: string[];
    sizes?: string[];
    variants?: unknown[];
    hasVariant?: boolean;
}

interface RecommendedProductsProps {
    initialProducts?: RecommendedProduct[];
    isAi?: boolean;
}

export const RecommendedProductsSkeleton = ({ count = 5 }: { count?: number }) => {
    return (
        <section className="py-[40px] bg-background">
            <div className="container mx-auto px-4">
                <div className="mb-6">
                    <div className="h-5 w-32 bg-primary/20 rounded-full animate-pulse mb-3" />
                    <div className="flex justify-between items-end">
                        <div className="h-8 w-60 bg-white/15 rounded-lg animate-pulse" />
                        <div className="h-6 w-20 bg-white/10 rounded-md animate-pulse" />
                    </div>
                </div>

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

const RecommendedProducts = ({
    initialProducts = [],
    isAi = false,
}: RecommendedProductsProps) => {
    const router = useRouter();
    const t = useTranslations("Home");
    const products = initialProducts.slice(0, 5);

    const safeT = (key: string, fallback: string): string => {
        try {
            return t.has(key as never) ? t(key as never) : fallback;
        } catch {
            return fallback;
        }
    };

    const handleClick = () => {
        const cookies = document.cookie;
        if (!cookies.includes("user-mode=customer")) {
            document.cookie = "user-mode=customer; path=/; max-age=31536000";
        }
        router.push("/shop");
        router.refresh();
    };

    if (products.length === 0) {
        return null;
    }

    return (
        <section className="py-[40px] bg-background">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-4 md:mb-6">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                            {isAi
                                ? safeT("recommendations.eyebrow", "Personalized For You")
                                : safeT("recommendations.trending", "Trending For You")}
                        </span>
                    </div>

                    <div className="flex justify-between items-end">
                        <div className="flex items-center gap-3">
                            <div className="w-4 h-8 bg-primary rounded-xs hidden sm:block"></div>
                            <h2 className="title mb-0!">
                                {safeT("recommendations.recommendedProducts", "Recommended Products")}
                            </h2>
                        </div>
                        <button
                            className="flex items-center gap-2 text-foreground font-semibold hover:text-primary transition-colors group cursor-pointer"
                            onClick={handleClick}
                        >
                            {safeT("viewAll", "View All")}
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform rtl:rotate-180" />
                        </button>
                    </div>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                    {products.map((product) => (
                        <ProductCard
                            key={product._id}
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
                    ))}
                </div>
            </div>
        </section>
    );
};

export default RecommendedProducts;
