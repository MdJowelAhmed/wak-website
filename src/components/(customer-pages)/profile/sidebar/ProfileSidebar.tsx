import {
  serviceSidebar,
} from "../config/sidebar-config";
import SidebarNav from "./SidebarNav";
import getProfile from "../../../../../helpers/getProfile";

export default async function ProfileSidebar() {

  let profile = null;
  try {
    profile = await getProfile();
  } catch (error) {
    console.error(error);
  }

  const imageUrl = profile?.profileImage || "/user.svg";
  const name = profile?.name || "Ziad Aboultaif";
  const email = profile?.email || "ziad@gmail.com";

  return (
    <aside className="bg-white border border-zinc-200/50 shadow-md rounded-2xl overflow-hidden flex flex-col h-fit lg:sticky lg:top-6">
      {/* Profile Header */}
      <div className="flex flex-col items-center gap-2 pt-8 pb-6 px-6 border-b border-zinc-100">
        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-zinc-200 ring-2 ring-zinc-100">
          <img
            src={imageUrl}
            alt="Profile"
            className="w-full h-full object-fit"
          />
        </div>
        <h3 className="text-zinc-900 font-bold text-lg mt-1">
          {name}
        </h3>
        <p className="text-zinc-500 text-sm">{email}</p>
      </div>

      {/* Navigation + Logout */}
      <div className="flex flex-col flex-1 p-4 min-h-[340px]">
        <SidebarNav items={serviceSidebar} />
      </div>
    </aside>
  );
}
