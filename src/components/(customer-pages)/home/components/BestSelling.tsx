"use client"

import { ArrowRight } from 'lucide-react';
import ProductCard from '@/shared/ProductCard';
import { resolveImageUrl } from '../../../../../helpers/resolveImageUrl';
import { useRouter } from 'next/navigation';

interface BestSellingProps {
    initialProducts?: any[];
    loading?: boolean;
}

export const BestSellingSkeleton = ({ count = 8 }: { count?: number }) => {
    return (
        <section className="py-[50px] bg-background">
            <div className="container mx-auto px-4">
                {/* Header Skeleton */}
                <div className="mb-12">
                    <div className="flex items-center gap-4 mb-3">
                        <div className="w-5 h-10 bg-primary/40 rounded-xs animate-pulse" />
                        <div className="h-4 w-24 bg-white/10 rounded-md animate-pulse" />
                    </div>
                    <div className="flex justify-between items-end">
                        <div className="h-8 sm:h-9 w-64 bg-white/15 rounded-lg animate-pulse" />
                        <div className="h-6 w-20 bg-white/10 rounded-md animate-pulse" />
                    </div>
                </div>

                {/* Grid Skeleton */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {Array.from({ length: count }).map((_, index) => (
                        <div
                            key={index}
                            className={`p-2.5 sm:p-4 rounded-xl bg-card border border-card-border flex flex-col justify-between gap-3 animate-pulse ${
                                index >= 6 ? 'hidden xl:flex' : 'flex'
                            }`}
                        >
                            <div className="flex justify-between items-center mb-2 sm:mb-4">
                                <div className="h-4 w-10 bg-accent/30 rounded-xs" />
                                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10" />
                            </div>
                            <div className="relative w-full h-28 sm:h-48 mb-2 sm:mb-6 bg-white/10 rounded-xl" />
                            <div className="space-y-2">
                                <div className="h-4 w-3/4 bg-white/15 rounded-md" />
                                <div className="h-4 w-1/2 bg-primary/40 rounded-md" />
                                <div className="h-3 w-1/3 bg-white/10 rounded-md" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const BestSelling = ({ initialProducts = [], loading = false }: BestSellingProps) => {
    const router = useRouter();

    if (loading) {
        return <BestSellingSkeleton count={8} />;
    }

    // Display max 8 products (show 6 on mobile/large, 8 on XL)
    const products = initialProducts.slice(0, 8);

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
        <section className="py-[50px] bg-background">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-12">
                    <div className="flex items-center gap-4 mb-3">
                        <div className="w-5 h-10 bg-primary rounded-xs"></div>
                        <span className="text-white font-normal text-sm">This Month</span>
                    </div>
                    <div className="flex justify-between items-end">
                        <h2 className="title mb-0!">Best Selling Products</h2>
                        <button className="flex items-center gap-2 text-accent px-6 py-3 rounded-md font-medium hover:underline underline-offset-4 transition-all group cursor-pointer" onClick={handleClick}>
                            View All
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>

                {/* Products Grid */}
                <div>
                    {products.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                            {products.map((product, index) => (
                                <div
                                    key={product._id}
                                    className={index >= 6 ? 'hidden xl:block' : 'block'}
                                >
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
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-accent py-10">No best selling products found.</div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default BestSelling;
