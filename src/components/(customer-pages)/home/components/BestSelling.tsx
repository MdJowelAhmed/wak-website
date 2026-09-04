"use client"

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { ArrowRight } from 'lucide-react';
import ProductCard from '@/shared/ProductCard';
import { resolveImageUrl } from '../../../../../helpers/resolveImageUrl';

// Import Swiper styles
import 'swiper/css';
import { useRouter } from 'next/navigation';

interface BestSellingProps {
    initialProducts?: any[];
}

const BestSelling = ({ initialProducts = [] }: BestSellingProps) => {
    const router = useRouter();
    const products = initialProducts;

    const handleClick = () => {
        const cookies = document.cookie;
        const hasMode = cookies.includes("user-mode=customer");

        if (!hasMode) {
            document.cookie = "user-mode=customer; path=/; max-age=31536000";
        }

        router.push(`/shop`);
        router.refresh();
    };

    return (
        <section className="py-[50px] bg-[#4f2c1d]">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-12">
                    <div className="flex items-center gap-4 mb-3">
                        <div className="w-5 h-10 bg-primary rounded-xs"></div>
                        <span className="text-white font-normal text-sm">This Month</span>
                    </div>
                    <div className="flex justify-between items-end">
                        <h2 className="title mb-0!">Best Selling Products</h2>
                        <button className="flex items-center gap-2  text-[#FFDDA5] px-6 py-3 rounded-md font-medium hover:underline underline-offset-4 transition-all group cursor-pointer" onClick={handleClick}>
                            View All
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>

                {/* Slider */}
                <div className="products-slider">
                    {products.length > 0 ? (
                        <Swiper
                            modules={[Autoplay]}
                            spaceBetween={30}
                            slidesPerView={4}
                            autoplay={{ delay: 4000 }}
                            breakpoints={{
                                320: { slidesPerView: 1.2, spaceBetween: 20 },
                                640: { slidesPerView: 2.2, spaceBetween: 20 },
                                1024: { slidesPerView: 3, spaceBetween: 30 },
                                1280: { slidesPerView: 4, spaceBetween: 30 }
                            }}
                            className="w-full"
                        >
                            {products.map((product) => (
                                <SwiperSlide key={product._id}>
                                    <ProductCard product={{
                                        id: product.slug || (product._id as any),
                                        name: product.name,
                                        image: resolveImageUrl(product.images?.[0]) || "/placeholder.jpg",
                                        currentPrice: product.discountPrice || product.price,
                                        originalPrice: product.price,
                                        discount: product.discountPrice ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0,
                                        rating: product.ratingAverage || 0,
                                        reviews: product.ratingCount || 0
                                    }} />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    ) : (
                        <div className="text-center text-[#FFDDA5] py-10">No best selling products found.</div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default BestSelling;
