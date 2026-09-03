'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef, useEffect, useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/ui/tabs';
import { resolveImageUrl } from '../../../../../helpers/resolveImageUrl';
import { useCategories } from '../../../../../src/hooks/useCategories';

// Reusable card shared between both layouts
const CategoryCard = ({ cat, hrefBase, type }: { cat: any; hrefBase: string; type: string }) => (
    <Link
        href={`${hrefBase}?category=${encodeURIComponent(cat.name)}`}
        className="inline-flex flex-col items-center justify-between gap-2 group cursor-pointer shrink-0 p-2 sm:p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#FF6700]/60 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1 w-36 sm:w-48 h-[158px] sm:h-[165px] select-none"
    >
        <div className="w-full h-24 sm:h-28 relative rounded-xl overflow-hidden bg-white p-2 shadow-inner flex items-center justify-center shrink-0">
            <Image
                src={resolveImageUrl(cat.image) || ""}
                alt={cat.name}
                fill
                unoptimized={true}
                className="object-cover p-1.5 group-hover:scale-110 transition-transform duration-300"
            />
        </div>
        <span className="text-xs sm:text-sm font-semibold text-white group-hover:text-[#FF6700] transition-colors text-center w-full line-clamp-2 leading-tight px-1 break-words whitespace-normal">
            {cat.name}
        </span>
    </Link>
);

const CategoryDisplay = ({
    categories,
    loading,
    emptyMessage,
    type,
}: {
    categories: any[];
    loading: boolean;
    emptyMessage: string;
    type: 'product' | 'service';
}) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const [needsMarquee, setNeedsMarquee] = useState(false);

    useEffect(() => {
        const check = () => {
            if (trackRef.current && wrapperRef.current) {
                // If single-row content wider than container → marquee needed
                const overflows = trackRef.current.scrollWidth > wrapperRef.current.clientWidth + 4;
                setNeedsMarquee(overflows);
            }
        };
        // Small delay so DOM has rendered
        const t = setTimeout(check, 50);
        window.addEventListener('resize', check);
        return () => {
            clearTimeout(t);
            window.removeEventListener('resize', check);
        };
    }, [categories]);

    if (loading) {
        return (
            <div className="w-full flex justify-center py-6">
                <span className="text-[#FFDDA5] text-sm sm:text-base font-medium">Loading categories...</span>
            </div>
        );
    }

    if (!categories || categories.length === 0) {
        return (
            <div className="w-full flex justify-center py-6 text-[#FFDDA5] text-sm sm:text-base font-medium">{emptyMessage}</div>
        );
    }

    const hrefBase = type === 'service' ? '/services' : '/shop';

    return (
        <div ref={wrapperRef} className={`w-full py-3 ${needsMarquee ? 'marquee-wrapper overflow-hidden' : ''}`}>
            {needsMarquee ? (
                /* Marquee mode — infinite scroll */
                <div className="flex select-none">
                    <div ref={trackRef} className="flex gap-4 sm:gap-6 animate-marquee items-start">
                        {[...categories, ...categories, ...categories].map((cat, index) => (
                            <CategoryCard key={`${type}-${cat._id}-${index}`} cat={cat} hrefBase={hrefBase} type={type} />
                        ))}
                    </div>
                </div>
            ) : (
                /* Grid mode — all fit on screen, show centered */
                <div ref={trackRef} className="flex flex-wrap justify-start gap-4 sm:gap-5 select-none">
                    {categories.map((cat, index) => (
                        <CategoryCard key={`${type}-${cat._id}-${index}`} cat={cat} hrefBase={hrefBase} type={type} />
                    ))}
                </div>
            )}
        </div>
    );
};


const AllBrands = () => {
    const { categories: productCategories, loading: prodLoading } = useCategories({ type: 'product' });
    const { categories: serviceCategories, loading: servLoading } = useCategories({ type: 'service' });

    const featuredProductCategories = productCategories.filter((c) => c.isFeatured === true);
    const featuredServiceCategories = serviceCategories.filter((c) => c.isFeatured === true);

    return (
        <section className="py-6 md:py-12 bg-[#4f2c1d] space-y-12">
            {/* 1. Product Categories Section */}
            <div className="container mx-auto px-4">
                <Tabs defaultValue="all" className="w-full">
                    <div className="mb-3 overflow-x-auto no-scrollbar max-w-full pb-1">
                        <TabsList className="inline-flex bg-white/10  h-auto rounded-xl  backdrop-blur-sm select-none shrink-0 min-w-max">
                            <TabsTrigger
                                value="all"
                                className="px-3  py-2 sm:py-2.5 rounded-l-xl text-xs sm:text-sm md:text-base font-semibold text-white/90 data-[state=active]:bg-[#FF6700] data-[state=active]:text-white data-[state=active]:shadow-md hover:text-white hover:bg-white/10 transition-all cursor-pointer select-none whitespace-nowrap"
                            >
                                Product Categories
                            </TabsTrigger>
                            <TabsTrigger
                                value="featured"
                                className="px-3 py-2 sm:py-2.5 rounded-r-xl text-xs sm:text-sm md:text-base font-semibold text-white/90 data-[state=active]:bg-[#FF6700] data-[state=active]:text-white data-[state=active]:shadow-md hover:text-white hover:bg-white/10 transition-all cursor-pointer select-none whitespace-nowrap"
                            >
                                Product Featured Categories
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="all" className="mt-0 focus-visible:outline-none overflow-hidden">
                        <CategoryDisplay
                            categories={productCategories}
                            loading={prodLoading}
                            emptyMessage="No product categories found"
                            type="product"
                        />
                    </TabsContent>
                    <TabsContent value="featured" className="mt-0 focus-visible:outline-none overflow-hidden">
                        <CategoryDisplay
                            categories={featuredProductCategories.length > 0 ? featuredProductCategories : productCategories}
                            loading={prodLoading}
                            emptyMessage="No product featured categories found"
                            type="product"
                        />
                    </TabsContent>
                </Tabs>
            </div>

            {/* 2. Service Categories Section */}
            <div className="container mx-auto px-4">
                <Tabs defaultValue="all" className="w-full">
                    <div className="mb-3 overflow-x-auto no-scrollbar max-w-full pb-1">
                        <TabsList className="inline-flex bg-white/10  h-auto rounded-xl  backdrop-blur-sm select-none shrink-0 min-w-max">
                            <TabsTrigger
                                value="all"
                                className="px-3 py-2 sm:py-2.5 rounded-l-xl text-xs sm:text-sm md:text-base font-semibold text-white/90 data-[state=active]:bg-[#FF6700] data-[state=active]:text-white data-[state=active]:shadow-md hover:text-white hover:bg-white/10 transition-all cursor-pointer select-none whitespace-nowrap"
                            >
                                Service Categories
                            </TabsTrigger>
                            <TabsTrigger
                                value="featured"
                                className="px-3 py-2 sm:py-2.5 rounded-r-xl text-xs sm:text-sm md:text-base font-semibold text-white/90 data-[state=active]:bg-[#FF6700] data-[state=active]:text-white data-[state=active]:shadow-md hover:text-white hover:bg-white/10 transition-all cursor-pointer select-none whitespace-nowrap"
                            >
                                Service Featured Categories
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="all" className="mt-0 focus-visible:outline-none overflow-hidden">
                        <CategoryDisplay
                            categories={serviceCategories}
                            loading={servLoading}
                            emptyMessage="No service categories found"
                            type="service"
                        />
                    </TabsContent>
                    <TabsContent value="featured" className="mt-0 focus-visible:outline-none overflow-hidden">
                        <CategoryDisplay
                            categories={featuredServiceCategories.length > 0 ? featuredServiceCategories : serviceCategories}
                            loading={servLoading}
                            emptyMessage="No service featured categories found"
                            type="service"
                        />
                    </TabsContent>
                </Tabs>
            </div>
        </section>
    );
};

export default AllBrands;
