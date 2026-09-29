export type ProductVariant = {
    color?: string;
    size?: string;
};

export function mapOptionList(value: unknown): string[] {
    if (!Array.isArray(value)) return [];

    const seen = new Set<string>();
    const options: string[] = [];

    for (const item of value) {
        if (typeof item !== "string") continue;
        const option = item.trim();
        if (!option || seen.has(option)) continue;
        seen.add(option);
        options.push(option);
    }

    return options;
}

export function productRequiresVariant(product?: {
    colors?: unknown;
    sizes?: unknown;
    variants?: unknown;
    hasVariant?: unknown;
} | null): boolean {
    if (!product || typeof product !== "object") return false;

    if (Array.isArray(product.variants) && product.variants.length > 0) {
        return true;
    }
    if (Boolean(product.hasVariant)) {
        return true;
    }
    return mapOptionList(product.colors).length > 0 || mapOptionList(product.sizes).length > 0;
}

export function variantFields(variant?: ProductVariant): ProductVariant {
    const color = variant?.color?.trim();
    const size = variant?.size?.trim();

    return {
        ...(color ? { color } : {}),
        ...(size ? { size } : {}),
    };
}

export function cartAddBody(
    productId: string,
    quantity: number,
    variant?: ProductVariant,
) {
    return {
        product: productId,
        quantity,
        ...variantFields(variant),
    };
}

export function cartUpdateBody(productId: string, variant?: ProductVariant) {
    return {
        product: productId,
        ...variantFields(variant),
    };
}

export function cartRemovePath(productId: string, variant?: ProductVariant) {
    const fields = variantFields(variant);
    const params = new URLSearchParams();
    if (fields.color) params.set("color", fields.color);
    if (fields.size) params.set("size", fields.size);
    const query = params.toString();
    return query ? `/cart/products/${productId}?${query}` : `/cart/products/${productId}`;
}

export function formatVariantLabel(
    variant: ProductVariant,
    labels: {
        color: (value: string) => string;
        size: (value: string) => string;
    },
): string {
    const parts: string[] = [];
    if (variant.color) parts.push(labels.color(variant.color));
    if (variant.size) parts.push(labels.size(variant.size));
    return parts.join(" · ");
}
