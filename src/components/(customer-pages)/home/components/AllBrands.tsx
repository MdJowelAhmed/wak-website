'use client';

import Image from 'next/image';
import Link from 'next/link';
import { resolveImageUrl } from '../../../../../helpers/resolveImageUrl';
import { useCategories } from '../../../../../src/hooks/useCategories';

const AllBrands = () => {
    const { categories: productCategories, loading: prodLoading } = useCategories({ type: 'product' });
    const { categories: serviceCategories, loading: servLoading } = useCategories({ type: 'service' });

    return (
        <section className="py-12 bg-[#4f2c1d] space-y-10">
            {/* 1. Product Categories Section */}
            <div className="w-full">
                <div className="container mx-auto px-4 mb-6">
                    <h2 className="title mb-0 text-center sm:text-left">Product Categories</h2>
                </div>
                <div className="w-full relative overflow-hidden group py-2">
                    {prodLoading ? (
                        <div className="w-full flex justify-center py-6">
                            <span className="text-[#FFDDA5]">Loading product categories...</span>
                        </div>
                    ) : productCategories.length > 0 ? (
                        <div className="flex select-none">
                            <div className="flex space-x-8 sm:space-x-12 animate-marquee whitespace-nowrap items-center">
                                {[...productCategories, ...productCategories, ...productCategories].map((cat, index) => (
                                    <Link
                                        key={`prod-${cat._id}-${index}`}
                                        href={`/shop?category=${encodeURIComponent(cat.name)}`}
                                        className="inline-flex flex-col items-center justify-center gap-2.5 group cursor-pointer shrink-0"
                                    >
                                        <div className="w-24 h-24 sm:w-28 sm:h-28 relative rounded-xl overflow-hidden bg-white/10 p-2.5 border border-white/10 group-hover:border-[#FF6700] group-hover:bg-white/20 transition-all duration-300 shadow-md flex items-center justify-center">
                                            <Image
                                                src={resolveImageUrl(cat.image) || ""}
                                                alt={cat.name}
                                                fill
                                                unoptimized={true}
                                                className="object-contain p-2 group-hover:scale-110 transition-transform duration-300"
                                            />
                                        </div>
                                        <span className="text-xs sm:text-sm font-medium text-white/90 group-hover:text-[#FF6700] transition-colors text-center max-w-[110px] sm:max-w-[130px] truncate">
                                            {cat.name}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="w-full flex justify-center py-6 text-[#FFDDA5]">No product categories found</div>
                    )}
                </div>
            </div>

            {/* 2. Service Categories Section */}
            <div className="w-full">
                <div className="container mx-auto px-4 mb-6">
                    <h2 className="title mb-0 text-center sm:text-left">Service Categories</h2>
                </div>
                <div className="w-full relative overflow-hidden group py-2">
                    {servLoading ? (
                        <div className="w-full flex justify-center py-6">
                            <span className="text-[#FFDDA5]">Loading service categories...</span>
                        </div>
                    ) : serviceCategories.length > 0 ? (
                        <div className="flex select-none">
                            <div className="flex space-x-8 sm:space-x-12 animate-marquee whitespace-nowrap items-center">
                                {[...serviceCategories, ...serviceCategories, ...serviceCategories].map((cat, index) => (
                                    <Link
                                        key={`serv-${cat._id}-${index}`}
                                        href={`/services?category=${encodeURIComponent(cat.name)}`}
                                        className="inline-flex flex-col items-center justify-center gap-2.5 group cursor-pointer shrink-0"
                                    >
                                        <div className="w-24 h-24 sm:w-28 sm:h-28 relative rounded-xl overflow-hidden bg-white/10 p-2.5 border border-white/10 group-hover:border-[#FF6700] group-hover:bg-white/20 transition-all duration-300 shadow-md flex items-center justify-center">
                                            <Image
                                                src={resolveImageUrl(cat.image) || ""}
                                                alt={cat.name}
                                                fill
                                                unoptimized={true}
                                                className="object-contain p-2 group-hover:scale-110 transition-transform duration-300"
                                            />
                                        </div>
                                        <span className="text-xs sm:text-sm font-medium text-white/90 group-hover:text-[#FF6700] transition-colors text-center max-w-[110px] sm:max-w-[130px] truncate">
                                            {cat.name}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="w-full flex justify-center py-6 text-[#FFDDA5]">No service categories found</div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default AllBrands;
