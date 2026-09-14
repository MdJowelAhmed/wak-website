"use client"

import { ArrowRight } from 'lucide-react';
import ProductCard from '@/shared/ProductCard';
import { resolveImageUrl } from '../../../../../helpers/resolveImageUrl';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';

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
    const t = useTranslations("Home");
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
        <section className="py-[50px] bg-background">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-10">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-4 h-8 bg-primary rounded-xs"></div>
                        <span className="text-body-text font-semibold text-sm uppercase tracking-wider">{t("newArrival.eyebrow")}</span>
                    </div>
                    <div className="flex justify-between items-end">
                        <h2 className="title mb-0!">{t("newArrival.title")}</h2>
                        <button className="flex items-center gap-2 text-foreground font-semibold hover:text-primary-hover transition-colors group cursor-pointer" onClick={handleClick}>
                            {t("viewAll")}
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform rtl:rotate-180" />
                        </button>
                    </div>
                </div>

                {/* Products Grid */}
                <div>
                    {products.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                            {products.map((product) => (
                                <ProductCard key={product._id} product={{
                                    id: product.slug || product._id,
                                    productId: product._id,
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
                        <div className="text-center text-accent py-10">{t("newArrival.empty")}</div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default NewArrival;
