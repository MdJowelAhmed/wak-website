"use client";

import { Sparkles, ArrowRight } from "lucide-react";
import ServiceCard from "@/shared/ServiceCard";
import { resolveImageUrl } from "../../../../../helpers/resolveImageUrl";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";

export interface RecommendedService {
    _id: string;
    name: string;
    slug?: string;
    price: number;
    image?: string;
    images?: string[];
    category?: {
        _id?: string;
        name?: string;
        slug?: string;
    };
    averageRating?: number;
    ratingAverage?: number;
    bookingsCount?: number;
    ratingCount?: number;
    deliveryTime?: number;
    status?: string;
    creator?: {
        name?: string;
        profileImage?: string;
    };
}

interface RecommendedServicesProps {
    initialServices?: RecommendedService[];
    isAi?: boolean;
}

export const RecommendedServicesSkeleton = ({ count = 5 }: { count?: number }) => {
    return (
        <section className="py-[40px] bg-background">
            <div className="container mx-auto px-4">
                <div className="mb-6">
                    <div className="h-5 w-32 bg-accent/20 rounded-full animate-pulse mb-3" />
                    <div className="flex justify-between items-end">
                        <div className="h-8 w-60 bg-white/15 rounded-lg animate-pulse" />
                        <div className="h-6 w-20 bg-white/10 rounded-md animate-pulse" />
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6">
                    {Array.from({ length: count }).map((_, index) => (
                        <div
                            key={index}
                            className={`p-2.5 sm:p-4 rounded-xl bg-card border border-card-border flex flex-col justify-between gap-3 animate-pulse ${
                                index >= 4 ? "hidden xl:flex" : "flex"
                            }`}
                        >
                            <div className="relative w-full h-24 sm:h-44 bg-white/10 rounded-xl" />
                            <div className="space-y-2">
                                <div className="h-4 w-3/4 bg-white/15 rounded-md" />
                                <div className="h-4 w-1/2 bg-accent/30 rounded-md" />
                                <div className="h-3 w-1/3 bg-white/10 rounded-md" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const RecommendedServices = ({
    initialServices = [],
    isAi = false,
}: RecommendedServicesProps) => {
    const router = useRouter();
    const t = useTranslations("Home");
    const services = initialServices.slice(0, 5);

    const safeT = (key: string, fallback: string): string => {
        try {
            return t.has(key as never) ? t(key as never) : fallback;
        } catch {
            return fallback;
        }
    };

    const handleClick = () => {
        const cookies = document.cookie;
        if (!cookies.includes("user-mode=service")) {
            document.cookie = "user-mode=service; path=/; max-age=31536000";
        }
        router.push("/services");
        router.refresh();
    };

    if (services.length === 0) {
        return null;
    }

    return (
        <section className="py-[40px] bg-background">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-4 md:mb-6">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-accent/10 text-white border border-accent/20">
                            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                            {isAi
                                ? safeT("recommendations.eyebrow", "Personalized For You")
                                : safeT("recommendations.trending", "Trending For You")}
                        </span>
                    </div>

                    <div className="flex justify-between items-end">
                        <div className="flex items-center gap-3">
                            {/* <div className="w-4 h-8 bg-accent rounded-xs hidden sm:block"></div> */}
                            <h2 className="title mb-0!">
                                {safeT("recommendations.recommendedServices", "Recommended Services")}
                            </h2>
                        </div>
                        <button
                            className="flex items-center gap-2 text-white px-4 py-2 rounded-md font-medium hover:underline underline-offset-4 transition-all group cursor-pointer"
                            onClick={handleClick}
                        >
                            {safeT("viewAll", "View All")}
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform rtl:rotate-180" />
                        </button>
                    </div>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6">
                    {services.map((service) => {
                        const creatorName =
                            service.creator?.name || safeT("services.unknown", "Wak Provider");
                        return (
                            <ServiceCard
                                key={service._id}
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
                                    "/placeholder.svg"
                                }
                            />
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default RecommendedServices;
