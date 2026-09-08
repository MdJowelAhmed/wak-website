"use client"

import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { resolveImageUrl } from '../../../../../helpers/resolveImageUrl';

export interface HeroData {
    _id: string;
    header: string;
    description: string;
    image: string;
    product?: { slug: string };
    service?: { slug: string };
    link?: string;
}

interface BannerProps {
    initialBanners?: HeroData[];
    loading?: boolean;
    count?: number;
}

export const BannerSkeleton = ({ count = 4 }: { count?: number }) => {
    const itemCount = count > 0 ? count : 4;
    return (
        <div className="w-full bg-background py-6 md:py-10">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 md:gap-6">
                    {Array.from({ length: itemCount }).map((_, i) => (
                        <div
                            key={i}
                            className="w-full min-h-[280px] sm:min-h-[320px] lg:min-h-[350px] rounded-2xl bg-card/60 border border-card-border p-6 md:p-8 flex flex-col justify-end gap-3 animate-pulse"
                        >
                            {/* Title Skeleton */}
                            <div className="h-6 sm:h-7 w-3/4 bg-white/15 rounded-lg" />
                            
                            {/* Description Skeleton */}
                            <div className="space-y-1.5 w-full">
                                <div className="h-3.5 w-full bg-white/10 rounded-md" />
                                <div className="h-3.5 w-4/5 bg-white/10 rounded-md" />
                            </div>

                            {/* Button Skeleton */}
                            <div className="mt-2 h-9 sm:h-10 w-28 sm:w-32 rounded-full bg-primary/40" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const Banner = ({ initialBanners, loading = false, count }: BannerProps) => {
    const router = useRouter();

    if (loading) {
        return <BannerSkeleton count={count || initialBanners?.length || 4} />;
    }

    const banners = initialBanners || [];

    if (banners.length === 0) return null;

    const handleShopNow = (item: HeroData) => {
        if (item.product?.slug) {
            router.push(`/shop/${item.product.slug}`);
        } else if (item.service?.slug) {
            router.push(`/services/${item.service.slug}`);
        } else if (item.link) {
            window.location.href = item.link;
        } else {
            router.push('/shop');
        }
    };

    return (
        <section className="w-full bg-background py-3 md:py-6">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                    {banners.map((item) => (
                        <div
                            key={item._id}
                            onClick={() => handleShopNow(item)}
                            className="group relative overflow-hidden rounded-2xl transition-all duration-300 min-h-[280px] sm:min-h-[320px] lg:min-h-[350px] flex flex-col justify-end p-6 md:p-8 cursor-pointer shadow-lg hover:shadow-xl"
                        >
                            {/* Background Image */}
                            <div className="absolute inset-0 w-full h-full">
                                <Image
                                    src={resolveImageUrl(item.image) || "/banner.png"}
                                    alt={item.header}
                                    fill
                                    unoptimized={true}
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    priority
                                />
                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                            </div>

                            {/* Content Overlay */}
                            <div className="relative z-10 flex flex-col items-start gap-2">
                                <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight group-hover:text-accent transition-colors line-clamp-2">
                                    {item.header}
                                </h3>
                                {item.description && (
                                    <p className="text-xs sm:text-sm text-zinc-200 font-medium line-clamp-2 leading-relaxed">
                                        {item.description}
                                    </p>
                                )}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleShopNow(item);
                                    }}
                                    className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary hover:bg-primary-hover text-white text-xs sm:text-sm font-semibold transition-all duration-300 group/btn cursor-pointer shadow-md"
                                >
                                    Shop Now
                                    <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Banner;
