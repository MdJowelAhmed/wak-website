"use client"

import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';


// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import { resolveImageUrl } from '../../../../../helpers/resolveImageUrl';
import { useCategories } from '../../../../../src/hooks/useCategories';

const FeaturedCategories = () => {
    const { categories: featuredCategories, loading } = useCategories({ isFeatured: true });

    return (
        <section className="py-[50px] bg-section-bg">
            <div className="container mx-auto px-4">
                {/* Header with Navigation */}
                <div className="flex justify-between items-center mb-10">
                    <h2 className="title mb-0!">Featured Categories</h2>

                    <div className="flex gap-3 flex-1 justify-end">
                        {/* Custom prev/next navigation */}
                        <button
                            className="category-prev w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-hover transition-all shadow-xs disabled:opacity-40 disabled:cursor-not-allowed [&.swiper-button-disabled]:!bg-border [&.swiper-button-disabled]:!text-muted-text [&.swiper-button-disabled]:!opacity-50 [&.swiper-button-disabled]:pointer-events-none cursor-pointer"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            className="category-next w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-hover transition-all shadow-xs disabled:opacity-40 disabled:cursor-not-allowed [&.swiper-button-disabled]:!bg-border [&.swiper-button-disabled]:!text-muted-text [&.swiper-button-disabled]:!opacity-50 [&.swiper-button-disabled]:pointer-events-none cursor-pointer"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="categories-slider">
                    {loading ? (
                        <div className="w-full py-20 flex justify-center items-center">
                            <span className="text-body-text font-medium">Loading categories...</span>
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
                            {featuredCategories.map((category) => {
                                const href = category.type === 'product' || category.type === 'products'
                                    ? `/shop?category=${category.slug || category._id}`
                                    : `/services?category=${encodeURIComponent(category.name)}`;
                                return (
                                    <SwiperSlide key={category._id} className="group cursor-pointer">
                                        <Link href={href} className="block relative w-full h-[200px] rounded-2xl overflow-hidden shadow-sm border border-border transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-md">
                                            <div className="absolute inset-0 z-0">
                                                <Image
                                                    src={resolveImageUrl(category.image) || ""}
                                                    alt={category.name}
                                                    fill
                                                    unoptimized={true}
                                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                            </div>
                                            {/* Dark gradient overlay for text readability */}
                                            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-85 group-hover:opacity-95 transition-opacity duration-300" />
                                            
                                            {/* Text content at bottom left */}
                                            <div className="absolute bottom-5 left-5 z-20 flex flex-col">
                                                <span className="text-white font-bold text-lg leading-tight mb-1">
                                                    {category.name}
                                                </span>
                                                <span className="text-zinc-200 text-xs font-semibold tracking-wider uppercase group-hover:text-primary-foreground transition-colors">
                                                    EXPLORE {category.type}S
                                                </span>
                                            </div>
                                        </Link>
                                    </SwiperSlide>
                                );
                            })}
                        </Swiper>
                    ) : (
                        <div className="w-full py-20 flex justify-center items-center">
                            <span className="text-body-text font-medium">No featured categories found.</span>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default FeaturedCategories;
