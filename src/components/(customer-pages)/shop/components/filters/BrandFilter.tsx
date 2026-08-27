"use client";

const brands = ["E-commerce", "E-shop", "Shop Name your togine"];

interface BrandFilterProps {
    selectedBrands: string[];
    toggleItem: (list: string[], setter: (v: string[]) => void, value: string) => void;
    setSelectedBrands: (v: string[]) => void;
}

export default function BrandFilter({ selectedBrands, toggleItem, setSelectedBrands }: BrandFilterProps) {
    return (
        <div>
            <h3 className="text-gray-900 font-medium text-sm mb-4">Brands</h3>
            <div className="space-y-3">
                {brands.map((brand) => (
                    <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                        <input
                            type="checkbox"
                            checked={selectedBrands.includes(brand)}
                            onChange={() => toggleItem(selectedBrands, setSelectedBrands, brand)}
                            className="w-4 h-4 rounded border-white/20 accent-[#FF6700] cursor-pointer"
                        />
                        <span className="text-gray-700 text-sm group-hover:text-gray-900 transition-colors">
                            {brand}
                        </span>
                    </label>
                ))}
            </div>
        </div>
    );
}
