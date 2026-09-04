'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { resolveImageUrl } from '../../../../../helpers/resolveImageUrl';

// Reusable card shared between both layouts
const CategoryCard = ({ cat, hrefBase, type }: { cat: any; hrefBase: string; type: string }) => (
    <Link
        href={`${hrefBase}?category=${encodeURIComponent(cat.name)}`}
        className="inline-flex flex-col items-center justify-between gap-2 group cursor-pointer shrink-0 p-2 sm:p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#FF6700]/60 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1 w-30 sm:w-48 h-[158px] sm:h-[165px] select-none"
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
    // Duplicate 2 or 4 times (even number) for 50% seamless transform marquee
    const marqueeItems = categories.length < 6
        ? [...categories, ...categories, ...categories, ...categories]
        : [...categories, ...categories];

    return (
        <div className="w-full py-3 marquee-wrapper overflow-hidden">
            <div className="flex select-none">
                <div className="flex gap-2 md:gap-4 sm:gap-6 animate-marquee items-start shrink-0">
                    {marqueeItems.map((cat, index) => (
                        <CategoryCard key={`${type}-${cat._id}-${index}`} cat={cat} hrefBase={hrefBase} type={type} />
                    ))}
                </div>
            </div>
        </div>
    );
};

interface AllBrandsProps {
    productCategories?: any[];
    serviceCategories?: any[];
}

const AllBrands = ({
    productCategories = [],
    serviceCategories = [],
}: AllBrandsProps) => {
    const [productTab, setProductTab] = useState<'all' | 'featured'>('all');
    const [serviceTab, setServiceTab] = useState<'all' | 'featured'>('all');

    const featuredProductCategories = productCategories.filter(
        (c) => c.isFeatured === true || String(c.isFeatured).toLowerCase() === 'true' || c.isFeatured === 1
    );
    const featuredServiceCategories = serviceCategories.filter(
        (c) => c.isFeatured === true || String(c.isFeatured).toLowerCase() === 'true' || c.isFeatured === 1
    );

    const activeProductCategories = productTab === 'all' ? productCategories : featuredProductCategories;
    const activeServiceCategories = serviceTab === 'all' ? serviceCategories : featuredServiceCategories;

    return (
        <section className="py-6 md:pb-12 pb-3 bg-[#4f2c1d] space-y-3">
            {/* 1. Product Categories Section */}
            <div className="container mx-auto px-4">
                <div className="w-full">
                    <div className="mb-1 overflow-x-auto no-scrollbar max-w-full pb-1">
                        <div className="inline-flex bg-white/10 h-auto rounded-xl backdrop-blur-sm select-none shrink-0 min-w-max">
                            <button
                                type="button"
                                onClick={() => setProductTab('all')}
                                className={`px-3 py-2 sm:py-2 rounded-l-xl text-xs sm:text-sm md:text-base font-semibold transition-all cursor-pointer select-none whitespace-nowrap ${
                                    productTab === 'all'
                                        ? 'bg-[#FF6700] text-white shadow-md'
                                        : 'text-white/90 hover:text-white hover:bg-white/10'
                                }`}
                            >
                                Product Categories
                            </button>
                            <button
                                type="button"
                                onClick={() => setProductTab('featured')}
                                className={`px-3 py-2 sm:py-2 rounded-r-xl text-xs sm:text-sm md:text-base font-semibold transition-all cursor-pointer select-none whitespace-nowrap ${
                                    productTab === 'featured'
                                        ? 'bg-[#FF6700] text-white shadow-md'
                                        : 'text-white/90 hover:text-white hover:bg-white/10'
                                }`}
                            >
                                Featured Categories
                            </button>
                        </div>
                    </div>

                    <div className="mt-0 focus-visible:outline-none overflow-hidden">
                        <CategoryDisplay
                            categories={activeProductCategories}
                            loading={false}
                            emptyMessage={
                                productTab === 'all'
                                    ? 'No product categories found'
                                    : 'No featured product categories found'
                            }
                            type="product"
                        />
                    </div>
                </div>
            </div>

            {/* 2. Service Categories Section */}
            <div className="container mx-auto px-4">
                <div className="w-full">
                    <div className="mb-1 overflow-x-auto no-scrollbar max-w-full pb-1">
                        <div className="inline-flex bg-white/10 h-auto rounded-xl backdrop-blur-sm select-none shrink-0 min-w-max">
                            <button
                                type="button"
                                onClick={() => setServiceTab('all')}
                                className={`px-3 py-2 sm:py-2 rounded-l-xl text-xs sm:text-sm md:text-base font-semibold transition-all cursor-pointer select-none whitespace-nowrap ${
                                    serviceTab === 'all'
                                        ? 'bg-[#FF6700] text-white shadow-md'
                                        : 'text-white/90 hover:text-white hover:bg-white/10'
                                }`}
                            >
                                Service Categories
                            </button>
                            <button
                                type="button"
                                onClick={() => setServiceTab('featured')}
                                className={`px-3 py-2 sm:py-2 rounded-r-xl text-xs sm:text-sm md:text-base font-semibold transition-all cursor-pointer select-none whitespace-nowrap ${
                                    serviceTab === 'featured'
                                        ? 'bg-[#FF6700] text-white shadow-md'
                                        : 'text-white/90 hover:text-white hover:bg-white/10'
                                }`}
                            >
                                Featured Categories
                            </button>
                        </div>
                    </div>

                    <div className="mt-0 focus-visible:outline-none overflow-hidden">
                        <CategoryDisplay
                            categories={activeServiceCategories}
                            loading={false}
                            emptyMessage={
                                serviceTab === 'all'
                                    ? 'No service categories found'
                                    : 'No featured service categories found'
                            }
                            type="service"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AllBrands;
