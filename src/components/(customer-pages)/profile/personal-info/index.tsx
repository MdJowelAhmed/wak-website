"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import DashboardCard from "../../../../shared/DashboardCard";
import ProfileHeader from "./ProfileHeader";
import PersonalInfoView, { type PersonalInfoUser } from "./PersonalInfoView";
import PersonalInfoForm, { type PersonalInfoSavePayload } from "./PersonalInfoForm";
import { MAX_UPLOAD_FILE_MB, isUploadWithinLimit } from "../../../../../helpers/upload-limits";
import { invokeMyFetch, MY_FETCH_UPLOAD_TOO_LARGE } from "@/lib/invoke-my-fetch";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export default function PersonalInfoPage({ userData }: { userData: PersonalInfoUser }) {
  const t = useTranslations("Profile.personal");
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = async (data: PersonalInfoSavePayload) => {
    const formData = new FormData();
    formData.append("name", data.username);
    formData.append("address", data.country);
    formData.append("phone", data.phone);
    if (data.profileImageFile) {
      if (!isUploadWithinLimit(data.profileImageFile)) {
        toast.error(t("uploadTooLarge", { maxMb: MAX_UPLOAD_FILE_MB }));
        return;
      }
      formData.append("profileImage", data.profileImageFile);
    }

    try {
      const res = await invokeMyFetch("/users/profile", {
        method: "PATCH",
        body: formData,
      });

      if (!res?.success) {
        if (res.message === MY_FETCH_UPLOAD_TOO_LARGE) {
          toast.error(t("uploadTooLarge", { maxMb: MAX_UPLOAD_FILE_MB }));
        } else {
          toast.error(res?.message || t("updateError"));
        }
        return;
      }

      toast.success(res?.message || t("updateSuccess"));
      setIsEditing(false);
      await refreshUser();
      router.refresh();
    } catch {
      toast.error(t("saveError"));
    }
  };

  return (
    <DashboardCard className="border-white/10 bg-secondary">
      <ProfileHeader
        title={isEditing ? t("editTitle") : t("title")}
        isEditing={isEditing}
        onToggleEdit={() => setIsEditing(true)}
      />

      {isEditing ? (
        <PersonalInfoForm
          userData={userData}
          onSave={handleSave}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <PersonalInfoView userData={userData} />
      )}
    </DashboardCard>
  );
}
