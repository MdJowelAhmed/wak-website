"use client";

import Link from "next/link";
import { CartItem } from "../cart";

interface OrderSummaryProps {
    items: CartItem[];
}

export default function OrderSummary({ items }: OrderSummaryProps) {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const total = subtotal;

    return (
        <div className="h-fit sticky top-6 rounded-2xl bg-white border border-zinc-200/50 shadow-md">
            {/* Header */}
            <div className="px-6 py-5 pb-0!">
                <h2 className="text-lg font-bold text-zinc-900">Summary</h2>
            </div>
 
            {/* Items List */}
            <div className="px-6 py-5 space-y-4 border-b border-zinc-100">
                {items.map((item) => (
                    <div key={item.id} className="flex items-start gap-3">
                        {/* Item Image */}
                        <div className="w-14 h-14 rounded-lg bg-zinc-50 shrink-0 overflow-hidden border border-zinc-100 flex items-center justify-center">
                            <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-contain p-2"
                            />
                        </div>
 
                        {/* Item Details */}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-zinc-800 line-clamp-1">
                                {item.name}
                            </p>
                            <p className="text-base font-bold text-primary mt-0.5">
                                ${item.price.toLocaleString()}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
 
            {/* Pricing Details */}
            <div className="px-6 py-5 space-y-3">
                <div className="flex justify-between items-center">
                    <span className="text-sm text-zinc-500">Subtotal Amount</span>
                    <span className="font-semibold text-zinc-800">
                        ${subtotal.toLocaleString()}
                    </span>
                </div>
            </div>
 
            {/* Total */}
            <div className="px-6 py-5 border-t border-zinc-100">
                <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-zinc-700">Total Amount</span>
                    <span className="text-2xl font-bold text-primary">
                        ${total.toLocaleString()}
                    </span>
                </div>
            </div>
 
            {/* Checkout Button */}
            <div className="px-6 pb-5">
                <Link
                    href="/check-out"
                    className="w-full px-6 py-3.5 rounded-xl bg-primary hover:bg-orange-500 text-white font-semibold text-center transition-all duration-300 shadow-md shadow-orange-500/10 block cursor-pointer"
                >
                    Check out
                </Link>
            </div>
        </div>
    );
}
