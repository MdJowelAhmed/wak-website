"use client";

import { useState } from "react";
import { SignInForm } from "../forms/sign-in-form";
import { SignUpForm } from "../forms/sign-up-form";
import { ForgotPasswordForm } from "../forms/forgot-password-form";
import { OtpForm } from "../forms/otp-form";
import { ResetPasswordForm } from "../forms/reset-password-form";

export function AuthContainer() {
  const [view, setView] = useState<"signin" | "signup" | "forgot-password" | "otp" | "reset-password">("signin");
  const [email, setEmail] = useState<string>("");
  const [resetToken, setResetToken] = useState<string>("");
  const [otpPurpose, setOtpPurpose] = useState<"signup" | "forgot-password">("signup");

  return (
    <div className="bg-white p-8 shadow-2xl border border-zinc-200/50 w-full max-w-[600px] mx-auto overflow-hidden rounded-xl">
      {view === "signin" && <SignInForm onSwitch={setView} />}
      {view === "signup" && <SignUpForm onSwitch={(v, email) => { setView(v as any); if (email) setEmail(email); setOtpPurpose("signup"); }} />}
      {view === "forgot-password" && <ForgotPasswordForm onSwitch={(v) => { setView(v as any); setOtpPurpose("forgot-password"); }} setEmail={setEmail} />}
      {view === "otp" && <OtpForm onSwitch={(v) => setView(v as any)} email={email} setResetToken={setResetToken} purpose={otpPurpose} />}
      {view === "reset-password" && <ResetPasswordForm onSwitch={(v) => setView(v as any)} email={email} resetToken={resetToken} />}
    </div>
  );
}
