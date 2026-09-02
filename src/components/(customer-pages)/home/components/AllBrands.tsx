'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/ui/tabs';
import { resolveImageUrl } from '../../../../../helpers/resolveImageUrl';
import { useCategories } from '../../../../../src/hooks/useCategories';

const CategoryMarquee = ({
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
                <span className="text-[#FFDDA5]">Loading categories...</span>
            </div>
        );
    }

    if (!categories || categories.length === 0) {
        return (
            <div className="w-full flex justify-center py-6 text-[#FFDDA5]">{emptyMessage}</div>
        );
    }

    const hrefBase = type === 'service' ? '/services' : '/shop';

    return (
        <div className="w-full relative overflow-hidden group py-2">
            <div className="flex select-none">
                <div className="flex space-x-8 sm:space-x-12 animate-marquee whitespace-nowrap items-center">
                    {[...categories, ...categories, ...categories].map((cat, index) => (
                        <Link
                            key={`${type}-${cat._id}-${index}`}
                            href={`${hrefBase}?category=${encodeURIComponent(cat.name)}`}
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
        </div>
    );
};

const AllBrands = () => {
    const { categories: productCategories, loading: prodLoading } = useCategories({ type: 'product' });
    const { categories: serviceCategories, loading: servLoading } = useCategories({ type: 'service' });

    const featuredProductCategories = productCategories.filter((c) => c.isFeatured === true);
    const featuredServiceCategories = serviceCategories.filter((c) => c.isFeatured === true);

    return (
        <section className="py-12 bg-[#4f2c1d] space-y-12">
            {/* 1. Product Categories Section */}
            <div className="w-full">
                <Tabs defaultValue="all" className="w-full">
                    <div className="container mx-auto px-4 mb-6 flex justify-start">
                        <TabsList className="bg-white/10 p-1.5 h-auto rounded-2xl border border-white/10 backdrop-blur-sm gap-1">
                            <TabsTrigger
                                value="all"
                                className="px-5 py-2.5 rounded-xl text-xs sm:text-sm md:text-base font-semibold text-white/70 data-[state=active]:bg-[#FF6700] data-[state=active]:text-white data-[state=active]:shadow-md transition-all cursor-pointer"
                            >
                                Product Categories
                            </TabsTrigger>
                            <TabsTrigger
                                value="featured"
                                className="px-5 py-2.5 rounded-xl text-xs sm:text-sm md:text-base font-semibold text-white/70 data-[state=active]:bg-[#FF6700] data-[state=active]:text-white data-[state=active]:shadow-md transition-all cursor-pointer"
                            >
                                Product Featured Categories
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="all" className="mt-0 focus-visible:outline-none">
                        <CategoryMarquee
                            categories={productCategories}
                            loading={prodLoading}
                            emptyMessage="No product categories found"
                            type="product"
                        />
                    </TabsContent>
                    <TabsContent value="featured" className="mt-0 focus-visible:outline-none">
                        <CategoryMarquee
                            categories={featuredProductCategories.length > 0 ? featuredProductCategories : productCategories}
                            loading={prodLoading}
                            emptyMessage="No product featured categories found"
                            type="product"
                        />
                    </TabsContent>
                </Tabs>
            </div>

            {/* 2. Service Categories Section */}
            <div className="w-full">
                <Tabs defaultValue="all" className="w-full">
                    <div className="container mx-auto px-4 mb-6 flex justify-start">
                        <TabsList className="bg-white/10 p-1.5 h-auto rounded-2xl border border-white/10 backdrop-blur-sm gap-1">
                            <TabsTrigger
                                value="all"
                                className="px-5 py-2.5 rounded-xl text-xs sm:text-sm md:text-base font-semibold text-white/70 data-[state=active]:bg-[#FF6700] data-[state=active]:text-white data-[state=active]:shadow-md transition-all cursor-pointer"
                            >
                                Service Categories
                            </TabsTrigger>
                            <TabsTrigger
                                value="featured"
                                className="px-5 py-2.5 rounded-xl text-xs sm:text-sm md:text-base font-semibold text-white/70 data-[state=active]:bg-[#FF6700] data-[state=active]:text-white data-[state=active]:shadow-md transition-all cursor-pointer"
                            >
                                Service Featured Categories
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="all" className="mt-0 focus-visible:outline-none">
                        <CategoryMarquee
                            categories={serviceCategories}
                            loading={servLoading}
                            emptyMessage="No service categories found"
                            type="service"
                        />
                    </TabsContent>
                    <TabsContent value="featured" className="mt-0 focus-visible:outline-none">
                        <CategoryMarquee
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
