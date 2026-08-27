"use client";

import { useEffect, useState } from "react";
import ProductGallery from "./components/ProductGallery";
import ProductInfo from "./components/ProductInfo";
import RelatedItems from "./components/RelatedItems";
import { myFetch } from "../../../../helpers/myFetch";
import { resolveImageUrl } from "../../../../helpers/resolveImageUrl";


interface ShopDetailsProps {
    slug: string;
}

export default function ShopDetails({ slug }: ShopDetailsProps) {
    const [product, setProduct] = useState<any>(null);
    const [relatedProductsData, setRelatedProductsData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await myFetch(`/products/slug/${slug}`);
                if (res?.data) {
                    setProduct(res.data);
                    
                    // Fetch related products
                    try {
                        const relatedRes = await myFetch(`/products/${res.data._id}/related`);
                        if (relatedRes?.data) {
                            setRelatedProductsData(relatedRes.data);
                        }
                    } catch (relatedError) {
                        console.error("Failed to fetch related products:", relatedError);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch product:", error);
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchProduct();
        }
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-[calc(100vh-180px)] bg-[#4f2c1d] py-[50px] flex items-center justify-center">
                <p className="text-white">Loading...</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-[calc(100vh-180px)] bg-[#4f2c1d] py-[50px] flex items-center justify-center">
                <p className="text-white">Product not found</p>
            </div>
        );
    }

    // Map API highlights to UI highlights
    const highlights = product.topHighlights?.map((h: any) => ({
        label: h.name,
        value: h.value
    })) || [];

    // Map product details string to aboutItems array
    const aboutItems = product.productDetails 
        ? product.productDetails.split(". ").filter(Boolean).map((s: string) => s + (s.endsWith(".") ? "" : "."))
        : [];

    const relatedProductsMapped = relatedProductsData.map((rp: any) => ({
        id: rp.slug || rp._id,
        name: rp.name,
        image: resolveImageUrl(rp.images?.[0]) || "/placeholder.jpg",
        currentPrice: rp.discountPrice || rp.price,
        originalPrice: rp.price,
        discount: rp.discountPrice ? Math.round(((rp.price - rp.discountPrice) / rp.price) * 100) : 0,
        rating: rp.ratingAverage || 0,
        reviews: rp.ratingCount || 0
    }));

    return (
        <div className="min-h-[calc(100vh-180px)] bg-[#4f2c1d] py-[50px]">
            <div className="container mx-auto px-4">
                <p className=" text-2xl font-medium mb-8 text-white"> Product Details </p>
                {/* ── Main: Gallery LEFT | Info RIGHT ── */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-8 xl:gap-14 items-start">

                    {/* Sticky gallery column */}
                    <div className="lg:sticky lg:top-24">
                        <ProductGallery
                            images={(product.images || []).map((img: string) => resolveImageUrl(img))}
                            name={product.name}
                            inStock={product.stock > 0}
                        />
                    </div>

                    {/* Right scrollable column — all info + details + buttons */}
                    <ProductInfo
                        productId={product._id}
                        name={product.name}
                        price={product.discountPrice || product.price}
                        originalPrice={product.discountPrice ? product.price : undefined}
                        discount={product.discountPrice ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0}
                        rating={product.ratingAverage || 0}
                        reviews={product.ratingCount || 0}
                        aboutItems={aboutItems}
                        highlights={highlights}
                    />
                </div>

                {/* ── Related Items ── */}
                {relatedProductsMapped.length > 0 && (
                    <div className="mt-16 border-t border-white/5 pt-4">
                        <RelatedItems products={relatedProductsMapped} />
                    </div>
                )}
            </div>
        </div>
    );
}
