"use client";

import { useState } from "react";
import ShopFilter, { FilterState } from "./components/ShopFilter";
import ShopProductGrid from "./components/ShopProductGrid";

interface ShopProps {
    searchParams?: { [key: string]: string | string[] | undefined };
}

export default function Shop({ searchParams }: ShopProps) {
    const initialCategory = searchParams?.category as string;
    const initialBrand = searchParams?.brand as string;

    const [filters, setFilters] = useState<FilterState>({
        priceMin: 0,
        priceMax: 1000,
        categories: initialCategory ? [initialCategory] : [],
        rating: null,
        brands: initialBrand ? [initialBrand] : [],
        offers: [],
    });

    return (
        <div className="min-h-[calc(100vh-180px)] bg-[#4f2c1d] py-[50px]">
            <div className="container mx-auto px-4">

                {/* Layout: Sidebar + Grid */}
                <div className="grid grid-cols-12 gap-6 lg:gap-10">
                    {/* Filter Sidebar — fluid responsive width */}
                    <div className="col-span-12 lg:col-span-3 shrink-0">
                        <ShopFilter 
                            initialFilters={filters}
                            onApply={(newFilters) => setFilters(newFilters)} 
                        />
                    </div>

                    {/* Product Grid + Pagination */}
                    <div className="col-span-12 lg:col-span-9 bg-white/5 p-3 rounded-2xl">
                        <ShopProductGrid filters={filters} />
                    </div>
                </div>
            </div>
        </div>
    );
}
