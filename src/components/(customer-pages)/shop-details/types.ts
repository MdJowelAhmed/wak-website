import { mapOptionList } from "../../../../helpers/product-variant";
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

export interface ProductVariantItem {
    id: string;
    color: string;
    image?: string;
    stock: number;
    sizes: string[];
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
    lowStockThreshold?: number;
    status?: string;
    weight?: number;
    dimensions?: ProductDimensions;
    highlights: ProductHighlight[];
    rating: number;
    reviews: number;
    localDeliveryFee?: number;
    colors: string[];
    sizes: string[];
    variants: ProductVariantItem[];
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
    requiresVariant?: boolean;
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
        status?: string;
        lowStockThreshold?: number;
        localDeliveryFee?: number;
        colors?: unknown;
        sizes?: unknown;
        variants?: unknown;
    };

    if (!row._id || !row.name) return null;

    const listPrice = asNumber(row.price) ?? 0;
    const salePrice = asNumber(row.discountPrice);
    const onSale = salePrice !== undefined && salePrice > 0 && salePrice < listPrice;
    const price = onSale ? salePrice : listPrice;
    const originalPrice = onSale ? listPrice : undefined;
    const discount = onSale ? Math.round(((listPrice - price) / listPrice) * 100) : undefined;

    const baseImages = Array.isArray(row.images)
        ? row.images
              .filter((item): item is string => typeof item === "string" && item.length > 0)
              .map((item) => resolveImageUrl(item, "/placeholder.jpg") || "/placeholder.jpg")
        : [];

    // Parse Variants
    const rawVariants = Array.isArray(row.variants) ? row.variants : [];
    const variants: ProductVariantItem[] = [];
    const variantColors: string[] = [];
    const variantSizesSet = new Set<string>();
    const variantImages: string[] = [];

    for (const v of rawVariants) {
        if (!v || typeof v !== "object") continue;
        const item = v as {
            _id?: string;
            color?: string;
            image?: string;
            stock?: number;
            sizes?: unknown;
        };

        const color = typeof item.color === "string" ? item.color.trim() : "";
        const stock = asNumber(item.stock) ?? 0;
        const rawSizes = Array.isArray(item.sizes) ? item.sizes : [];
        const sizes = rawSizes
            .filter((s): s is string => typeof s === "string" && s.trim().length > 0)
            .map((s) => s.trim());

        sizes.forEach((s) => variantSizesSet.add(s));

        if (color && !variantColors.includes(color)) {
            variantColors.push(color);
        }

        const resolvedVariantImg = item.image
            ? resolveImageUrl(item.image, "") || ""
            : "";
        if (resolvedVariantImg && !variantImages.includes(resolvedVariantImg)) {
            variantImages.push(resolvedVariantImg);
        }

        variants.push({
            id: item._id || color || Math.random().toString(),
            color,
            image: resolvedVariantImg || undefined,
            stock,
            sizes,
        });
    }

    // Merge base images with variant images without duplicates
    const allImages: string[] = [...baseImages];
    for (const vImg of variantImages) {
        if (vImg && !allImages.includes(vImg)) {
            allImages.push(vImg);
        }
    }
    const finalImages = allImages.length > 0 ? allImages : ["/placeholder.jpg"];

    const colors = variantColors.length > 0 ? variantColors : mapOptionList(row.colors);
    const sizes = variantSizesSet.size > 0 ? Array.from(variantSizesSet) : mapOptionList(row.sizes);

    const highlights: ProductHighlight[] = [];
    if (Array.isArray(row.topHighlights)) {
        for (const item of row.topHighlights) {
            if (!item || typeof item !== "object") continue;
            const highlight = item as { name?: string; label?: string; value?: string };
            const label = highlight.name || highlight.label;
            if (!label || !highlight.value) continue;
            highlights.push({ label, value: highlight.value });
        }
    }

    const length = asNumber(row.dimensions?.length);
    const width = asNumber(row.dimensions?.width);
    const height = asNumber(row.dimensions?.height);
    const hasDimensions =
        length !== undefined &&
        width !== undefined &&
        height !== undefined &&
        (length > 0 || width > 0 || height > 0);

    const weightNum = asNumber(row.weight);
    const weight = weightNum !== undefined && weightNum > 0 ? weightNum : undefined;

    return {
        id: row._id,
        slug: row.slug || row._id,
        name: row.name,
        sku: row.sku || "",
        description: row.description || "",
        productDetails: row.productDetails || "",
        images: finalImages,
        price,
        originalPrice,
        discount,
        stock: asNumber(row.stock) ?? 0,
        lowStockThreshold: asNumber(row.lowStockThreshold) ?? 5,
        status: row.status,
        weight,
        dimensions:
            hasDimensions && length !== undefined && width !== undefined && height !== undefined
                ? { length, width, height }
                : undefined,
        highlights,
        rating: asNumber(row.ratingAverage) ?? 0,
        reviews: asNumber(row.ratingCount) ?? 0,
        localDeliveryFee: asNumber(row.localDeliveryFee),
        colors,
        sizes,
        variants,
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
                requiresVariant:
                    mapped.colors.length > 0 ||
                    mapped.sizes.length > 0 ||
                    mapped.variants.length > 0,
            },
        ];
    });
}
