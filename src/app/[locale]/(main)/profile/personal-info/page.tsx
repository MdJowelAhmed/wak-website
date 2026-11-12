import PersonalInfoPage from "@/components/(customer-pages)/profile/personal-info";
import type { PersonalInfoUser } from "@/components/(customer-pages)/profile/personal-info/PersonalInfoView";
import getProfile from "../../../../../../helpers/getProfile";

export default async function PersonalInfoRoute() {
  const profile = await getProfile();

  const userData: PersonalInfoUser = {
    username: profile?.name || "",
    email: profile?.email || "",
    phone: profile?.phone || "",
    country: profile?.address || "",
    profileImage: profile?.profileImage || undefined,
  };

  return <PersonalInfoPage userData={userData} />;
}
