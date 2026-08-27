"use client";

const offers = ["Regular", "Price drop"];

interface OfferFilterProps {
    selectedOffers: string[];
    toggleItem: (list: string[], setter: (v: string[]) => void, value: string) => void;
    setSelectedOffers: (v: string[]) => void;
}

export default function OfferFilter({ selectedOffers, toggleItem, setSelectedOffers }: OfferFilterProps) {
    return (
        <div>
            <h3 className="text-gray-900 font-medium text-sm mb-4">Offers & Discounts</h3>
            <div className="space-y-3">
                {offers.map((offer) => (
                    <label key={offer} className="flex items-center gap-3 cursor-pointer group">
                        <input
                            type="checkbox"
                            checked={selectedOffers.includes(offer)}
                            onChange={() => toggleItem(selectedOffers, setSelectedOffers, offer)}
                            className="w-4 h-4 rounded border-white/20 accent-[#FF6700] cursor-pointer"
                        />
                        <span className="text-gray-700 text-sm group-hover:text-gray-900 transition-colors">
                            {offer}
                        </span>
                    </label>
                ))}
            </div>
        </div>
    );
}
