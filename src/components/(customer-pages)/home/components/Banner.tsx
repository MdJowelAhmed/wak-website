"use client";

import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { resolveImageUrl } from "../../../../../helpers/resolveImageUrl";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export interface HeroData {
    _id: string;
    header: string;
    description: string;
    image: string;
    type?: "product" | "service";
    product?: { slug: string } | null;
    service?: { slug: string } | null;
    link?: string | null;
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
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
                    {Array.from({ length: itemCount }).map((_, i) => (
                        <div
                            key={i}
                            className="flex min-h-[280px] w-full flex-col justify-end gap-3 rounded-2xl border border-card-border bg-card/60 p-6 animate-pulse sm:min-h-[320px] md:p-8 lg:min-h-[350px]"
                        >
                            <div className="h-6 w-3/4 rounded-lg bg-white/15 sm:h-7" />
                            <div className="w-full space-y-1.5">
                                <div className="h-3.5 w-full rounded-md bg-white/10" />
                                <div className="h-3.5 w-4/5 rounded-md bg-white/10" />
                            </div>
                            <div className="mt-2 h-9 w-28 rounded-full bg-primary/40 sm:h-10 sm:w-32" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

function goToBanner(item: HeroData, router: ReturnType<typeof useRouter>) {
    if (item.product?.slug) {
        router.push(`/shop/${item.product.slug}`);
        return;
    }
    if (item.service?.slug) {
        router.push(`/services/${item.service.slug}`);
        return;
    }
    if (item.link) {
        window.location.href = item.link;
        return;
    }
    router.push(item.type === "service" ? "/services" : "/shop");
}

function BannerCard({ item, priority }: { item: HeroData; priority?: boolean }) {
    const router = useRouter();

    return (
        <div
            onClick={() => goToBanner(item, router)}
            className="group relative flex min-h-[280px] cursor-pointer flex-col justify-end overflow-hidden rounded-2xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl sm:min-h-[320px] md:p-8 lg:min-h-[350px]"
        >
            <div className="absolute inset-0 h-full w-full">
                <Image
                    src={resolveImageUrl(item.image) || "/banner.png"}
                    alt={item.header}
                    fill
                    unoptimized
                    priority={priority}
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            </div>

            <div className="relative z-10 flex flex-col items-start gap-2">
                <h3 className="line-clamp-2 text-xl leading-tight font-bold text-white transition-colors group-hover:text-accent sm:text-2xl">
                    {item.header}
                </h3>
                {item.description && (
                    <p className="line-clamp-2 text-xs leading-relaxed font-medium text-zinc-200 sm:text-sm">
                        {item.description}
                    </p>
                )}
                <button
                    type="button"
                    onClick={(event) => {
                        event.stopPropagation();
                        goToBanner(item, router);
                    }}
                    className="group/btn mt-2 inline-flex cursor-pointer items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-semibold text-white shadow-md transition-all duration-300 hover:bg-primary-hover sm:text-sm"
                >
                    {item.type === "service" ? "View service" : "Shop Now"}
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                </button>
            </div>
        </div>
    );
}

const Banner = ({ initialBanners, loading = false, count }: BannerProps) => {
    if (loading) {
        return <BannerSkeleton count={count || initialBanners?.length || 4} />;
    }

    const banners = initialBanners || [];
    if (banners.length === 0) return null;

    const useSlider = banners.length > 1;

    return (
        <section className="w-full bg-background py-3 md:py-6">
            <div className="container relative mx-auto px-4">
                {useSlider ? (
                    <>
                        <button
                            type="button"
                            className="hero-banner-prev absolute top-1/2 left-1 z-20 flex h-10 w-10 -translate-y-[calc(50%+20px)] cursor-pointer items-center justify-center rounded-full bg-primary text-white shadow-md transition-all hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-40 [&.swiper-button-disabled]:pointer-events-none md:left-2"
                            aria-label="Previous banners"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                            type="button"
                            className="hero-banner-next absolute top-1/2 right-1 z-20 flex h-10 w-10 -translate-y-[calc(50%+20px)] cursor-pointer items-center justify-center rounded-full bg-primary text-white shadow-md transition-all hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-40 [&.swiper-button-disabled]:pointer-events-none md:right-2"
                            aria-label="Next banners"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>

                        <Swiper
                            modules={[Autoplay, Navigation, Pagination]}
                            slidesPerView={1}
                            spaceBetween={16}
                            loop={banners.length > 4}
                            autoplay={{
                                delay: 4000,
                                disableOnInteraction: false,
                                pauseOnMouseEnter: true,
                            }}
                            pagination={{ clickable: true }}
                            navigation={{
                                prevEl: ".hero-banner-prev",
                                nextEl: ".hero-banner-next",
                            }}
                            breakpoints={{
                                640: { slidesPerView: 2, spaceBetween: 20 },
                                1024: { slidesPerView: 3, spaceBetween: 24 },
                                1280: { slidesPerView: 4, spaceBetween: 24 },
                            }}
                            className="hero-banner-swiper w-full !pb-10"
                        >
                            {banners.map((item, index) => (
                                <SwiperSlide key={item._id}>
                                    <BannerCard item={item} priority={index < 4} />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </>
                ) : (
                    <BannerCard item={banners[0]} priority />
                )}
            </div>
        </section>
    );
};

export default Banner;
