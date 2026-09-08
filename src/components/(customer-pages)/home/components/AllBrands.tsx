'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { resolveImageUrl } from '../../../../../helpers/resolveImageUrl';

const CategoryCard = ({ cat, hrefBase }: { cat: any; hrefBase: string }) => {
    const categoryParam = cat.slug || cat._id || cat.name;
    return (
        <Link
            href={`${hrefBase}?category=${encodeURIComponent(categoryParam)}`}
            className="inline-flex flex-col items-center justify-between gap-2 group cursor-pointer shrink-0 p-2 sm:p-2.5 rounded-2xl bg-secondary hover:bg-secondary/90  transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1 w-32 sm:w-48 h-[150px] sm:h-[165px] select-none"
        >
            <div className="w-full h-24 sm:h-28 relative rounded-xl overflow-hidden   shadow-inner flex items-center justify-center shrink-0">
                <Image
                    src={resolveImageUrl(cat.image) || "/placeholder.jpg"}
                    alt={cat.name}
                    fill
                    unoptimized={true}
                    className="object-cover  group-hover:scale-110 transition-transform duration-300"
                />
            </div>
            <span className="text-xs sm:text-sm  text-foreground group-hover:text-foreground/90 transition-colors text-center w-full line-clamp-2 leading-tight px-1 break-words whitespace-normal">
                {cat.name}
            </span>
        </Link>
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
    return (
        <section className=" bg-background  mb-3 md:mb-6">
            {/* 1. Product Categories Section */}
            <div className="container mx-auto  mb-2 md:mb-3">
                <div className="flex justify-between items-center mb-2 md:mb-4">
                    <div className="flex items-center gap-3">
                        {/* <div className="w-4 h-9 bg-secondary rounded-xs" /> */}
                        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground tracking-tight">
                            Product Categories
                        </h2>
                    </div>
                    <Link
                        href="/product-categories"
                        className="flex items-center gap-2 text-foreground text-xs sm:text-sm font-semibold hover:underline underline-offset-4 transition-all group cursor-pointer"
                    >
                        View All
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {productCategories.length > 0 ? (
                    <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-3 no-scrollbar scroll-smooth">
                        {productCategories.map((cat) => (
                            <CategoryCard key={`prod-${cat._id}`} cat={cat} hrefBase="/shop" />
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-accent py-6 text-sm">No product categories found</div>
                )}
            </div>

            {/* 2. Service Categories Section */}
            <div className="container mx-auto  mb-2 md:mb-3">
                <div className="flex justify-between items-center mb-2 md:mb-4">
                    <div className="flex items-center gap-3">
                        {/* <div className="w-4 h-9 bg-secondary rounded-xs" /> */}
                        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground tracking-tight">
                            Service Categories
                        </h2>
                    </div>
                    <Link
                        href="/service-categories"
                        className="flex items-center gap-2 text-foreground text-xs sm:text-sm font-semibold hover:underline underline-offset-4 transition-all group cursor-pointer"
                    >
                        View All
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {serviceCategories.length > 0 ? (
                    <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-3 no-scrollbar scroll-smooth">
                        {serviceCategories.map((cat) => (
                            <CategoryCard key={`serv-${cat._id}`} cat={cat} hrefBase="/services" />
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-accent py-6 text-sm">No service categories found</div>
                )}
            </div>
        </section>
    );
};

export default AllBrands;
