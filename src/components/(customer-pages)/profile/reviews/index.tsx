"use client";

import { useState } from "react";
import DashboardCard from "../../../../shared/DashboardCard";
import StarRating from "./StarRating";
import ReviewForm from "./ReviewForm";

export default function ReviewsPage() {
  const [rating, setRating] = useState(0);

  const handleSubmit = (data: { name: string; description: string }) => {
    // Handle review submission
    console.log("Review submitted:", { ...data, rating });
  };

  const handleCancel = () => {
    setRating(0);
  };

  return (
    <DashboardCard>
      {/* Page Title */}
      <h1 className="text-xl md:text-2xl font-bold text-zinc-900 mb-8">
        Review & Feedback
      </h1>

      {/* Star Rating */}
      <div className="flex justify-center mb-8">
        <StarRating rating={rating} onRate={setRating} size={32} />
      </div>

      {/* Review Form */}
      <ReviewForm onSubmit={handleSubmit} onCancel={handleCancel} />
    </DashboardCard>
  );
}
