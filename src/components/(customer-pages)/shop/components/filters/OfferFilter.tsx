"use client";

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
            <h3 className="text-gray-900 font-medium text-sm mb-4">Discount Filter</h3>
            <div className="space-y-3">
                {DISCOUNT_OPTIONS.map((option) => (
                    <label key={option.value} className="flex items-center gap-3 cursor-pointer group">
                        <input
                            type="checkbox"
                            checked={selectedOffers.includes(option.value)}
                            onChange={() => toggleItem(selectedOffers, setSelectedOffers, option.value)}
                            className="w-4 h-4 rounded border-white/20 accent-[#FF6700] cursor-pointer"
                        />
                        <span className="text-gray-700 text-sm group-hover:text-gray-900 transition-colors">
                            {option.label}
                        </span>
                    </label>
                ))}
            </div>
        </div>
    );
}
