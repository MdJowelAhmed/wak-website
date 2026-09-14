"use client";

import { X, Loader2 } from "lucide-react";
import ReviewForm from "../reviews/ReviewForm";
import StarRating from "../reviews/StarRating";
import { useState } from "react";
import { Order } from "./OrdersTable";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { myFetch } from "../../../../../helpers/myFetch";

interface ReviewModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  type?: "product" | "service";
}

export default function ReviewModal({ order, isOpen, onClose, type = "product" }: ReviewModalProps) {
  const t = useTranslations("Orders");
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !order) return null;

  const handleSubmit = async (data: { name: string; description: string }) => {
    if (rating === 0) {
      toast.error(t("needRating"));
      return;
    }

    if (!order.dbId || !order.itemId) {
      toast.error(t("incompleteOrder"));
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: {
        reviewType: "product" | "service";
        order: string;
        rating: number;
        text: string;
        product?: string;
        service?: string;
      } = {
        reviewType: type,
        order: order.dbId,
        rating,
        text: data.description,
      };

      if (type === "product") {
        payload.product = order.itemId;
      } else {
        payload.service = order.itemId;
      }

      const res = await myFetch('/reviews/', {
        method: 'POST',
        body: payload
      });

      if (res?.success) {
        toast.success(res.message || t("reviewSuccess"));
        onClose();
        setRating(0); // Reset for next time
      } else {
        toast.error(res?.message || t("reviewError"));
      }
    } catch {
      toast.error(t("reviewUnexpected"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-100">
          <div>
            <h2 className="text-xl font-bold text-zinc-900">{t("writeReview")}</h2>
            <p className="text-sm text-zinc-500 mt-1">{t("reviewFor", { id: order.id, title: order.title })}</p>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            aria-label={t("close")}
            className="p-2 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-full transition-colors disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 relative">
          {isSubmitting && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-b-2xl">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          )}
          <div className="mb-6 space-y-2">
             <label className="text-sm font-semibold text-zinc-700">{t("rating")}</label>
             <StarRating rating={rating} onRate={setRating} />
          </div>
          
          <ReviewForm onSubmit={handleSubmit} onCancel={onClose} />
        </div>
      </div>
    </div>
  );
}
