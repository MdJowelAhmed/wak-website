import { resolveImageUrl } from "../../../../../helpers/resolveImageUrl";

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
  const imageSrc = resolveImageUrl(userData.profileImage, "/user.svg") || "/user.svg";

  return (
    <div>
      <div className="mb-8 flex justify-center">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-primary/40 blur-xl" />
          <div className="relative h-28 w-28 overflow-hidden rounded-full border-4 border-primary shadow-lg shadow-primary/30">
            <img
              src={imageSrc}
              alt={`${userData.username || "User"} profile photo`}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <p className={fieldLabel}>User Name</p>
          <div className={fieldValue}>{userData.username || "—"}</div>
        </div>

        <div>
          <p className={fieldLabel}>Email</p>
          <div className={fieldValue}>{userData.email || "—"}</div>
        </div>

        <div>
          <p className={fieldLabel}>Contact Number</p>
          <div className={fieldValue}>{userData.phone || "—"}</div>
        </div>

        <div>
          <p className={fieldLabel}>Country</p>
          <div className={userData.country ? fieldValue : `${fieldValue} text-muted-foreground`}>
            {userData.country || "Not selected"}
          </div>
        </div>
      </div>
    </div>
  );
}
