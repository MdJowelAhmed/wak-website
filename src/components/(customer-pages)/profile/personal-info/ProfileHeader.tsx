"use client";

import { Pencil } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/ui/button";

interface ProfileHeaderProps {
  title: string;
  isEditing: boolean;
  onToggleEdit: () => void;
}

export default function ProfileHeader({
  title,
  isEditing,
  onToggleEdit,
}: ProfileHeaderProps) {
  const t = useTranslations("Profile.personal");

  return (
    <div className="mb-8 flex items-center justify-between gap-4">
      <h1 className="text-xl font-bold tracking-tight text-white md:text-2xl">
        {title}
      </h1>

      {!isEditing && (
        <Button
          type="button"
          onClick={onToggleEdit}
          className="rounded-xl shadow-md shadow-primary/20"
        >
          <Pencil className="h-4 w-4" />
          {t("edit")}
        </Button>
      )}
    </div>
  );
}
