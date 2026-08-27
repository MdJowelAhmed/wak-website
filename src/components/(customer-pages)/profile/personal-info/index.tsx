"use client";

import { useEffect, useState } from "react";
import DashboardCard from "../../../../shared/DashboardCard";
import ProfileHeader from "./ProfileHeader";
import PersonalInfoView from "./PersonalInfoView";
import PersonalInfoForm from "./PersonalInfoForm";
import getProfile from "../../../../../helpers/getProfile";
import { myFetch } from "../../../../../helpers/myFetch";
import { toast } from "sonner";

// Mock user data — replace with real API data later
const defaultUserData: any = {
  username: "",
  email: "",
  phone: "",
  country: "",
  profileImage: "/user.svg",
};

export default function PersonalInfoPage() {
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

  const handleSave = async (data: any) => {
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
        toast.success(res?.message || "Profile updated successfully");
        
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
        toast.error(res?.message || "Failed to update profile");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while saving.");
    }
  };

  return (
    <DashboardCard>
      <ProfileHeader
        title={isEditing ? "Edit Personal Information" : "Personal Information"}
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
