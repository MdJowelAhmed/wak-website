"use client";

import Image from "next/image";
import { Button } from "@/ui/button";
import type { CartItem, DeliveryOption, PaymentMethod } from "../types";

interface CheckoutSummaryProps {
    cartItems: CartItem[];
    subtotal: number;
    shippingFee: number;
    grandTotal: number;
    deliveryOption: DeliveryOption;
    paymentMethod: PaymentMethod;
    formatMoney: (amountUsd: number) => string;
    onPlaceOrder: () => void;
    isPlacingOrder: boolean;
}

export default function CheckoutSummary({
    cartItems,
    subtotal,
    shippingFee,
    grandTotal,
    deliveryOption,
    paymentMethod,
    formatMoney,
    onPlaceOrder,
    isPlacingOrder,
}: CheckoutSummaryProps) {
    const paymentLabel = paymentMethod === "stripe" ? "Stripe" : "PayChangu";

    return (
        <aside className="w-full space-y-6 lg:w-[400px]">
            <section className="rounded-2xl border border-white/10 bg-secondary p-5 shadow-lg sm:p-6">
                <h2 className="mb-5 text-lg font-bold text-white">Order summary</h2>
                <div className="space-y-4">
                    {cartItems.map((item) => (
                        <div key={item.id} className="flex items-center gap-3">
                            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-white/10">
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    sizes="48px"
                                    unoptimized
                                    className="object-cover"
                                />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-white">{item.name}</p>
                                <p className="text-xs text-white/55">Qty {item.quantity}</p>
                            </div>
                            <p className="text-sm font-semibold text-white">
                                {formatMoney(item.price * item.quantity)}
                            </p>
                        </div>
                    ))}
                </div>

                <dl className="mt-5 space-y-2.5 border-t border-white/10 pt-4 text-sm">
                    <div className="flex justify-between gap-4">
                        <dt className="text-white/65">Subtotal</dt>
                        <dd className="font-medium text-white">{formatMoney(subtotal)}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                        <dt className="text-white/65">
                            {deliveryOption === "pickup" ? "Pickup" : "Shipping"}
                        </dt>
                        <dd className="font-medium text-white">
                            {deliveryOption === "pickup" ? "Free" : formatMoney(shippingFee)}
                        </dd>
                    </div>
                    <div className="flex justify-between gap-4 border-t border-white/10 pt-2.5">
                        <dt className="font-semibold text-white">Total</dt>
                        <dd className="font-bold text-primary">{formatMoney(grandTotal)}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                        <dt className="text-white/65">Pay with</dt>
                        <dd className="font-medium text-white">{paymentLabel}</dd>
                    </div>
                    {paymentMethod === "stripe" ? (
                        <p className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs leading-relaxed text-white/75">
                            A Stripe charge will be added when you pay with Stripe.
                        </p>
                    ) : null}
                </dl>
            </section>

            <Button
                type="button"
                size="lg"
                onClick={onPlaceOrder}
                disabled={isPlacingOrder || cartItems.length === 0}
                className="w-full rounded-xl shadow-md bg-secondary text-foreground hover:bg-secondary/80"
            >
                {isPlacingOrder ? "Redirecting..." : `Continue with ${paymentLabel}`}
            </Button>
        </aside>
    );
}
