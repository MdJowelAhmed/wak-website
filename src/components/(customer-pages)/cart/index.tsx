"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import CartItemRow from "./CartItemRow";
import OrderSummary from "./OrderSummary";
import { myFetch } from "../../../../helpers/myFetch";
import { resolveImageUrl } from "../../../../helpers/resolveImageUrl";
import { useCart } from "@/context/CartContext";

export interface CartItem {
    id: string; // cart item ID
    productId: string; // actual product ID
    name: string;
    price: number;
    image: string;
    quantity: number;
}

const ProductCart = () => {
    const [items, setItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const { refreshCart } = useCart();
    // Assuming a static delivery fee for now unless provided by API
    const deliveryFee = 55;

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const res = await myFetch('/carts/', { cache: 'no-store' });
                if (res?.data?.items) {
                    const mappedItems = res.data.items.map((item: any) => ({
                        id: item._id,
                        productId: item.product?._id,
                        name: item.product?.name || "Unknown Product",
                        price: item.product?.discountPrice || item.product?.price || 0,
                        image: resolveImageUrl(item.product?.images?.[0]) || "/placeholder.jpg",
                        quantity: item.quantity || 1
                    }));
                    setItems(mappedItems);
                }
            } catch (error) {
                console.error("Failed to fetch cart", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCart();
    }, []);

    const handleRemove = async (id: string) => {
        const itemToRemove = items.find(item => item.id === id);
        if (!itemToRemove) return;

        // Optimistically remove from state
        setItems(items.filter((item) => item.id !== id));
        
        try {
            await myFetch(`/carts/products/${itemToRemove.productId}`, { method: 'DELETE' });
            await refreshCart(); // sync navbar count
        } catch (error) {
            console.error("Failed to delete item", error);
        }
    };

    const handleQuantityChange = async (id: string, newQuantity: number) => {
        const itemToUpdate = items.find(item => item.id === id);
        if (!itemToUpdate) return;
        
        const isIncrementing = newQuantity > itemToUpdate.quantity;

        // Optimistically update state
        setItems(items.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)));
        
        try {
            const endpoint = isIncrementing ? '/carts/increment' : '/carts/decrement';
            await myFetch(endpoint, {
                method: 'PATCH',
                body: { product: itemToUpdate.productId }
            });
            await refreshCart(); // sync navbar count
        } catch (error) {
            console.error("Failed to update quantity", error);
        }
    };

    if (loading) {
        return (
            <main className="min-h-[calc(100vh-184px)] pt-14.5 flex items-center justify-center">
                <p className="text-white">Loading cart...</p>
            </main>
        );
    }

    const isEmpty = items.length === 0;

    return (
        <main className="min-h-[calc(100vh-184px)] pt-14.5 ">
            {isEmpty ? (
                /* Empty State */
                <div className="max-w-3xl mx-auto px-4">
                    <div className="rounded-2xl bg-white border border-zinc-200/50 shadow-xl p-16 text-center">
                        <div className="w-20 h-20 rounded-full bg-zinc-100 border border-zinc-200/60 flex items-center justify-center mx-auto mb-6">
                            <ShoppingCart size={40} className="text-zinc-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-zinc-900 mb-3">
                            Your cart is empty
                        </h2>
                        <p className="text-zinc-500 mb-8 font-medium">
                            Add items to your cart to get started
                        </p>
                        <Link
                            href="/"
                            className="inline-block px-8 py-3.5 rounded-xl bg-primary hover:bg-orange-500 text-white font-bold transition-all duration-300 shadow-md shadow-orange-500/20 hover:-translate-y-0.5 cursor-pointer"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            ) : (
                /* Cart with Items */
                <div className="container mx-auto px-4">
                    <h1 className="text-2xl font-bold text-white mb-8">Shopping Cart</h1>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Items Section */}
                        <div className="lg:col-span-2 space-y-4">
                            {items.map((item) => (
                                <CartItemRow
                                    key={item.id}
                                    item={item}
                                    onRemove={handleRemove}
                                    onQuantityChange={handleQuantityChange}
                                />
                            ))}
                        </div>

                        {/* Summary Section */}
                        <div className="lg:col-span-1">
                            <OrderSummary items={items} />
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default ProductCart;