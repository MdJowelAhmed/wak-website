import { Pencil } from "lucide-react";

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
  return (
    <div className="flex items-center justify-between mb-8">
      <h1 className="text-xl md:text-2xl font-bold text-zinc-900">{title}</h1>
 
      {!isEditing && (
        <button
          onClick={onToggleEdit}
          className="flex items-center gap-2 px-4.5 py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-200 text-sm font-semibold rounded-lg transition-colors cursor-pointer"
        >
          <Pencil className="w-4 h-4" />
          Edit Profile
        </button>
      )}
    </div>
  );
}
