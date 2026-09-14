"use client";

import { Input } from "@/ui/input";
import { Textarea } from "@/ui/textarea";
import { useTranslations } from "next-intl";

interface ReviewFormProps {
  onSubmit: (data: { name: string; description: string }) => void;
  onCancel: () => void;
}

export default function ReviewForm({ onSubmit, onCancel }: ReviewFormProps) {
  const t = useTranslations("Profile.reviews");
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSubmit({
      name: formData.get("name") as string,
      description: formData.get("description") as string,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* User Name */}
      <div className="space-y-2">
        <label
          htmlFor="review-name"
          className="text-sm font-semibold text-zinc-700"
        >
          {t("userName")}
        </label>
        <Input
          id="review-name"
          name="name"
          placeholder={t("namePlaceholder")}
          className="h-12 bg-zinc-50 border border-zinc-200 text-zinc-900 mt-2 rounded-xl placeholder:text-zinc-400 focus:bg-white focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:border-primary"
        />
      </div>
 
      {/* Description */}
      <div className="space-y-2">
        <label
          htmlFor="review-description"
          className="text-sm font-semibold text-zinc-700"
        >
          {t("description")}
        </label>
        <Textarea
          id="review-description"
          name="description"
          placeholder={t("descriptionPlaceholder")}
          rows={5}
          className="bg-zinc-50 border border-zinc-200 text-zinc-900 mt-2 rounded-xl placeholder:text-zinc-400 focus:bg-white focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:border-primary resize-none"
        />
      </div>
 
      {/* Actions */}
      <div className="flex items-center justify-end gap-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-8 py-3 bg-red-50 hover:bg-red-100 text-red-650 text-sm font-semibold rounded-xl transition-colors cursor-pointer"
        >
          {t("cancel")}
        </button>
        <button
          type="submit"
          className="px-8 py-3 bg-primary hover:bg-orange-500 text-white text-sm font-bold rounded-xl transition-colors cursor-pointer shadow-md shadow-orange-500/10"
        >
          {t("save")}
        </button>
      </div>
    </form>
  );
}
