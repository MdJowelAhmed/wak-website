import { resolveImageUrl } from "../../../../helpers/resolveImageUrl";

export interface ProductHighlight {
    label: string;
    value: string;
}

export interface ProductDimensions {
    length: number;
    width: number;
    height: number;
}

export interface ProductDetailsData {
    id: string;
    slug: string;
    name: string;
    sku: string;
    description: string;
    productDetails: string;
    images: string[];
    price: number;
    originalPrice?: number;
    discount?: number;
    stock: number;
    weight?: number;
    dimensions?: ProductDimensions;
    highlights: ProductHighlight[];
    rating: number;
    reviews: number;
    localDeliveryFee?: number;
}

export interface RelatedProduct {
    id: string;
    productId: string;
    name: string;
    image: string;
    currentPrice: number;
    originalPrice?: number;
    discount?: number;
    rating: number;
    reviews: number;
}

function asNumber(value: unknown): number | undefined {
    return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

export function formatProductPrice(amount: number): string {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
    }).format(amount);
}

export function mapProductDetails(raw: unknown): ProductDetailsData | null {
    if (!raw || typeof raw !== "object") return null;
    const row = raw as {
        _id?: string;
        slug?: string;
        name?: string;
        sku?: string;
        description?: string;
        productDetails?: string;
        images?: unknown;
        price?: number;
        discountPrice?: number;
        stock?: number;
        weight?: number;
        dimensions?: { length?: number; width?: number; height?: number };
        topHighlights?: unknown;
        ratingAverage?: number;
        ratingCount?: number;
        localDeliveryFee?: number;
    };

    if (!row._id || !row.name) return null;

    const listPrice = asNumber(row.price) ?? 0;
    const salePrice = asNumber(row.discountPrice);
    const onSale = salePrice !== undefined && salePrice > 0 && salePrice < listPrice;
    const price = onSale ? salePrice : listPrice;
    const originalPrice = onSale ? listPrice : undefined;
    const discount = onSale ? Math.round(((listPrice - price) / listPrice) * 100) : undefined;

    const images = Array.isArray(row.images)
        ? row.images
              .filter((item): item is string => typeof item === "string" && item.length > 0)
              .map((item) => resolveImageUrl(item, "/placeholder.jpg") || "/placeholder.jpg")
        : [];

    const highlights: ProductHighlight[] = [];
    if (Array.isArray(row.topHighlights)) {
        for (const item of row.topHighlights) {
            if (!item || typeof item !== "object") continue;
            const highlight = item as { name?: string; value?: string };
            if (!highlight.name || !highlight.value) continue;
            highlights.push({ label: highlight.name, value: highlight.value });
        }
    }

    const length = asNumber(row.dimensions?.length);
    const width = asNumber(row.dimensions?.width);
    const height = asNumber(row.dimensions?.height);

    return {
        id: row._id,
        slug: row.slug || row._id,
        name: row.name,
        sku: row.sku || "",
        description: row.description || "",
        productDetails: row.productDetails || "",
        images: images.length > 0 ? images : ["/placeholder.jpg"],
        price,
        originalPrice,
        discount,
        stock: asNumber(row.stock) ?? 0,
        weight: asNumber(row.weight),
        dimensions:
            length !== undefined && width !== undefined && height !== undefined
                ? { length, width, height }
                : undefined,
        highlights,
        rating: asNumber(row.ratingAverage) ?? 0,
        reviews: asNumber(row.ratingCount) ?? 0,
        localDeliveryFee: asNumber(row.localDeliveryFee),
    };
}

export function mapRelatedProducts(raw: unknown): RelatedProduct[] {
    if (!Array.isArray(raw)) return [];

    return raw.flatMap((item) => {
        const mapped = mapProductDetails(item);
        if (!mapped) return [];
        return [
            {
                id: mapped.slug,
                productId: mapped.id,
                name: mapped.name,
                image: mapped.images[0],
                currentPrice: mapped.price,
                originalPrice: mapped.originalPrice,
                discount: mapped.discount,
                rating: mapped.rating,
                reviews: mapped.reviews,
            },
        ];
    });
}
