"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { formatCheckoutMoney, type CartItem } from "../check-out/types";

interface CartItemRowProps {
    item: CartItem;
    disabled?: boolean;
    onRemove: (id: string) => void;
    onQuantityChange: (id: string, quantity: number) => void;
}

export default function CartItemRow({
    item,
    disabled = false,
    onRemove,
    onQuantityChange,
}: CartItemRowProps) {
    const lineTotal = item.price * item.quantity;
    const href = `/shop/${item.slug || item.productId}`;

    return (
        <article className="rounded-2xl border border-white/10 bg-secondary p-4 shadow-lg sm:p-5">
            <div className="flex items-start gap-4 sm:items-center">
                <Link
                    href={href}
                    className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-white/10 sm:h-24 sm:w-24"
                >
                    <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="96px"
                        unoptimized
                        className="object-cover"
                    />
                </Link>

                <div className="min-w-0 flex-1">
                    <Link
                        href={href}
                        className="line-clamp-2 text-sm font-semibold text-white hover:underline sm:text-base"
                    >
                        {item.name}
                    </Link>
                    <p className="mt-1 text-sm text-white/70">
                        {formatCheckoutMoney(item.price)} each
                    </p>
                    <p className="mt-1 text-base font-bold text-primary sm:text-lg">
                        {formatCheckoutMoney(lineTotal)}
                    </p>
                </div>

                <div className="flex shrink-0 flex-col items-end gap-3 sm:flex-row sm:items-center">
                    <div className="flex items-center rounded-xl border border-white/15 bg-white/10">
                        <button
                            type="button"
                            onClick={() => item.quantity > 1 && onQuantityChange(item.id, item.quantity - 1)}
                            disabled={disabled || item.quantity <= 1}
                            className="flex h-9 w-9 items-center justify-center text-white transition-colors hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                            aria-label="Decrease quantity"
                        >
                            <Minus className="h-4 w-4" />
                        </button>
                        <span className="min-w-8 text-center text-sm font-semibold text-white">
                            {item.quantity}
                        </span>
                        <button
                            type="button"
                            onClick={() => onQuantityChange(item.id, item.quantity + 1)}
                            disabled={disabled}
                            className="flex h-9 w-9 items-center justify-center text-white transition-colors hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                            aria-label="Increase quantity"
                        >
                            <Plus className="h-4 w-4" />
                        </button>
                    </div>
                    <button
                        type="button"
                        onClick={() => onRemove(item.id)}
                        disabled={disabled}
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/80 transition-colors hover:border-red-400/40 hover:bg-red-500/15 hover:text-red-200 disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label="Remove item"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </article>
    );
}
