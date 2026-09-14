"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { myFetch } from "../../../../helpers/myFetch";
import { toast } from "sonner";

interface ForgotPasswordFormProps {
  onSwitch: (view: "signin" | "otp") => void;
  setEmail: (email: string) => void;
}

export function ForgotPasswordForm({ onSwitch, setEmail }: ForgotPasswordFormProps) {
  const [loading, setLoading] = useState(false);
  const t = useTranslations("Auth");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    if (!email) {
      toast.error(t("enterEmail"), { id: "forgot" });
      return;
    }

    setLoading(true);
    try {
      const res = await myFetch("/auth/forget-password", {
        method: "POST",
        body: { email },
      });

      if (res?.success) {
        toast.success(res?.message || t("otpSent"), { id: "forgot" });
        setEmail(email);
        onSwitch("otp");
      } else {
        if (res?.error && Array.isArray(res.error)) {
          res.error.forEach((err: { message: string }) => {
            toast.error(err.message, { id: "forgot" });
          });
        } else {
          toast.error(res?.message || t("somethingWrong"), { id: "forgot" });
        }
      }
    } catch {
      toast.error(t("networkError"), { id: "forgot" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3 text-center">
        <h2 className="auth-title mb-0! text-zinc-900">{t("forgotTitle")}</h2>
      </div>

      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <Label htmlFor="forgot-email" className="text-zinc-700 text-sm font-medium">{t("email")}</Label>
          <Input name="email" id="forgot-email" type="email" placeholder={t("emailPlaceholder")} required className="h-12 bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-xl placeholder:text-zinc-400 focus:bg-white focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:border-primary" />
        </div>

        <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-orange-500 text-white h-14 text-lg font-bold rounded-xl mt-4 shadow-lg shadow-orange-500/20 cursor-pointer">
          {loading ? t("sending") : t("sendCode")}
        </Button>
      </form>
    </div>
  );
}
