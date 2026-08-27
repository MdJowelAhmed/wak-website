interface PersonalInfoViewProps {
  userData: {
    username: string;
    email: string;
    phone: string;
    country: string;
    profileImage?: string;
  };
}

export default function PersonalInfoView({ userData }: PersonalInfoViewProps) {
  return (
    <div>
      <div className="mb-8 flex justify-center">
        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-zinc-200 ring-2 ring-zinc-100">
          <img src={userData.profileImage || "/user.svg"} className="w-full h-full object-fit" alt="Profile" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Name */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-zinc-500">User Name</label>
          <div className="h-12 px-4 flex items-center bg-zinc-50 mt-2 rounded-xl text-sm text-zinc-850 border border-zinc-200">
            {userData.username}
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-zinc-500">Email</label>
          <div className="h-12 px-4 flex items-center bg-zinc-50 mt-2 rounded-xl text-sm text-zinc-850 border border-zinc-200">
            {userData.email}
          </div>
        </div>

        {/* Contact Number */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-zinc-500">
            Contact Number
          </label>
          <div className="h-12 px-4 flex items-center bg-zinc-50 mt-2 rounded-xl text-sm text-zinc-850 border border-zinc-200">
            {userData.phone}
          </div>
        </div>

        {/* Country */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-zinc-500">
            Choose country
          </label>
          <div className="h-12 px-4 flex items-center bg-zinc-50 mt-2 rounded-xl text-sm text-zinc-400 border border-zinc-200">
            {userData.country || "Select country name"}
          </div>
        </div>
      </div>
    </div>
  );
}
