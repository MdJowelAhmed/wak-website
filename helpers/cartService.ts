/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { myFetch, type FetchResponse } from "./myFetch";

export interface CartVariantParam {
    product: string;
    color?: string;
    size?: string;
}

export interface AddToCartInput extends CartVariantParam {
    quantity: number;
}

/**
 * Execute a cart request with primary path (/cart) and automatic fallback
 * to /carts if the backend route is mounted at /carts instead of /cart.
 */
export async function cartApiFetch<T = any>(
    path: string,
    options: Parameters<typeof myFetch>[1] = {}
): Promise<FetchResponse<T>> {
    const res = await myFetch<T>(path, options);
    // If backend returns 404 or "API DOESN'T EXIST" on /cart, retry with /carts
    if (
        !res.success &&
        (res.error?.includes("API DOESN'T EXIST") || res.message === "Not found")
    ) {
        let altPath = path;
        if (path.startsWith("/cart/")) {
            altPath = path.replace(/^\/cart\//, "/carts/");
        } else if (path === "/cart" || path.startsWith("/cart?")) {
            altPath = path.replace(/^\/cart/, "/carts");
        } else if (path.startsWith("/carts/")) {
            altPath = path.replace(/^\/carts\//, "/cart/");
        } else if (path === "/carts" || path.startsWith("/carts?")) {
            altPath = path.replace(/^\/carts/, "/cart");
        }

        if (altPath !== path) {
            return await myFetch<T>(altPath, options);
        }
    }
    return res;
}

/**
 * A. Add To Cart
 * Endpoint: POST /api/v1/cart
 * Payload:
 * {
 *   "product": "64b1f... (ObjectId)",
 *   "quantity": 1,
 *   "color": "Red",   // REQUIRED if the product has variants
 *   "size": "L"       // REQUIRED if the selected variant has sizes
 * }
 */
export async function apiAddToCart(input: AddToCartInput) {
    const body: Record<string, unknown> = {
        product: input.product,
        quantity: input.quantity,
    };
    if (input.color?.trim()) {
        body.color = input.color.trim();
    }
    if (input.size?.trim()) {
        body.size = input.size.trim();
    }

    return cartApiFetch("/cart", {
        method: "POST",
        body,
    });
}

/**
 * B. Increment Cart Item Quantity
 * Endpoint: PATCH /api/v1/cart/increment
 * Payload:
 * {
 *   "product": "64b1f... (ObjectId)",
 *   "color": "Red",
 *   "size": "L"
 * }
 */
export async function apiIncrementCartItem(input: CartVariantParam) {
    const body: Record<string, unknown> = {
        product: input.product,
    };
    if (input.color?.trim()) {
        body.color = input.color.trim();
    }
    if (input.size?.trim()) {
        body.size = input.size.trim();
    }

    return cartApiFetch("/cart/increment", {
        method: "PATCH",
        body,
    });
}

/**
 * C. Decrement Cart Item Quantity
 * Endpoint: PATCH /api/v1/cart/decrement
 * Payload:
 * {
 *   "product": "64b1f... (ObjectId)",
 *   "color": "Red",
 *   "size": "L"
 * }
 */
export async function apiDecrementCartItem(input: CartVariantParam) {
    const body: Record<string, unknown> = {
        product: input.product,
    };
    if (input.color?.trim()) {
        body.color = input.color.trim();
    }
    if (input.size?.trim()) {
        body.size = input.size.trim();
    }

    return cartApiFetch("/cart/decrement", {
        method: "PATCH",
        body,
    });
}

/**
 * D. Remove Item From Cart
 * Endpoint: DELETE /api/v1/cart/products/:productId?color=Red&size=L
 */
export async function apiRemoveCartItem(
    productId: string,
    variant?: { color?: string; size?: string }
) {
    const params = new URLSearchParams();
    if (variant?.color?.trim()) {
        params.set("color", variant.color.trim());
    }
    if (variant?.size?.trim()) {
        params.set("size", variant.size.trim());
    }
    const query = params.toString();
    const endpoint = query
        ? `/cart/products/${encodeURIComponent(productId)}?${query}`
        : `/cart/products/${encodeURIComponent(productId)}`;

    return cartApiFetch(endpoint, {
        method: "DELETE",
    });
}

/**
 * Get Cart
 * Endpoint: GET /api/v1/cart
 */
export async function apiGetCart() {
    return cartApiFetch("/cart", {
        cache: "no-store",
    });
}
