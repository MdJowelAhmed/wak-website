"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingFilterProps {
    selectedRating: number | null;
    setSelectedRating: (val: number | null) => void;
    variant?: "light" | "dark";
}

export default function RatingFilter({
    selectedRating,
    setSelectedRating,
    variant = "light",
}: RatingFilterProps) {
    const [hoveredRating, setHoveredRating] = useState<number | null>(null);
    const activeRating = hoveredRating || selectedRating || 0;
    const isDark = variant === "dark";

    return (
        <div>
            <h3 className={cn("mb-4 text-sm font-bold", isDark ? "text-white" : "text-card-foreground")}>
                Ratings
            </h3>
            <div className="flex items-center gap-3">
                <div
                    className="flex items-center gap-1"
                    onMouseLeave={() => setHoveredRating(null)}
                >
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            aria-label={`${star} star${star > 1 ? "s" : ""} and up`}
                            aria-pressed={selectedRating === star}
                            onClick={() => setSelectedRating(selectedRating === star ? null : star)}
                            onMouseEnter={() => setHoveredRating(star)}
                            className="rounded-md p-0.5 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        >
                            <Star
                                className={cn(
                                    "h-5 w-5",
                                    star <= activeRating
                                        ? "fill-primary text-primary"
                                        : isDark
                                            ? "fill-transparent text-white/30"
                                            : "fill-transparent text-border",
                                )}
                            />
                        </button>
                    ))}
                </div>
                <span
                    className={cn(
                        "text-sm font-medium",
                        selectedRating
                            ? isDark ? "text-white" : "text-card-foreground"
                            : isDark ? "text-white/50" : "text-muted-foreground",
                    )}
                >
                    {selectedRating ? "& Up" : "Any"}
                </span>
            </div>
        </div>
    );
}
