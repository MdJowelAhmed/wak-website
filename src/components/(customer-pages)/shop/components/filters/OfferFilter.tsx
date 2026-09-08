"use client";

import { Checkbox } from "@/ui/checkbox";

const DISCOUNT_OPTIONS = [
    { label: "Regular Products", value: "regular" },
    { label: "Discounted Products", value: "discounted" },
];

interface OfferFilterProps {
    selectedOffers: string[];
    toggleItem: (list: string[], setter: (v: string[]) => void, value: string) => void;
    setSelectedOffers: (v: string[]) => void;
}

export default function OfferFilter({ selectedOffers, toggleItem, setSelectedOffers }: OfferFilterProps) {
    return (
        <div>
            <h3 className="mb-4 text-sm font-bold text-card-foreground">Discount Filter</h3>
            <div className="space-y-3">
                {DISCOUNT_OPTIONS.map((option) => {
                    const checkboxId = `offer-${option.value}`;
                    return (
                        <label
                            key={option.value}
                            htmlFor={checkboxId}
                            className="flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-muted/60 px-3 py-2.5 transition-colors hover:border-primary/40"
                        >
                            <Checkbox
                                id={checkboxId}
                                checked={selectedOffers.includes(option.value)}
                                onCheckedChange={() =>
                                    toggleItem(selectedOffers, setSelectedOffers, option.value)
                                }
                                className="border-primary data-[state=checked]:bg-primary"
                            />
                            <span className="text-sm font-medium text-card-foreground">
                                {option.label}
                            </span>
                        </label>
                    );
                })}
            </div>
        </div>
    );
}
