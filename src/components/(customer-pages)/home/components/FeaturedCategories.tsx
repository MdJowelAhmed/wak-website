"use client"

import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';


// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import { resolveImageUrl } from '../../../../../helpers/resolveImageUrl';
import { useCategories } from '../../../../../src/hooks/useCategories';

const FeaturedCategories = () => {
    const { categories: featuredCategories, loading } = useCategories({ isFeatured: true });

    return (
        <section className="py-[50px] bg-[#4f2c1d]">
            <div className="container mx-auto px-4">
                {/* Header with Navigation */}
                <div className="flex justify-between items-center mb-10">
                    <h2 className="title mb-0!">Featured Categories</h2>

                    <div className="flex gap-4 flex-1 justify-end">
                        {/* Custom prev/next navigation */}
                        <button
                            className="category-prev w-10 h-10 rounded-full bg-[#d4a373] flex items-center justify-center hover:bg-[#d4a373]/90 transition-all text-zinc-900 disabled:opacity-40 disabled:cursor-not-allowed [&.swiper-button-disabled]:!bg-zinc-800 [&.swiper-button-disabled]:!text-zinc-600 [&.swiper-button-disabled]:!opacity-40 [&.swiper-button-disabled]:pointer-events-none cursor-pointer"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                            className="category-next w-10 h-10 rounded-full bg-[#d4a373] flex items-center justify-center hover:bg-[#d4a373]/90 transition-all text-zinc-900 disabled:opacity-40 disabled:cursor-not-allowed [&.swiper-button-disabled]:!bg-zinc-800 [&.swiper-button-disabled]:!text-zinc-600 [&.swiper-button-disabled]:!opacity-40 [&.swiper-button-disabled]:pointer-events-none cursor-pointer"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <div className="categories-slider">
                    {loading ? (
                        <div className="w-full py-20 flex justify-center items-center">
                            <span className="text-[#FFDDA5]">Loading categories...</span>
                        </div>
                    ) : featuredCategories.length > 0 ? (
                        <Swiper
                            modules={[Navigation]}
                            navigation={{
                                prevEl: '.category-prev',
                                nextEl: '.category-next',
                            }}
                            slidesPerView={4}
                            spaceBetween={24}
                            breakpoints={{
                                320: { slidesPerView: 1.2, spaceBetween: 16 },
                                640: { slidesPerView: 2.2, spaceBetween: 20 },
                                768: { slidesPerView: 3, spaceBetween: 24 },
                                1024: { slidesPerView: 4, spaceBetween: 24 },
                                1280: { slidesPerView: 5, spaceBetween: 24 }
                            }}
                            className="w-full"
                        >
                            {featuredCategories.map((category) => (
                                <SwiperSlide key={category._id} className="group cursor-pointer">
                                    <div className="relative w-full h-[200px] rounded-2xl overflow-hidden shadow-lg transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-xl">
                                        <div className="absolute inset-0 z-0">
                                            <Image
                                                src={resolveImageUrl(category.image) || ""}
                                                alt={category.name}
                                                fill
                                                unoptimized={true}
                                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                        </div>
                                        {/* Dark gradient overlay */}
                                        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                                        
                                        {/* Text content at bottom left */}
                                        <div className="absolute bottom-5 left-5 z-20 flex flex-col">
                                            <span className="text-white font-bold text-lg leading-tight mb-1">
                                                {category.name}
                                            </span>
                                            <span className="text-zinc-300 text-xs font-semibold tracking-wider uppercase group-hover:text-white transition-colors">
                                                EXPLORE {category.type}S
                                            </span>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    ) : (
                        <div className="w-full py-20 flex justify-center items-center">
                            <span className="text-[#FFDDA5]">No featured categories found.</span>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default FeaturedCategories;
