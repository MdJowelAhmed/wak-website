import { variantFields, type ProductVariant } from "../../../../helpers/product-variant";
import { resolveImageUrl } from "../../../../helpers/resolveImageUrl";
import {
    mapShippingAddresses,
    type ShippingAddress,
} from "../../../../helpers/shipping-address";

export type DeliveryOption = "delivery" | "pickup";
export type PaymentMethod = "stripe" | "paychangu";
export type Address = ShippingAddress;

export interface Country {
    name: string;
    countryCode: string;
}

export interface CartItem extends ProductVariant {
    id: string;
    productId: string;
    slug?: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
}

export interface CheckoutAddressForm {
    fullName: string;
    phone: string;
    email: string;
    city: string;
    state: string;
    address: string;
    country: string;
    countryCode: string;
    postalCode: string;
    latitude: number;
    longitude: number;
    isDefault: boolean;
}

export interface ShippingEstimate {
    grandSubTotal: number;
    grandShippingTotal: number;
    grandTotal: number;
}

export function formatCheckoutMoney(amount: number): string {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(amount);
}

export function mapCartItems(items: unknown): CartItem[] {
    if (!Array.isArray(items)) return [];

    return items.map((item) => {
        const row = item as {
            _id?: string;
            quantity?: number;
            color?: string;
            size?: string;
            product?: {
                _id?: string;
                slug?: string;
                name?: string;
                discountPrice?: number;
                price?: number;
                images?: string[];
                color?: string;
                size?: string;
            };
        };

        return {
            id: row._id || "",
            productId: row.product?._id || "",
            slug: row.product?.slug,
            name: row.product?.name || "Unknown Product",
            price: row.product?.discountPrice || row.product?.price || 0,
            image: resolveImageUrl(row.product?.images?.[0], "/placeholder.jpg") || "/placeholder.jpg",
            quantity: row.quantity || 1,
            ...variantFields({
                color: row.color || row.product?.color,
                size: row.size || row.product?.size,
            }),
        };
    });
}

export function mapAddresses(data: unknown): Address[] {
    return mapShippingAddresses(data);
}

export function mapCountries(data: unknown): Country[] {
    if (!Array.isArray(data)) return [];

    const countries: Country[] = [];
    for (const item of data) {
        const row = item as { name?: string; countryCode?: string };
        if (!row.name) continue;
        countries.push({ name: row.name, countryCode: row.countryCode || "" });
    }
    return countries;
}

export function formFromAddress(
    address: Address | null,
    email: string,
): CheckoutAddressForm {
    return {
        fullName: address?.fullName || "",
        phone: address?.phone || "",
        email,
        city: address?.city || "",
        state: address?.state || "",
        address: address?.address || "",
        country: address?.country || "",
        countryCode: address?.countryCode || "",
        postalCode: address?.postalCode || "",
        latitude: address?.latitude ?? 0,
        longitude: address?.longitude ?? 0,
        isDefault: address?.isDefault ?? true,
    };
}

export function readEstimate(data: unknown): ShippingEstimate | null {
    if (!data || typeof data !== "object") return null;
    const row = data as {
        grandSubTotal?: number;
        grandShippingTotal?: number;
        grandTotal?: number;
    };
    if (
        typeof row.grandSubTotal !== "number" ||
        typeof row.grandShippingTotal !== "number" ||
        typeof row.grandTotal !== "number"
    ) {
        return null;
    }
    return {
        grandSubTotal: row.grandSubTotal,
        grandShippingTotal: row.grandShippingTotal,
        grandTotal: row.grandTotal,
    };
}
