export interface ProductCardPricing {
    currentPrice: number;
    /** Only set when the product is actually on sale. */
    originalPrice?: number;
    discount: number;
}

/** A discount only applies when it is positive and lower than the list price. */
export function getProductCardPricing(price?: number, discountPrice?: number): ProductCardPricing {
    const listPrice = typeof price === "number" && price > 0 ? price : 0;
    const salePrice = typeof discountPrice === "number" ? discountPrice : 0;

    if (salePrice <= 0 || salePrice >= listPrice) {
        return { currentPrice: listPrice, discount: 0 };
    }

    return {
        currentPrice: salePrice,
        originalPrice: listPrice,
        discount: Math.round(((listPrice - salePrice) / listPrice) * 100),
    };
}
