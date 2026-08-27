"use client";

import { useState } from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  onRate: (rating: number) => void;
  size?: number;
}

export default function StarRating({
  rating,
  onRate,
  size = 28,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= (hoverRating || rating);
        return (
          <button
            key={star}
            type="button"
            onClick={() => onRate(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            className="cursor-pointer transition-transform hover:scale-110"
          >
            <Star
              size={size}
              className={`transition-colors duration-150 ${isFilled
                ? "fill-primary text-primary"
                : "fill-transparent text-[#FFC107]"
                }`}
            />
          </button>
        );
      })}
    </div>
  );
}
