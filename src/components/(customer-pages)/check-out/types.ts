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
                slug?: string;
                name?: string;
                discountPrice?: number;
                price?: number;
                images?: string[];
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
        };
    });
}

function asAddressList(data: unknown): unknown[] {
    if (Array.isArray(data)) return data;
    if (!data || typeof data !== "object") return [];
    const row = data as { addresses?: unknown; items?: unknown; data?: unknown };
    if (Array.isArray(row.addresses)) return row.addresses;
    if (Array.isArray(row.items)) return row.items;
    if (Array.isArray(row.data)) return row.data;
    return [];
}

export function mapAddresses(data: unknown): Address[] {
    const list = asAddressList(data);
    const addresses: Address[] = [];
    for (const item of list) {
        const row = item as Partial<Address> & { _id?: string; id?: string };
        const id = row._id || row.id;
        if (!id) continue;

        const address: Address = {
            _id: id,
            fullName: row.fullName || "",
            phone: row.phone || "",
            address: row.address || "",
            city: row.city || "",
            state: row.state || "",
            country: row.country || "",
            isDefault: Boolean(row.isDefault),
        };
        if (row.countryCode) address.countryCode = row.countryCode;
        if (row.postalCode) address.postalCode = row.postalCode;
        if (typeof row.latitude === "number") address.latitude = row.latitude;
        if (typeof row.longitude === "number") address.longitude = row.longitude;
        addresses.push(address);
    }
    return addresses;
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
