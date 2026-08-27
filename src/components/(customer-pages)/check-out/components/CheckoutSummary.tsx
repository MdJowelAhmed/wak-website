"use client";

import React from 'react';

interface CartItem {
    id: string;
    productId: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
}

interface CheckoutSummaryProps {
    cartItems: CartItem[];
    subtotal: number;
    shippingFee: number;
    grandTotal: number;
    handlePlaceOrder: () => void;
    isPlacingOrder?: boolean;
}

export default function CheckoutSummary({ cartItems, subtotal, shippingFee, grandTotal, handlePlaceOrder, isPlacingOrder }: CheckoutSummaryProps) {
    return (
        <div className="w-full lg:w-[420px] space-y-6">
            {/* Order Summary Card */}
            <div className="bg-sky-50/50 rounded-xl border border-sky-100 p-6 shadow-sm">
                <h2 className="text-lg font-bold text-zinc-900 mb-6">Your Order Summary</h2>
                
                {/* Items List */}
                <div className="space-y-4 mb-6">
                    {cartItems.map(item => (
                        <div key={item.id} className="flex gap-4 items-center">
                            <div className="w-12 h-12 rounded-md bg-white border border-zinc-100 flex items-center justify-center shrink-0 overflow-hidden p-1.5 shadow-sm">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-zinc-700 line-clamp-1 mb-1">{item.name}</p>
                                <p className="text-xs text-zinc-500">Qty: {item.quantity}</p>
                            </div>
                            <div className="text-sm font-bold text-zinc-900 whitespace-nowrap">
                                ${(item.price * item.quantity).toLocaleString()}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Totals */}
                <div className="space-y-3 pt-4 border-t border-zinc-200/60">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-zinc-600 font-medium">Items Subtotal</span>
                        <span className="text-zinc-900 font-bold">${subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-zinc-600 font-medium">Shipping Fee</span>
                        <span className="text-zinc-900 font-bold">${shippingFee}</span>
                    </div>
                    <div className="flex justify-between items-center text-base pt-3 mt-3 border-t border-zinc-200/60">
                        <span className="text-zinc-900 font-bold">Grand Total</span>
                        <span className="text-zinc-900 font-bold">${grandTotal.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {/* Place Order Button */}
            <div className="bg-sky-50/50 rounded-xl border border-sky-100 p-6 shadow-sm flex flex-col gap-4">
                 <button 
                    onClick={handlePlaceOrder}
                    disabled={isPlacingOrder}
                    className={`w-full font-bold py-3.5 rounded-lg shadow-md shadow-orange-500/20 active:scale-95 transition-all ${
                        isPlacingOrder ? 'bg-zinc-400 text-white cursor-not-allowed' : 'bg-primary hover:bg-orange-500 text-white'
                    }`}
                >
                    {isPlacingOrder ? 'Processing...' : 'Place Order'}
                 </button>
            </div>

        </div>
    );
}
