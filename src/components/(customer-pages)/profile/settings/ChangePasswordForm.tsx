"use client";

import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Input } from "@/ui/input";
import { myFetch } from "../../../../../helpers/myFetch";
import { toast } from "sonner";

export default function ChangePasswordForm() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const currentPassword = formData.get("currentPassword") as string;
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await myFetch("/auth/change-password", {
        method: "POST",
        body: { currentPassword, newPassword, confirmPassword },
      });

      if (res?.success) {
        toast.success(res?.message || "Your password has been successfully changed");
        (e.target as HTMLFormElement).reset();
      } else {
        if (res?.error && Array.isArray(res.error)) {
          res.error.forEach((err: { message: string }) => {
            toast.error(err.message);
          });
        } else {
          toast.error(res?.message || "Failed to change password.");
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while changing the password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Current Password */}
      <div className="space-y-2">
        <label
          htmlFor="current-password"
          className="text-sm font-semibold text-zinc-700"
        >
          Current Password
        </label>
        <div className="relative">
          <Input
            id="current-password"
            name="currentPassword"
            type={showCurrent ? "text" : "password"}
            placeholder="••••••••"
            className="h-12 bg-zinc-50 border border-zinc-200 text-zinc-900 mt-2 rounded-xl placeholder:text-zinc-400 focus:bg-white focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:border-primary"
          />
          <button
            type="button"
            onClick={() => setShowCurrent(!showCurrent)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors cursor-pointer"
          >
            {showCurrent ? (
              <Eye className="w-5 h-5" />
            ) : (
              <EyeOff className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
 
      {/* New Password */}
      <div className="space-y-2">
        <label
          htmlFor="new-password"
          className="text-sm font-semibold text-zinc-700"
        >
          New password
        </label>
        <div className="relative">
          <Input
            id="new-password"
            name="newPassword"
            type={showNew ? "text" : "password"}
            placeholder="••••••••"
            className="h-12 bg-zinc-50 border border-zinc-200 text-zinc-900 mt-2 rounded-xl placeholder:text-zinc-400 focus:bg-white focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:border-primary"
          />
          <button
            type="button"
            onClick={() => setShowNew(!showNew)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors cursor-pointer"
          >
            {showNew ? (
              <Eye className="w-5 h-5" />
            ) : (
              <EyeOff className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
 
      {/* Confirm Password */}
      <div className="space-y-2">
        <label
          htmlFor="confirm-password"
          className="text-sm font-semibold text-zinc-700"
        >
          Confirm New password
        </label>
        <div className="relative">
          <Input
            id="confirm-password"
            name="confirmPassword"
            type={showConfirm ? "text" : "password"}
            placeholder="••••••••"
            className="h-12 bg-zinc-50 border border-zinc-200 text-zinc-900 mt-2 rounded-xl placeholder:text-zinc-400 focus:bg-white focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:border-primary"
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors cursor-pointer"
          >
            {showConfirm ? (
              <Eye className="w-5 h-5" />
            ) : (
              <EyeOff className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
 
      {/* Actions */}
      <div className="flex items-center justify-end gap-4 pt-4">
        <button
          type="button"
          className="px-8 py-3 bg-red-50 hover:bg-red-100 text-red-650 text-sm font-semibold rounded-xl transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3 bg-primary hover:bg-orange-500 text-white text-sm font-bold rounded-xl transition-colors cursor-pointer shadow-md shadow-orange-500/10 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save"}
        </button>
      </div>
    </form>
  );
}
