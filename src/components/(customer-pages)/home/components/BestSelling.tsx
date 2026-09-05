"use client"

import { ArrowRight } from 'lucide-react';
import ProductCard from '@/shared/ProductCard';
import { resolveImageUrl } from '../../../../../helpers/resolveImageUrl';
import { useRouter } from 'next/navigation';

interface BestSellingProps {
    initialProducts?: any[];
}

const BestSelling = ({ initialProducts = [] }: BestSellingProps) => {
    const router = useRouter();
    const products = initialProducts;

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
                            {products.map((product) => (
                                <ProductCard key={product._id} product={{
                                    id: product.slug || (product._id as any),
                                    name: product.name,
                                    image: resolveImageUrl(product.images?.[0]) || "/placeholder.jpg",
                                    currentPrice: product.discountPrice || product.price,
                                    originalPrice: product.price,
                                    discount: product.discountPrice ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0,
                                    rating: product.ratingAverage || 0,
                                    reviews: product.ratingCount || 0
                                }} />
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
