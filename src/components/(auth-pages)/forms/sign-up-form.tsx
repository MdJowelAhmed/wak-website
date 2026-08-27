"use client";

import { useState } from "react";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { FacebookIcon, GoogleIcon, AppleIcon } from "@/components/(auth-pages)/components/brands";
import { toast } from "sonner";
import { myFetch } from "../../../../helpers/myFetch";

interface SignUpFormProps {
  onSwitch: (view: "otp" | "forgot-password" | "signin", email?: string) => void;
}

export function SignUpForm({ onSwitch }: SignUpFormProps) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const password = formData.get("password") as string;

    if (!name || !email || !phone || !password) {
      toast.error("Please fill in all fields", { id: "register" });
      return;
    }

    setLoading(true);
    try {
      const res = await myFetch("/users/", {
        method: "POST",
        body: { name, email, phone, password, role: "customer" },
      });

      if (res?.success) {
        toast.success(res?.message || "Registered successfully", { id: "register" });
        onSwitch("otp", email);
      } else {
        if (res?.error && Array.isArray(res.error)) {
          res.error.forEach((err: { message: string }) => {
            toast.error(err.message, { id: "register" });
          });
        } else {
          toast.error(res?.message || "Failed to register!", { id: "register" });
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Network error", { id: "register" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3 text-center">
        <h2 className="auth-title mb-0! text-zinc-900">Register a new account</h2>
        <p className="text-sm text-zinc-500">Please enter your information to create account</p>
      </div>

      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <Label htmlFor="signup-name" className="text-zinc-700 text-sm font-medium">User Name</Label>
          <Input name="name" id="signup-name" type="text" placeholder="Enter full name" required className="h-12 bg-zinc-50 border border-zinc-200 text-zinc-900 mt-2 rounded-xl placeholder:text-zinc-400 focus:bg-white focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:border-primary" />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="signup-email" className="text-zinc-700 text-sm font-medium">Email</Label>
          <Input name="email" id="signup-email" type="email" placeholder="Enter email address" required className="h-12 bg-zinc-50 border border-zinc-200 text-zinc-900 mt-2 rounded-xl placeholder:text-zinc-400 focus:bg-white focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:border-primary" />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="signup-contact" className="text-zinc-700 text-sm font-medium">Contact Number</Label>
          <Input name="phone" id="signup-contact" type="text" placeholder="Enter contact number" required className="h-12 bg-zinc-50 border border-zinc-200 text-zinc-900 mt-2 rounded-xl placeholder:text-zinc-400 focus:bg-white focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:border-primary" />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="signup-password" className="text-zinc-700 text-sm font-medium">Password</Label>
          <Input name="password" id="signup-password" type="password" placeholder="********" required className="h-12 bg-zinc-50 border border-zinc-200 text-zinc-900 mt-2 rounded-xl placeholder:text-zinc-400 focus:bg-white focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:border-primary" />
        </div>


        <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-orange-500 text-white h-14 text-lg font-bold rounded-xl mt-4 shadow-lg shadow-orange-500/20 cursor-pointer">
          {loading ? "Signing Up..." : "Sign Up"}
        </Button>
      </form>

      <div className="text-center text-sm text-zinc-500">
        Already have an account?{" "}
        <button
          onClick={() => onSwitch("signin")}
          className="text-primary font-semibold hover:underline cursor-pointer"
        >
          Sign In
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button variant="outline" className="h-14 gap-3 bg-zinc-50 border-zinc-200 text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 rounded-xl cursor-pointer">
          <GoogleIcon className="w-6 h-6 text-red-500" />
          Google
        </Button>
        <Button variant="outline" className="h-14 gap-3 bg-zinc-50 border-zinc-200 text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 rounded-xl cursor-pointer">
          <AppleIcon className="w-6 h-6 text-black" />
          Apple
        </Button>
      </div>
    </div>
  );
}

