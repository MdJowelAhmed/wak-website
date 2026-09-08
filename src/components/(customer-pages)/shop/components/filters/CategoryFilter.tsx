"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/ui/select";
import { cn } from "@/lib/utils";

interface Category {
    _id: string;
    name: string;
    slug?: string;
}

interface CategoryFilterProps {
    categoriesList: Category[];
    selectedCategories: string[];
    setSelectedCategories: (val: string[]) => void;
    variant?: "light" | "dark";
}

export default function CategoryFilter({
    categoriesList,
    selectedCategories,
    setSelectedCategories,
    variant = "light",
}: CategoryFilterProps) {
    const selectedValue = selectedCategories[0] || "all";
    const isDark = variant === "dark";

    return (
        <div>
            <h3 className={cn("mb-4 text-sm font-bold", isDark ? "text-white" : "text-card-foreground")}>
                Category
            </h3>
            <Select
                value={selectedValue}
                onValueChange={(val) => setSelectedCategories(val && val !== "all" ? [val] : [])}
            >
                <SelectTrigger
                    aria-label="Filter products by category"
                    className={cn(
                        "h-11 rounded-xl shadow-none focus:ring-primary",
                        isDark
                            ? "border-white/30 bg-white/15 text-white [&>svg]:text-white"
                            : "border-border bg-muted text-card-foreground",
                    )}
                >
                    <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent className="z-[80] rounded-xl border-border bg-card text-card-foreground">
                    <SelectItem
                        value="all"
                        className="cursor-pointer focus:bg-primary focus:text-white"
                    >
                        All Categories
                    </SelectItem>
                    {categoriesList.map((cat) => {
                        const value = cat.slug || cat._id || cat.name;
                        return (
                            <SelectItem
                                key={cat._id}
                                value={value}
                                className="cursor-pointer focus:bg-primary focus:text-white"
                            >
                                {cat.name}
                            </SelectItem>
                        );
                    })}
                </SelectContent>
            </Select>
        </div>
    );
}
