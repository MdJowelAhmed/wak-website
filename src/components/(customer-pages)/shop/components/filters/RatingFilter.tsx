"use client";

import { useState } from "react";

interface RatingFilterProps {
    selectedRating: number | null;
    setSelectedRating: (val: number | null) => void;
}

export default function RatingFilter({ selectedRating, setSelectedRating }: RatingFilterProps) {
    const [hoveredRating, setHoveredRating] = useState<number | null>(null);

    return (
        <div>
            <h3 className="text-gray-900 font-medium text-sm mb-4">Ratings</h3>
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-1" onMouseLeave={() => setHoveredRating(null)}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            onClick={() => setSelectedRating(selectedRating === star ? null : star)}
                            onMouseEnter={() => setHoveredRating(star)}
                            className="focus:outline-none transition-transform hover:scale-110"
                        >
                            <svg
                                className={`w-6 h-6 transition-colors duration-200 ${star <= (hoveredRating || selectedRating || 0) ? "fill-[#FFC107] text-[#FFC107]" : "fill-transparent stroke-zinc-300 text-zinc-300 stroke-[1.5px]"}`}
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                        </button>
                    ))}
                </div>
                {selectedRating ? (
                    <span className="text-gray-900 text-sm font-medium">& Up</span>
                ) : (
                    <span className="text-gray-500 text-sm">Any</span>
                )}
            </div>
        </div>
    );
}
