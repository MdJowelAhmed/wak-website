"use client";

import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { RefreshCw } from "lucide-react";
import PriceFilter from "./filters/PriceFilter";
import CategoryFilter from "./filters/CategoryFilter";
import RatingFilter from "./filters/RatingFilter";
import OfferFilter from "./filters/OfferFilter";

export interface FilterState {
    priceMin: number;
    priceMax: number;
    categories: string[];
    rating: number | null;
    offers: string[];
}

export interface Category {
    _id: string;
    name: string;
}

interface ShopFilterProps {
    categoriesList?: Category[];
    searchParams?: { [key: string]: string | string[] | undefined };
}

export default function ShopFilter({ categoriesList = [], searchParams }: ShopFilterProps) {
    const router = useRouter();
    const pathname = usePathname();
    const currentSearchParams = useSearchParams();

    const initialMinPrice = Number(searchParams?.minPrice ?? currentSearchParams.get("minPrice") ?? 0);
    const initialMaxPrice = Number(searchParams?.maxPrice ?? currentSearchParams.get("maxPrice") ?? 1000);
    const initialCategory = (searchParams?.category ?? currentSearchParams.get("category")) as string;
    const initialRating = searchParams?.minRating ? Number(searchParams.minRating) : (currentSearchParams.get("minRating") ? Number(currentSearchParams.get("minRating")) : null);
    const initialDiscount = searchParams?.discount ?? currentSearchParams.get("discount");
    const initialOffers: string[] = [];
    if (initialDiscount === "true") initialOffers.push("discounted");
    if (initialDiscount === "false") initialOffers.push("regular");

    const [priceMin, setPriceMin] = useState(initialMinPrice);
    const [priceMax, setPriceMax] = useState(initialMaxPrice);
    const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategory ? [initialCategory] : []);
    const [selectedRating, setSelectedRating] = useState<number | null>(initialRating);
    const [selectedOffers, setSelectedOffers] = useState<string[]>(initialOffers);

    const toggleItem = (
        list: string[],
        setter: (v: string[]) => void,
        value: string
    ) => {
        setter(list.includes(value) ? list.filter((i) => i !== value) : [...list, value]);
    };

    const handleApply = () => {
        const params = new URLSearchParams();
        if (priceMin > 0) params.set("minPrice", priceMin.toString());
        if (priceMax < 1000) params.set("maxPrice", priceMax.toString());
        if (selectedCategories.length > 0) params.set("category", selectedCategories[0]);
        if (selectedRating !== null) params.set("minRating", selectedRating.toString());
        
        if (selectedOffers.includes("discounted") && !selectedOffers.includes("regular")) {
            params.set("discount", "true");
        } else if (selectedOffers.includes("regular") && !selectedOffers.includes("discounted")) {
            params.set("discount", "false");
        }

        params.set("page", "1");

        const queryStr = params.toString();
        router.push(queryStr ? `${pathname}?${queryStr}` : pathname);
    };

    const handleReset = () => {
        setPriceMin(0);
        setPriceMax(1000);
        setSelectedCategories([]);
        setSelectedRating(null);
        setSelectedOffers([]);

        router.push(pathname);
    };

    return (
        <aside className="bg-white rounded-2xl p-6 border border-white/5 space-y-7 sticky top-0 self-start">
            <PriceFilter 
                priceMin={priceMin} 
                priceMax={priceMax} 
                setPriceMin={setPriceMin} 
                setPriceMax={setPriceMax} 
            />

            <div className="border-t border-white/5" />

            <CategoryFilter 
                categoriesList={categoriesList} 
                selectedCategories={selectedCategories} 
                setSelectedCategories={setSelectedCategories} 
            />

            <div className="border-t border-white/5" />

            <RatingFilter 
                selectedRating={selectedRating} 
                setSelectedRating={setSelectedRating} 
            />

            <div className="border-t border-white/5" />

            <OfferFilter 
                selectedOffers={selectedOffers} 
                setSelectedOffers={setSelectedOffers} 
                toggleItem={toggleItem} 
            />

            {/* Action Buttons */}
            <div className="flex items-center gap-3 mt-2">
                <button
                    onClick={handleReset}
                    className="p-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 rounded-xl transition-all active:scale-95 cursor-pointer shrink-0"
                    title="Reset Filters"
                >
                    <RefreshCw className="w-5 h-5" />
                </button>
                <button
                    onClick={handleApply}
                    className="w-full bg-[#FF6700] hover:bg-orange-600 text-white font-medium py-3 rounded-xl text-sm transition-all active:scale-95 cursor-pointer shadow-lg shadow-orange-950/20"
                >
                    Apply
                </button>
            </div>
        </aside>
    );
}

