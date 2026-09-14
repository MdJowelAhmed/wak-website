"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Label } from "@/ui/label";
import { Input } from "@/ui/input";
import { Button } from "@/ui/button";
import { myFetch } from "../../../../helpers/myFetch";
import { toast } from "sonner";

interface ResetPasswordFormProps {
  onSwitch: (view: "signin" | "otp" | "forgot-password") => void;
  email: string;
  resetToken: string;
}

export function ResetPasswordForm({ onSwitch, resetToken }: ResetPasswordFormProps) {
  const [loading, setLoading] = useState(false);
  const t = useTranslations("Auth");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!newPassword || !confirmPassword) {
      toast.error(t("fillAllFields"), { id: "reset" });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error(t("passwordsMismatch"), { id: "reset" });
      return;
    }

    if (!resetToken) {
      toast.error(t("tokenMissing"), { id: "reset" });
      onSwitch("forgot-password");
      return;
    }

    setLoading(true);
    try {
      const res = await myFetch("/auth/reset-password", {
        method: "POST",
        token: resetToken,
        body: { newPassword, confirmPassword },
      });

      if (res?.success) {
        toast.success(res?.message || t("passwordUpdated"), { id: "reset" });
        onSwitch("signin");
      } else {
        if (res?.error && Array.isArray(res.error)) {
          res.error.forEach((err: { message: string }) => {
            toast.error(err.message, { id: "reset" });
          });
        } else {
          toast.error(res?.message || t("resetFailed"), { id: "reset" });
        }
      }
    } catch {
      toast.error(t("networkError"), { id: "reset" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3 text-center">
        <h2 className="auth-title mb-0! text-zinc-900">{t("resetTitle")}</h2>
        <p className="text-sm text-zinc-500">{t("resetSubtitle")}</p>
      </div>

      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <Label htmlFor="new-password" className="text-zinc-700 text-sm font-medium">{t("newPassword")}</Label>
          <Input name="newPassword" id="new-password" type="password" placeholder="********" required className="h-12 bg-zinc-50 border border-zinc-200 text-zinc-900 mt-2 rounded-xl placeholder:text-zinc-400 focus:bg-white focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:border-primary" />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="confirm-password" className="text-zinc-700 text-sm font-medium">{t("confirmPassword")}</Label>
          <Input name="confirmPassword" id="confirm-password" type="password" placeholder="********" required className="h-12 bg-zinc-50 border border-zinc-200 text-zinc-900 mt-2 rounded-xl placeholder:text-zinc-400 focus:bg-white focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:border-primary" />
        </div>

        <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-orange-500 text-white h-14 text-lg font-bold rounded-xl mt-4 shadow-lg shadow-orange-500/20 cursor-pointer">
          {loading ? t("updating") : t("updatePassword")}
        </Button>
      </form>
    </div>
  );
}
