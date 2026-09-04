"use client"

import { ArrowRight } from 'lucide-react';
import ProductCard from '@/shared/ProductCard';
import { resolveImageUrl } from '../../../../../helpers/resolveImageUrl';
import { useRouter } from 'next/navigation';

export interface Product {
    _id: string;
    name: string;
    images: string[];
    price: number;
    discountPrice?: number;
    ratingAverage: number;
    ratingCount: number;
    slug: string;
}

interface NewArrivalProps {
    initialProducts?: Product[];
}

const NewArrival = ({ initialProducts = [] }: NewArrivalProps) => {
    const router = useRouter();
    const products = initialProducts.slice(0, 6);

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
        <section className="py-[50px] bg-[#4f2c1d]">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-12">
                    <div className="flex items-center gap-4 mb-3">
                        <div className="w-5 h-10 bg-primary rounded-xs"></div>
                        <span className="text-white font-normal text-sm">This Month</span>
                    </div>
                    <div className="flex justify-between items-end">
                        <h2 className="title mb-0!">Shop From New Arrival</h2>
                        <button className="flex items-center gap-2 text-[#FFDDA5] px-6 py-3 rounded-md font-medium hover:underline underline-offset-4 transition-all group cursor-pointer" onClick={handleClick}>
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
                        <div className="text-center text-[#FFDDA5] py-10">No new arrivals found.</div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default NewArrival;
