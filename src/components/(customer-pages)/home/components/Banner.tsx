"use client"

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { myFetch } from '../../../../../helpers/myFetch';
import { resolveImageUrl } from '../../../../../helpers/resolveImageUrl';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

interface HeroData {
    _id: string;
    header: string;
    description: string;
    image: string;
    product?: { slug: string };
    service?: { slug: string };
    link?: string;
}

const bannerData = [
    {
        id: 1,
        title: "Explore Mother's Day deals",
        subtitle: "Up to 50% OFF",
        image: "/banner.png",
    },
    {
        id: 2,
        title: "Spring Collection 2026",
        subtitle: "New Arrivals Now In",
        image: "/banner.png",
    },
    {
        id: 3,
        title: "Premium Tech Gadgets",
        subtitle: "Best Sellers Selection",
        image: "/banner.png",
    }
];

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
            <div className="w-full relative group bg-[#4f2c1d] flex flex-col justify-center items-center aspect-2.5/1 sm:aspect-3/1 lg:aspect-4/1 min-h-[520px]">
                <div className="text-[#FFDDA5]">Loading banners...</div>
            </div>
        );
    }

    const displayBanners = banners.length > 0 ? banners : [];

    if (displayBanners.length === 0) return null;

    return (
        <div className="w-full relative group bg-[#4f2c1d]  flex flex-col items-center">
            <Swiper
                modules={[Autoplay, Pagination]}
                pagination={{
                    el: '.banner-pagination',
                    clickable: true,
                }}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                className="w-full aspect-2.5/1 sm:aspect-3/1 lg:aspect-4/1 overflow-hidden min-h-[520px] rounded-none"
            >
                {displayBanners.map((item) => (
                    <SwiperSlide key={item._id} className="relative w-full h-full">
                        {/* Background Image */}
                        <div className="absolute inset-0 w-full h-full">
                            <Image
                                src={resolveImageUrl(item.image) || "/banner.png"}
                                alt={item.header}
                                fill
                                unoptimized={true}
                                className="object-cover"
                                priority
                            />
                        </div>

                        {/* Content Overlay */}
                        <div className="relative z-10 h-full container mx-auto px-6 md:px-0 flex flex-col justify-center items-center">
                            <div className="max-w-xl animate-in fade-in slide-in-from-left-8 duration-700">
                                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-[#1a1a1a] leading-tight mb-4 tracking-tight">
                                    {item.header}
                                </h1>
                                <p className="text-sm md:text-lg text-zinc-700 mb-8 font-medium">
                                    {item.description}
                                </p>
                                <button 
                                    onClick={() => handleShopNow(item)}
                                    className="inline-flex items-center gap-2 px-6 py-2.5 border border-zinc-900 rounded-full text-zinc-900 font-semibold hover:bg-zinc-900 hover:text-white transition-all duration-300 group/btn cursor-pointer"
                                >
                                    Shop Now
                                    <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Pagination container placed outside/below the banner */}
            <div className="banner-pagination flex justify-center items-center gap-2 mt-8 z-10"></div>
        </div>
    );
};

export default Banner;
