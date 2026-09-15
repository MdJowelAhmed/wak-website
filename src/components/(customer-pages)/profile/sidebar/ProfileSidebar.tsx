import { getTranslations } from "next-intl/server";
import { serviceSidebar } from "../config/sidebar-config";
import SidebarNav from "./SidebarNav";
import getProfile from "../../../../../helpers/getProfile";

export default async function ProfileSidebar() {
  const t = await getTranslations("Profile.sidebar");
  const profile = await getProfile();

  const imageUrl = profile?.profileImage || "/user.svg";
  const name = profile?.name || t("guest");
  const email = profile?.email || "";

  return (
    <aside className="bg-white border border-zinc-200/50 shadow-md rounded-2xl overflow-hidden flex flex-col h-fit lg:sticky lg:top-6">
      <div className="flex flex-col items-center gap-2 pt-8 pb-6 px-6 border-b border-zinc-100">
        <div className="h-20 w-20 overflow-hidden rounded-full border-2 border-primary ring-2 ring-primary/30">
          <img
            src={imageUrl}
            alt={t("profileAlt")}
            className="h-full w-full object-cover"
          />
        </div>
        <h3 className="text-zinc-900 font-bold text-lg mt-1">
          {name}
        </h3>
        {email ? <p className="text-zinc-500 text-sm">{email}</p> : null}
      </div>

      <div className="flex flex-col flex-1 p-4 min-h-[340px]">
        <SidebarNav items={serviceSidebar} />
      </div>
    </aside>
  );
}
