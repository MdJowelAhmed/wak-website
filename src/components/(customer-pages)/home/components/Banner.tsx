"use client"

import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { myFetch } from '../../../../../helpers/myFetch';
import { resolveImageUrl } from '../../../../../helpers/resolveImageUrl';

interface HeroData {
    _id: string;
    header: string;
    description: string;
    image: string;
    product?: { slug: string };
    service?: { slug: string };
    link?: string;
}

const Banner = () => {
    const router = useRouter();
    const [banners, setBanners] = useState<HeroData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const res = await myFetch('/hero-section');
                if (res?.data && res.data.length > 0) {
                    setBanners(res.data);
                }
            } catch (error) {
                console.error("Failed to fetch banners:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBanners();
    }, []);

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

    if (loading) {
        return (
            <div className="w-full bg-[#4f2c1d] py-6 md:py-10">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="w-full min-h-[280px] sm:min-h-[320px] lg:min-h-[350px] rounded-2xl bg-white/5 animate-pulse border border-white/10"
                            />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    const displayBanners = banners.length > 0 ? banners : [];

    if (displayBanners.length === 0) return null;

    return (
        <section className="w-full bg-[#4f2c1d] py-6 md:py-10">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {displayBanners.map((item) => (
                        <div
                            key={item._id}
                            onClick={() => handleShopNow(item)}
                            className="group relative overflow-hidden rounded-2xl bg-zinc-900 border border-white/10 hover:border-[#FF6700]/50 transition-all duration-300 min-h-[280px] sm:min-h-[320px] lg:min-h-[350px] flex flex-col justify-end p-6 md:p-8 cursor-pointer shadow-lg hover:shadow-xl"
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
                                <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight group-hover:text-[#FFDDA5] transition-colors line-clamp-2">
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
                                    className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FF6700] hover:bg-[#e05b00] text-white text-xs sm:text-sm font-semibold transition-all duration-300 group/btn cursor-pointer shadow-md"
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
