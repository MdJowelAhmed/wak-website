"use client";

import { useState } from "react";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Checkbox } from "@/ui/checkbox";
import { useAuth } from "@/hooks/use-auth";
import { GoogleIcon, AppleIcon } from "@/components/(auth-pages)/components/brands";
import { myFetch } from "../../../../helpers/myFetch";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

interface SignInFormProps {
  onSwitch: (view: "signup" | "forgot-password") => void;
}

export function SignInForm({ onSwitch }: SignInFormProps) {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      toast.error("Please enter email and password", { id: "login" });
      return;
    }

    setLoading(true);
    try {
      const res = await myFetch("/auth/login", {
        method: "POST",
        body: { email, password },
      });

      if (res?.success) {
        toast.success(res?.message || "Login successfully", { id: "login" });
        if (res?.data?.accessToken) {
          Cookies.set("accessToken", res.data.accessToken);
        }
        login();
        router.push("/home");
      } else {
        if (res?.error && Array.isArray(res.error)) {
          res.error.forEach((err: { message: string }) => {
            toast.error(err.message, { id: "login" });
          });
        } else {
          toast.error(res?.message || "Something went wrong!", { id: "login" });
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Network error", { id: "login" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3 text-center">
        <h2 className="auth-title mb-0! text-zinc-900">Login to Account</h2>
        <p className="text-sm text-zinc-500">Please enter your email and password to continue</p>
      </div>
 
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <Label htmlFor="signin-email" className="text-zinc-700 text-sm font-medium">Email</Label>
          <Input
            name="email"
            id="signin-email"
            type="email"
            placeholder="Enter email address"
            className="h-12 bg-zinc-50 border border-zinc-200 text-zinc-900 mt-2 rounded-xl placeholder:text-zinc-400 focus:bg-white focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:border-primary"
          />
        </div>
 
        <div className="flex flex-col gap-2">
          <Label htmlFor="signin-password" title="Password" className="text-zinc-700 text-sm font-medium">Password</Label>
          <div className="relative">
            <Input
              name="password"
              id="signin-password"
              type="password"
              placeholder="********"
              className="h-12 bg-zinc-50 border border-zinc-200 text-zinc-900 mt-2 rounded-xl placeholder:text-zinc-400 focus:bg-white focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:border-primary pr-10"
            />
          </div>
        </div>
 
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center space-x-2">
            <Checkbox id="remember" className="border-zinc-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
            <Label htmlFor="remember" className="text-sm font-normal cursor-pointer text-zinc-500">Remember Password</Label>
          </div>
          <button
            type="button"
            onClick={() => onSwitch("forgot-password")}
            className="text-sm font-medium text-zinc-500 hover:text-zinc-800 hover:underline cursor-pointer"
          >
            Forget Password?
          </button>
        </div>
 
        <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-orange-500 text-white h-14 text-lg font-bold rounded-xl mt-4 shadow-lg shadow-orange-500/20 cursor-pointer">
          {loading ? "Signing In..." : "Sign In"}
        </Button>
      </form>
 
      <div className="text-center text-sm text-zinc-500">
        Don't have an account?{" "}
        <button
          onClick={() => onSwitch("signup")}
          className="text-primary font-semibold hover:underline cursor-pointer"
        >
          Sign Up
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

