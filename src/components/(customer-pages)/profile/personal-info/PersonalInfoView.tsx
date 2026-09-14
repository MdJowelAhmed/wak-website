"use client";

import { resolveImageUrl } from "../../../../../helpers/resolveImageUrl";
import { useTranslations } from "next-intl";

export interface PersonalInfoUser {
  username: string;
  email: string;
  phone: string;
  country: string;
  profileImage?: string;
}

interface PersonalInfoViewProps {
  userData: PersonalInfoUser;
}

const fieldLabel = "text-sm font-semibold text-white/80";
const fieldValue =
  "mt-2 flex h-12 items-center rounded-xl border border-white/10 bg-white px-4 text-sm font-medium text-card-foreground";

export default function PersonalInfoView({ userData }: PersonalInfoViewProps) {
  const t = useTranslations("Profile.personal");
  const imageSrc = resolveImageUrl(userData.profileImage, "/user.svg") || "/user.svg";

  return (
    <div>
      <div className="mb-8 flex justify-center">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-primary/40 blur-xl" />
          <div className="relative h-28 w-28 overflow-hidden rounded-full border-4 border-primary shadow-lg shadow-primary/30">
            <img
              src={imageSrc}
              alt={t("photoAlt", { name: userData.username || t("userName") })}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <p className={fieldLabel}>{t("userName")}</p>
          <div className={fieldValue}>{userData.username || "—"}</div>
        </div>

        <div>
          <p className={fieldLabel}>{t("email")}</p>
          <div className={fieldValue}>{userData.email || "—"}</div>
        </div>

        <div>
          <p className={fieldLabel}>{t("phone")}</p>
          <div className={fieldValue}>{userData.phone || "—"}</div>
        </div>

        <div>
          <p className={fieldLabel}>{t("country")}</p>
          <div className={userData.country ? fieldValue : `${fieldValue} text-muted-foreground`}>
            {userData.country || t("notSelected")}
          </div>
        </div>
      </div>
    </div>
  );
}
