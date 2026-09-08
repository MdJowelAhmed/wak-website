"use client";

import { Checkbox } from "@/ui/checkbox";
import { cn } from "@/lib/utils";

const DISCOUNT_OPTIONS = [
    { label: "Regular Products", value: "regular" },
    { label: "Discounted Products", value: "discounted" },
];

interface OfferFilterProps {
    selectedOffers: string[];
    toggleItem: (list: string[], setter: (v: string[]) => void, value: string) => void;
    setSelectedOffers: (v: string[]) => void;
    variant?: "light" | "dark";
}

export default function OfferFilter({
    selectedOffers,
    toggleItem,
    setSelectedOffers,
    variant = "light",
}: OfferFilterProps) {
    const isDark = variant === "dark";

    return (
        <div>
            <h3 className={cn("mb-4 text-sm font-bold", isDark ? "text-white" : "text-card-foreground")}>
                Discount Filter
            </h3>
            <div className="space-y-3">
                {DISCOUNT_OPTIONS.map((option) => {
                    const checkboxId = `offer-${variant}-${option.value}`;
                    return (
                        <label
                            key={option.value}
                            htmlFor={checkboxId}
                            className={cn(
                                "flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 transition-colors",
                        isDark
                            ? "border-white/40 bg-white/15 hover:border-white/70"
                            : "border-border bg-muted/60 hover:border-primary/40",
                            )}
                        >
                            <Checkbox
                                id={checkboxId}
                                checked={selectedOffers.includes(option.value)}
                                onCheckedChange={() =>
                                    toggleItem(selectedOffers, setSelectedOffers, option.value)
                                }
                                className={cn(
                                    "data-[state=checked]:bg-primary data-[state=checked]:text-white",
                                    isDark ? "border-white/50" : "border-primary",
                                )}
                            />
                            <span className={cn("text-sm font-medium", isDark ? "text-white" : "text-card-foreground")}>
                                {option.label}
                            </span>
                        </label>
                    );
                })}
            </div>
        </div>
    );
}
