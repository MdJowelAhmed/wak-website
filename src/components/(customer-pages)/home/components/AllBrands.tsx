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
        <div className="w-full overflow-hidden relative group py-3">
            <div className="flex select-none">
                <div className="flex space-x-4 sm:space-x-6 animate-marquee whitespace-nowrap items-center">
                    {[...categories, ...categories, ...categories].map((cat, index) => (
                        <Link
                            key={`${type}-${cat._id}-${index}`}
                            href={`${hrefBase}?category=${encodeURIComponent(cat.name)}`}
                            className="inline-flex flex-col items-center justify-center gap-3 group cursor-pointer shrink-0 p-2 sm:p-2 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#FF6700]/60 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1 w-32 sm:w-[133px] select-none"
                        >
                            <div className="w-24 h-24 sm:w-28 sm:h-28 relative rounded-xl overflow-hidden bg-white p-2 shadow-inner flex items-center justify-center shrink-0">
                                <Image
                                    src={resolveImageUrl(cat.image) || ""}
                                    alt={cat.name}
                                    fill
                                    unoptimized={true}
                                    className="object-contain p-1.5 group-hover:scale-110 transition-transform duration-300"
                                />
                            </div>
                            <span className="text-xs sm:text-sm font-semibold text-white group-hover:text-[#FF6700] transition-colors text-center max-w-full truncate px-1">
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
            <div className="container mx-auto px-4">
                <Tabs defaultValue="all" className="w-full">
                    <div className="mb-6 overflow-x-auto no-scrollbar max-w-full pb-1">
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
                        <CategoryMarquee
                            categories={productCategories}
                            loading={prodLoading}
                            emptyMessage="No product categories found"
                            type="product"
                        />
                    </TabsContent>
                    <TabsContent value="featured" className="mt-0 focus-visible:outline-none overflow-hidden">
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
            <div className="container mx-auto px-4">
                <Tabs defaultValue="all" className="w-full">
                    <div className="mb-6 overflow-x-auto no-scrollbar max-w-full pb-1">
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
                        <CategoryMarquee
                            categories={serviceCategories}
                            loading={servLoading}
                            emptyMessage="No service categories found"
                            type="service"
                        />
                    </TabsContent>
                    <TabsContent value="featured" className="mt-0 focus-visible:outline-none overflow-hidden">
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
