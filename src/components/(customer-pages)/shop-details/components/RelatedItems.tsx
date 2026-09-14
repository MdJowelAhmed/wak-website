"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import ProductCard from "@/shared/ProductCard";
import { Link } from "@/i18n/navigation";
import type { RelatedProduct } from "../types";

import "swiper/css";

export default function RelatedItems({ products }: { products: RelatedProduct[] }) {
    const t = useTranslations("ShopDetails");

    return (
        <section className="pt-4">
            <div className="mb-6 flex items-center justify-between gap-4">
                <h2 className="text-lg font-bold text-white">{t("related")}</h2>
                <Link
                    href="/shop"
                    className="inline-flex items-center gap-1 text-sm font-semibold text-white/80 hover:text-white"
                >
                    {t("viewAll")}
                    <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                </Link>
            </div>
            <Swiper
                modules={[Autoplay]}
                spaceBetween={16}
                autoplay={{ delay: 3500, disableOnInteraction: false, pauseOnMouseEnter: true }}
                breakpoints={{
                    320: { slidesPerView: 1.15, spaceBetween: 12 },
                    640: { slidesPerView: 2.2, spaceBetween: 16 },
                    1024: { slidesPerView: 3, spaceBetween: 16 },
                    1280: { slidesPerView: 4, spaceBetween: 16 },
                }}
                className="w-full"
            >
                {products.map((product) => (
                    <SwiperSlide key={product.productId}>
                        <ProductCard
                            product={{
                                id: product.id,
                                productId: product.productId,
                                name: product.name,
                                image: product.image,
                                currentPrice: product.currentPrice,
                                originalPrice: product.originalPrice,
                                discount: product.discount,
                                rating: product.rating,
                                reviews: product.reviews,
                            }}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
}
