"use client";

import { useState, useEffect } from "react";
import { myFetch } from "../../../../../helpers/myFetch";
import { RefreshCw } from "lucide-react";
import PriceFilter from "./filters/PriceFilter";
import CategoryFilter from "./filters/CategoryFilter";
import RatingFilter from "./filters/RatingFilter";
import BrandFilter from "./filters/BrandFilter";
import OfferFilter from "./filters/OfferFilter";

export interface FilterState {
    priceMin: number;
    priceMax: number;
    categories: string[];
    rating: number | null;
    brands: string[];
    offers: string[];
}

interface ShopFilterProps {
    initialFilters?: FilterState;
    onApply?: (filters: FilterState) => void;
}

interface Category {
    _id: string;
    name: string;
}

export default function ShopFilter({ initialFilters, onApply }: ShopFilterProps) {
    const [priceMin, setPriceMin] = useState(initialFilters?.priceMin ?? 0);
    const [priceMax, setPriceMax] = useState(initialFilters?.priceMax ?? 1000);
    const [selectedCategories, setSelectedCategories] = useState<string[]>(initialFilters?.categories ?? []);
    const [selectedRating, setSelectedRating] = useState<number | null>(initialFilters?.rating ?? null);
    const [selectedBrands, setSelectedBrands] = useState<string[]>(initialFilters?.brands ?? []);
    const [selectedOffers, setSelectedOffers] = useState<string[]>(initialFilters?.offers ?? []);

    const [categoriesList, setCategoriesList] = useState<Category[]>([]);
    
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                // Fetch all active categories
                const res = await myFetch("/categories/active");
                if (res?.data) {
                    setCategoriesList(res.data);
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, []);

    const toggleItem = (
        list: string[],
        setter: (v: string[]) => void,
        value: string
    ) => {
        setter(list.includes(value) ? list.filter((i) => i !== value) : [...list, value]);
    };

    const handleApply = () => {
        onApply?.({
            priceMin,
            priceMax,
            categories: selectedCategories,
            rating: selectedRating,
            brands: selectedBrands,
            offers: selectedOffers,
        });
    };

    const handleReset = () => {
        setPriceMin(0);
        setPriceMax(1000);
        setSelectedCategories([]);
        setSelectedRating(null);
        setSelectedBrands([]);
        setSelectedOffers([]);

        onApply?.({
            priceMin: 0,
            priceMax: 1000,
            categories: [],
            rating: null,
            brands: [],
            offers: []
        });
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

            <BrandFilter 
                selectedBrands={selectedBrands} 
                setSelectedBrands={setSelectedBrands} 
                toggleItem={toggleItem} 
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
