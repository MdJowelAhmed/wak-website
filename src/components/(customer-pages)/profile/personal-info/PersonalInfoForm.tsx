"use client";

import { useState, useRef } from "react";
import { Camera } from "lucide-react";
import { Input } from "@/ui/input";
import { Button } from "@/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import { resolveImageUrl } from "../../../../../helpers/resolveImageUrl";
import type { PersonalInfoUser } from "./PersonalInfoView";

export type PersonalInfoSavePayload = {
  username: string;
  email: string;
  phone: string;
  country: string;
  profileImageFile?: File;
};

interface PersonalInfoFormProps {
  userData: PersonalInfoUser;
  onSave: (data: PersonalInfoSavePayload) => void;
  onCancel: () => void;
}

const countries = [
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "Japan",
  "India",
  "Bangladesh",
  "Brazil",
  "South Korea",
  "United Arab Emirates",
];

const fieldLabel = "text-sm font-semibold text-white/80";
const fieldControl =
  "h-12 rounded-xl border-white/10 bg-white text-card-foreground placeholder:text-muted-foreground focus:bg-white focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:border-primary";

export default function PersonalInfoForm({
  userData,
  onSave,
  onCancel,
}: PersonalInfoFormProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [country, setCountry] = useState(userData.country || "");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentImage = previewUrl || resolveImageUrl(userData.profileImage, "/user.svg") || "/user.svg";

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: PersonalInfoSavePayload = {
      username: formData.get("username") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      country,
    };

    const file = formData.get("profileImage") as File | null;
    if (file && file.size > 0) {
      data.profileImageFile = file;
    }

    onSave(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-8 flex justify-center">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-primary/40 blur-xl" />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            aria-label="Change profile photo"
            className="group relative h-28 w-28 overflow-hidden rounded-full border-4 border-primary shadow-lg shadow-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <img
              src={currentImage}
              alt="Profile preview"
              className="h-full w-full object-cover"
            />
            <span className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 transition-opacity group-hover:opacity-100">
              <Camera className="h-6 w-6 text-white" aria-hidden />
            </span>
          </button>
          <span className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-secondary bg-primary text-white shadow-md">
            <Camera className="h-3.5 w-3.5" aria-hidden />
          </span>
          <input
            type="file"
            ref={fileInputRef}
            name="profileImage"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="profile-username" className={fieldLabel}>
            User Name
          </label>
          <Input
            id="profile-username"
            name="username"
            defaultValue={userData.username}
            placeholder="Enter full name"
            className={fieldControl}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="profile-email" className={fieldLabel}>
            Email
          </label>
          <Input
            id="profile-email"
            name="email"
            type="email"
            defaultValue={userData.email}
            placeholder="Enter email address"
            className={fieldControl}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="profile-phone" className={fieldLabel}>
            Contact Number
          </label>
          <Input
            id="profile-phone"
            name="phone"
            defaultValue={userData.phone}
            placeholder="+9 018674512001"
            className={fieldControl}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="profile-country" className={fieldLabel}>
            Country
          </label>
          <Select value={country || undefined} onValueChange={setCountry}>
            <SelectTrigger
              id="profile-country"
              className={`${fieldControl} shadow-none`}
            >
              <SelectValue placeholder="Select country name" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-border bg-card text-card-foreground">
              {countries.map((country) => (
                <SelectItem
                  key={country}
                  value={country}
                  className="cursor-pointer focus:bg-primary focus:text-white"
                >
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-10 flex items-center justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="rounded-xl border-white/30 bg-transparent px-8 text-white hover:bg-white/10 hover:text-white"
        >
          Cancel
        </Button>
        <Button type="submit" className="rounded-xl px-8 shadow-md shadow-primary/25">
          Save
        </Button>
      </div>
    </form>
  );
}
