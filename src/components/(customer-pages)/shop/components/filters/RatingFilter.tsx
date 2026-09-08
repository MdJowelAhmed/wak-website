"use client";

import { useState } from "react";
import { Star } from "lucide-react";

interface RatingFilterProps {
    selectedRating: number | null;
    setSelectedRating: (val: number | null) => void;
}

export default function RatingFilter({ selectedRating, setSelectedRating }: RatingFilterProps) {
    const [hoveredRating, setHoveredRating] = useState<number | null>(null);
    const activeRating = hoveredRating || selectedRating || 0;

    return (
        <div>
            <h3 className="mb-4 text-sm font-bold text-card-foreground">Ratings</h3>
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
                                className={`h-5 w-5 ${
                                    star <= activeRating
                                        ? "fill-primary text-primary"
                                        : "fill-transparent text-border"
                                }`}
                            />
                        </button>
                    ))}
                </div>
                <span className={`text-sm font-medium ${selectedRating ? "text-card-foreground" : "text-muted-foreground"}`}>
                    {selectedRating ? "& Up" : "Any"}
                </span>
            </div>
        </div>
    );
}
