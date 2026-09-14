"use client";

import { useEffect, useState } from "react";
import DashboardCard from "../../../../shared/DashboardCard";
import ProfileHeader from "./ProfileHeader";
import PersonalInfoView, { type PersonalInfoUser } from "./PersonalInfoView";
import PersonalInfoForm, { type PersonalInfoSavePayload } from "./PersonalInfoForm";
import getProfile from "../../../../../helpers/getProfile";
import { myFetch } from "../../../../../helpers/myFetch";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

const defaultUserData: PersonalInfoUser = {
  username: "",
  email: "",
  phone: "",
  country: "",
  profileImage: "/user.svg",
};

export default function PersonalInfoPage() {
  const t = useTranslations("Profile.personal");
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(defaultUserData);

  useEffect(() => {
    getProfile().then((data) => {
      if (data) {
        setUserData({
          username: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          country: data.address || "",
          profileImage: data.profileImage || "/user.svg",
        });
      }
    }).catch(console.error);
  }, []);

  const handleSave = async (data: PersonalInfoSavePayload) => {
    const formData = new FormData();
    formData.append("name", data.username);
    formData.append("address", data.country);
    formData.append("phone", data.phone);
    if (data.profileImageFile) {
      formData.append("profileImage", data.profileImageFile);
    }

    try {
      const res = await myFetch("/users/profile", {
        method: "PATCH",
        body: formData,
      });

      if (res?.success) {
        toast.success(res?.message || t("updateSuccess"));
        
        getProfile().then((fetchedData) => {
          if (fetchedData) {
            setUserData({
              username: fetchedData.name || "",
              email: fetchedData.email || "",
              phone: fetchedData.phone || "",
              country: fetchedData.address || "",
              profileImage: fetchedData.profileImage || "/user.svg",
            });
            // Force a page reload to update the sidebar and navbar
            window.location.reload();
          }
        });
        
        setIsEditing(false);
      } else {
        toast.error(res?.message || t("updateError"));
      }
    } catch (error) {
      console.error(error);
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
