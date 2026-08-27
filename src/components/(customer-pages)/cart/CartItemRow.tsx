"use client";

import { Trash2, Minus, Plus } from "lucide-react";
import { useState } from "react";
import { CartItem } from "../cart";
import Image from "next/image";

interface CartItemRowProps {
    item: CartItem;
    onRemove?: (id: string) => void;
    onQuantityChange?: (id: string, quantity: number) => void;
}

export default function CartItemRow({
    item,
    onRemove,
    onQuantityChange,
}: CartItemRowProps) {
    const handleMinus = () => {
        if (item.quantity > 1) {
            onQuantityChange?.(item.id, item.quantity - 1);
        }
    };

    const handlePlus = () => {
        onQuantityChange?.(item.id, item.quantity + 1);
    };

    return (
        <div className="group p-5 rounded-xl bg-white/10 border border-zinc-200/50 shadow-md hover:shadow-lg transition-all duration-300">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex items-center gap-4 w-full sm:w-auto flex-1">
                    {/* Product Image */}
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg bg-zinc-50 border border-zinc-100 shrink-0 overflow-hidden flex items-center justify-center">
                        <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-contain p-2 sm:p-4"
                        />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-xl font-semibold text-white mb-1.5 sm:mb-2 line-clamp-2">
                            {item.name}
                        </h3>
                        <p className="text-xl sm:text-2xl font-semibold text-primary">
                            ${item.price.toLocaleString()}
                        </p>
                    </div>
                </div>

                {/* Controls & Delete button grouped together on mobile */}
                <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-4 sm:pt-0 border-t border-zinc-100 sm:border-0">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-1 bg-zinc-100 rounded-lg p-1 border border-zinc-200/50">
                        <button
                            onClick={handleMinus}
                            className="p-1.5 hover:bg-zinc-200 rounded transition-colors cursor-pointer"
                            aria-label="Decrease quantity"
                        >
                            <Minus size={14} className="text-zinc-600" />
                        </button>
                        <input
                            type="text"
                            value={item.quantity}
                            readOnly
                            className="w-8 h-8 text-center bg-white rounded text-zinc-900 border border-zinc-200/80 font-semibold text-xs sm:text-sm outline-none"
                        />
                        <button
                            onClick={handlePlus}
                            className="p-1.5 hover:bg-zinc-200 rounded transition-colors cursor-pointer"
                            aria-label="Increase quantity"
                        >
                            <Plus size={14} className="text-zinc-600" />
                        </button>
                    </div>

                    {/* Delete Button */}
                    <button
                        onClick={() => onRemove?.(item.id)}
                        className="p-2 sm:p-2.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 transition-colors shrink-0 cursor-pointer"
                        aria-label="Remove item"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}
