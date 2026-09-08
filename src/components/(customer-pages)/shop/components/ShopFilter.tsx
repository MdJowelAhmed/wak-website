"use client";

import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { RefreshCw, SlidersHorizontal, X } from "lucide-react";
import PriceFilter from "./filters/PriceFilter";
import CategoryFilter from "./filters/CategoryFilter";
import RatingFilter from "./filters/RatingFilter";
import OfferFilter from "./filters/OfferFilter";
import { Button } from "@/ui/button";
import {
    Dialog,
    DialogClose,
    DialogDescription,
    DialogHeader,
    DialogOverlay,
    DialogPortal,
    DialogTitle,
} from "@/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";

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
    slug?: string;
}

interface ShopFilterProps {
    categoriesList?: Category[];
    searchParams?: { [key: string]: string | string[] | undefined };
    children: React.ReactNode;
}

export default function ShopFilter({
    categoriesList = [],
    searchParams,
    children,
}: ShopFilterProps) {
    const router = useRouter();
    const pathname = usePathname();
    const currentSearchParams = useSearchParams();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const initialMinPrice = Number(searchParams?.minPrice ?? currentSearchParams.get("minPrice") ?? 0);
    const initialMaxPrice = Number(searchParams?.maxPrice ?? currentSearchParams.get("maxPrice") ?? 1000);
    const initialCategory = (searchParams?.category ?? currentSearchParams.get("category")) as string;
    const initialRating = searchParams?.minRating
        ? Number(searchParams.minRating)
        : currentSearchParams.get("minRating")
            ? Number(currentSearchParams.get("minRating"))
            : null;
    const initialDiscount = searchParams?.discount ?? currentSearchParams.get("discount");
    const initialOffers: string[] = [];
    if (initialDiscount === "true") initialOffers.push("discounted");
    if (initialDiscount === "false") initialOffers.push("regular");

    const [priceMin, setPriceMin] = useState(initialMinPrice);
    const [priceMax, setPriceMax] = useState(initialMaxPrice);
    const [selectedRating, setSelectedRating] = useState<number | null>(initialRating);
    const [selectedOffers, setSelectedOffers] = useState<string[]>(initialOffers);

    const selectedCategories = initialCategory ? [initialCategory] : [];

    const activeFilterCount = [
        selectedCategories.length > 0,
        priceMin > 0 || priceMax < 1000,
        selectedRating !== null,
        selectedOffers.length > 0,
    ].filter(Boolean).length;

    const handleCategoryChange = (nextCategories: string[]) => {
        const params = new URLSearchParams(currentSearchParams.toString());
        const categoryParam = nextCategories[0];

        if (categoryParam) {
            params.set("category", categoryParam);
        } else {
            params.delete("category");
        }
        params.set("page", "1");

        const queryStr = params.toString();
        router.push(queryStr ? `${pathname}?${queryStr}` : pathname);
    };

    const toggleItem = (
        list: string[],
        setter: (v: string[]) => void,
        value: string,
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
        setIsDrawerOpen(false);
    };

    const handleReset = () => {
        setPriceMin(0);
        setPriceMax(1000);
        setSelectedRating(null);
        setSelectedOffers([]);
        setIsDrawerOpen(false);
        router.push(pathname);
    };

    const filterFields = (
        <div className="space-y-6">
            <PriceFilter
                priceMin={priceMin}
                priceMax={priceMax}
                setPriceMin={setPriceMin}
                setPriceMax={setPriceMax}
            />

            <div className="border-t border-border" />

            <CategoryFilter
                categoriesList={categoriesList}
                selectedCategories={selectedCategories}
                setSelectedCategories={handleCategoryChange}
            />

            <div className="border-t border-border" />

            <RatingFilter
                selectedRating={selectedRating}
                setSelectedRating={setSelectedRating}
            />

            <div className="border-t border-border" />

            <OfferFilter
                selectedOffers={selectedOffers}
                setSelectedOffers={setSelectedOffers}
                toggleItem={toggleItem}
            />
        </div>
    );

    const actionButtons = (
        <div className="flex items-center gap-3">
            <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleReset}
                title="Reset filters"
                aria-label="Reset filters"
                className="shrink-0 border-border text-card-foreground hover:bg-muted"
            >
                <RefreshCw className="h-4 w-4" />
            </Button>
            <Button type="button" onClick={handleApply} className="w-full rounded-xl">
                Apply
            </Button>
        </div>
    );

    return (
        <>
            <div className="mb-4 flex items-center justify-between lg:hidden">
                <h1 className="text-lg font-bold text-white">Products</h1>
                <button
                    type="button"
                    onClick={() => setIsDrawerOpen(true)}
                    aria-expanded={isDrawerOpen}
                    aria-controls="shop-filter-drawer"
                    className="inline-flex items-center gap-2 rounded-xl bg-secondary px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-dark-brown focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                    <SlidersHorizontal className="h-4 w-4" aria-hidden />
                    Filters
                    {activeFilterCount > 0 && (
                        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-bold">
                            {activeFilterCount}
                        </span>
                    )}
                </button>
            </div>

            <div className="grid grid-cols-12 gap-6 lg:gap-10">
                <div className="hidden lg:col-span-3 lg:block">
                    <aside className="sticky top-24 self-start rounded-2xl border border-card-border bg-card p-5 shadow-md">
                        <div className="mb-5 flex items-center gap-2">
                            <SlidersHorizontal className="h-4 w-4 text-primary" aria-hidden />
                            <h2 className="text-base font-bold text-card-foreground">Filters</h2>
                            {activeFilterCount > 0 && (
                                <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-bold text-white">
                                    {activeFilterCount}
                                </span>
                            )}
                        </div>
                        {filterFields}
                        <div className="mt-6">{actionButtons}</div>
                    </aside>
                </div>

                <div className="col-span-12 lg:col-span-9 rounded-2xl bg-white/5 p-3">
                    {children}
                </div>
            </div>

            <Dialog open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                <DialogPortal>
                    <DialogOverlay className="shop-filter-overlay bg-black/50 lg:hidden" />
                    <DialogPrimitive.Content
                        id="shop-filter-drawer"
                        className={cn(
                            "shop-filter-drawer fixed inset-y-0 right-0 z-50 flex h-dvh w-[70%] flex-col rounded-l-2xl bg-card shadow-2xl will-change-transform",
                            "focus:outline-none lg:hidden",
                        )}
                    >
                        <DialogClose className="absolute right-4 top-4 rounded-lg p-1.5 text-card-foreground/70 transition-colors hover:bg-muted hover:text-card-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                            <X className="h-4 w-4" />
                            <span className="sr-only">Close filters</span>
                        </DialogClose>

                        <DialogHeader className="border-b border-border px-5 py-4 pr-12 text-left">
                            <DialogTitle className="text-lg font-bold text-card-foreground">
                                Filters
                            </DialogTitle>
                            <DialogDescription className="sr-only">
                                Filter products by price, category, rating, and discount.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="flex-1 overflow-y-auto px-5 py-5">{filterFields}</div>

                        <div className="border-t border-border bg-card px-5 py-4">
                            {actionButtons}
                        </div>
                    </DialogPrimitive.Content>
                </DialogPortal>
            </Dialog>
        </>
    );
}
