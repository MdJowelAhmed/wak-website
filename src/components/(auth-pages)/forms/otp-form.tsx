"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/ui/input-otp";
import { myFetch } from "../../../../helpers/myFetch";
import { toast } from "sonner";

interface OtpFormProps {
  onSwitch: (view: "forgot-password" | "reset-password" | "signin" | "signup") => void;
  email: string;
  setResetToken: (token: string) => void;
  purpose: "signup" | "forgot-password";
}

export function OtpForm({ onSwitch, email, setResetToken, purpose }: OtpFormProps) {
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [otp, setOtp] = useState("");
  const t = useTranslations("Auth");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email) {
      toast.error(t("emailMissing"), { id: "otp" });
      onSwitch(purpose === "signup" ? "signup" : "forgot-password");
      return;
    }

    if (otp.length !== 6) {
      toast.error(t("invalidOtp"), { id: "otp" });
      return;
    }

    setLoading(true);
    try {
      const res = await myFetch("/auth/verify-email", {
        method: "POST",
        body: { email, oneTimeCode: Number(otp) },
      });

      if (res?.success) {
        toast.success(res?.message || t("verified"), { id: "otp" });
        if (purpose === "forgot-password") {
          setResetToken(res?.data?.token);
          onSwitch("reset-password");
        } else {
          onSwitch("signin");
        }
      } else {
        if (res?.error && Array.isArray(res.error)) {
          res.error.forEach((err: { message: string }) => {
            toast.error(err.message, { id: "otp" });
          });
        } else {
          toast.error(res?.message || t("invalidOtpError"), { id: "otp" });
        }
      }
    } catch {
      toast.error(t("networkError"), { id: "otp" });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      toast.error(t("emailMissing"), { id: "otp" });
      onSwitch("forgot-password");
      return;
    }

    setResending(true);
    try {
      const res = await myFetch("/auth/resend-otp", {
        method: "POST",
        body: { email },
      });

      if (res?.success) {
        toast.success(res?.message || t("otpResent"), { id: "otp" });
      } else {
        toast.error(res?.message || t("resendFailed"), { id: "otp" });
      }
    } catch {
      toast.error(t("networkError"), { id: "otp" });
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3 text-center">
        <h2 className="auth-title mb-0! text-zinc-900">{t("otpTitle")}</h2>
        <p className="text-sm text-zinc-500 font-medium">
          {t("otpSentTo")} <span className="text-zinc-900 font-bold">{email || t("yourEmail")}</span><br />
          {t("otpHint")}
        </p>
      </div>

      <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
        <div className="flex justify-center mt-2">
          <InputOTP maxLength={6} value={otp} onChange={(val) => setOtp(val)}>
            <InputOTPGroup className="gap-2 sm:gap-4">
              <InputOTPSlot index={0} className="w-10 sm:w-14 h-14 sm:h-16 bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-xl focus:bg-white focus:ring-1 focus:ring-primary focus:border-primary text-xl sm:text-2xl font-bold" />
              <InputOTPSlot index={1} className="w-10 sm:w-14 h-14 sm:h-16 bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-xl focus:bg-white focus:ring-1 focus:ring-primary focus:border-primary text-xl sm:text-2xl font-bold" />
              <InputOTPSlot index={2} className="w-10 sm:w-14 h-14 sm:h-16 bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-xl focus:bg-white focus:ring-1 focus:ring-primary focus:border-primary text-xl sm:text-2xl font-bold" />
              <InputOTPSlot index={3} className="w-10 sm:w-14 h-14 sm:h-16 bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-xl focus:bg-white focus:ring-1 focus:ring-primary focus:border-primary text-xl sm:text-2xl font-bold" />
              <InputOTPSlot index={4} className="w-10 sm:w-14 h-14 sm:h-16 bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-xl focus:bg-white focus:ring-1 focus:ring-primary focus:border-primary text-xl sm:text-2xl font-bold" />
              <InputOTPSlot index={5} className="w-10 sm:w-14 h-14 sm:h-16 bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-xl focus:bg-white focus:ring-1 focus:ring-primary focus:border-primary text-xl sm:text-2xl font-bold" />
            </InputOTPGroup>
          </InputOTP>
        </div>

        <div className="flex flex-col gap-4">
          <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-orange-500 text-white h-14 text-lg font-bold rounded-xl shadow-lg shadow-orange-500/20 cursor-pointer">
            {loading ? t("verifying") : t("verifyCode")}
          </Button>

          <p className="text-center text-sm text-zinc-500">
            {t("noEmailReceived")}{" "}
            <button type="button" onClick={handleResend} disabled={resending} className="text-primary font-semibold hover:underline cursor-pointer disabled:opacity-50">
              {resending ? t("resending") : t("resend")}
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}
