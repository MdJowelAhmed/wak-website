import { resolveImageUrl } from "../../../../helpers/resolveImageUrl";

export type DeliveryOption = "delivery" | "pickup";
export type PaymentMethod = "stripe" | "paychangu";

export interface Address {
    _id: string;
    fullName: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    country: string;
    countryCode?: string;
    postalCode?: string;
    isDefault: boolean;
    latitude?: number;
    longitude?: number;
}

export interface Country {
    name: string;
    countryCode: string;
}

export interface CartItem {
    id: string;
    productId: string;
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
    saveAddress: boolean;
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
            product?: {
                _id?: string;
                name?: string;
                discountPrice?: number;
                price?: number;
                images?: string[];
            };
        };

        return {
            id: row._id || "",
            productId: row.product?._id || "",
            name: row.product?.name || "Unknown Product",
            price: row.product?.discountPrice || row.product?.price || 0,
            image: resolveImageUrl(row.product?.images?.[0], "/placeholder.jpg") || "/placeholder.jpg",
            quantity: row.quantity || 1,
        };
    });
}

export function mapAddresses(data: unknown): Address[] {
    if (!Array.isArray(data)) return [];

    return data
        .map((item) => {
            const row = item as Partial<Address> & { _id?: string };
            if (!row._id) return null;
            return {
                _id: row._id,
                fullName: row.fullName || "",
                phone: row.phone || "",
                address: row.address || "",
                city: row.city || "",
                state: row.state || "",
                country: row.country || "",
                countryCode: row.countryCode,
                postalCode: row.postalCode,
                isDefault: Boolean(row.isDefault),
                latitude: row.latitude,
                longitude: row.longitude,
            };
        })
        .filter((address): address is Address => address !== null);
}

export function mapCountries(data: unknown): Country[] {
    if (!Array.isArray(data)) return [];

    return data
        .map((item) => {
            const row = item as { name?: string; countryCode?: string };
            if (!row.name) return null;
            return { name: row.name, countryCode: row.countryCode || "" };
        })
        .filter((country): country is Country => country !== null);
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
        country: address?.country || "Bangladesh",
        countryCode: address?.countryCode || "BD",
        postalCode: address?.postalCode || "",
        latitude: address?.latitude ?? 23.7465,
        longitude: address?.longitude ?? 90.376,
        saveAddress: false,
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
