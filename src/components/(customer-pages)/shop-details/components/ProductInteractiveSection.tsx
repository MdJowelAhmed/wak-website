"use client";

import { useState } from "react";
import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";
import type { ProductDetailsData } from "../types";

export default function ProductInteractiveSection({
    product,
}: {
    product: ProductDetailsData;
}) {
    const [activeIndex, setActiveIndex] = useState(0);

    const handleSelectColorImage = (imgUrl: string) => {
        const found = product.images.indexOf(imgUrl);
        if (found !== -1) {
            setActiveIndex(found);
        }
    };

    return (
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_1.05fr] xl:gap-12">
            <div className="lg:sticky lg:top-24">
                <ProductGallery
                    images={product.images}
                    name={product.name}
                    inStock={product.stock > 0}
                    discount={product.discount}
                    activeIndex={activeIndex}
                    onActiveIndexChange={setActiveIndex}
                />
            </div>
            <ProductInfo
                product={product}
                onSelectImage={handleSelectColorImage}
            />
        </div>
    );
}
