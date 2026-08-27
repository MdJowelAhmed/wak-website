"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { ArrowRight } from "lucide-react";
import ProductCard from "@/shared/ProductCard";
import type { RelatedProduct } from "./data";

import "swiper/css";

interface RelatedItemsProps {
    products: RelatedProduct[];
}

export default function RelatedItems({ products }: RelatedItemsProps) {
    return (
        <section className="pt-[50px]">
            {/* Header */}
            <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                    <div className="w-5 h-10 bg-[#FF6700] rounded-sm" />
                    <h2 className="text-lg font-medium text-white">Related Item</h2>
                </div>
                <button className="flex items-center gap-2 text-[#FFDDA5] font-medium text-sm hover:underline underline-offset-4 transition-all group">
                    View All
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            {/* Swiper Slider */}
            <Swiper
                modules={[Autoplay]}
                spaceBetween={20}
                autoplay={{ delay: 3500, disableOnInteraction: false }}
                breakpoints={{
                    320: { slidesPerView: 1.2, spaceBetween: 16 },
                    640: { slidesPerView: 2.2, spaceBetween: 20 },
                    1024: { slidesPerView: 3, spaceBetween: 20 },
                    1280: { slidesPerView: 4, spaceBetween: 20 },
                }}
                className="w-full"
            >
                {products.map((product) => (
                    <SwiperSlide key={product.id}>
                        <ProductCard
                            product={{
                                id: product.id,
                                name: product.name,
                                image: product.image,
                                currentPrice: product.currentPrice,
                                originalPrice: product.originalPrice,
                                discount: product.discount,
                                rating: product.rating,
                                reviews: product.reviews,
                            }}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
}
