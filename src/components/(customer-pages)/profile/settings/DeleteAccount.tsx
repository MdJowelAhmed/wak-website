// src/components/(customer-pages)/profile/settings/DeleteAccount.tsx
"use client";

import { useState } from "react";
import { Eye, EyeOff, Check } from "lucide-react";
import { Input } from "@/ui/input";
import { toast } from "sonner";
import { myFetch } from "../../../../../helpers/myFetch";

export default function DeleteAccount() {
  const [selectedReasonId, setSelectedReasonId] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const reasons = [
    { id: "duplicate", label: "I have a duplicate account" },
    { id: "no-longer", label: "I no longer want to use this platform" },
    { id: "others", label: "Others" },
  ];

  const handleDelete = async () => {
    if (!selectedReasonId || !password.trim()) {
      toast.error("Please select a reason and enter your password.");
      return;
    }

    const selectedReasonLabel = reasons.find((r) => r.id === selectedReasonId)?.label || "Others";

    setLoading(true);
    try {
      const res = await myFetch("/users", {
        method: "DELETE",
        body: {
          password: password,
          reason: selectedReasonLabel
        }
      });

      if (res.success) {
        toast.success(res.message || "Account deletion request submitted successfully.");
        // Clear the form
        setSelectedReasonId("");
        setPassword("");
      } else {
        toast.error(res.message || res.error || "Failed to submit account deletion request.");
      }
    } catch (error) {
      console.error("Account deletion error:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-zinc-850 space-y-8">
      {/* Header Info */}
      <div>
        <h2 className="text-xl font-bold text-zinc-900 mb-4 tracking-tight">Account Deletion Request</h2>
        <div className="space-y-3 text-sm text-zinc-600 leading-relaxed font-medium">
          <p>
            - If you delete your Account, you will lose your Account&apos;s Order History, Star Points, Saved PCs, Product Wishlist, and other Data that are related to your Account.
          </p>
          <p>
            - Star Points and other financial assets/Data related to this Account will not be Refundable/Recoverable.
          </p>
        </div>
      </div>
 
      {/* Reason Selection */}
      <div>
        <h3 className="text-lg font-bold text-zinc-900 mb-4 tracking-tight">Reason for Deletion</h3>
        <div className="space-y-3.5">
          {reasons.map((reason) => {
            const isSelected = selectedReasonId === reason.id;
            return (
              <div
                key={reason.id}
                onClick={() => setSelectedReasonId(reason.id)}
                className="flex items-center gap-3.5 cursor-pointer group"
              >
                <div
                  className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${isSelected
                    ? "bg-primary border-primary text-white"
                    : "bg-zinc-50 border-zinc-300 text-transparent group-hover:border-zinc-400"
                    }`}
                >
                  <Check className={`w-3.5 h-3.5 ${isSelected ? "text-white" : "opacity-0"}`} />
                </div>
                <span className="text-sm font-semibold text-zinc-600 group-hover:text-zinc-900 transition-colors">
                  {reason.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
 
      {/* Password Input */}
      <div className="space-y-2.5 max-w-full">
        <label htmlFor="delete-password" className="text-sm font-semibold text-zinc-700">
          Current Password
        </label>
        <div className="relative">
          <Input
            id="delete-password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
            className="h-12 bg-zinc-50 border border-zinc-200 text-zinc-900 mt-2 rounded-xl placeholder:text-zinc-400 focus:bg-white focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:border-primary pr-12"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 mt-1 text-zinc-400 hover:text-zinc-650 transition-colors cursor-pointer"
            aria-label="Toggle password visibility"
          >
            {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
        </div>
      </div>
 
      {/* Bottom Action Buttons */}
      <div className="flex items-center justify-end gap-4 pt-6 border-t border-zinc-100">
        <button
          type="button"
          onClick={() => {
            setSelectedReasonId("");
            setPassword("");
          }}
          disabled={loading}
          className="px-8 py-2.5 bg-red-50 hover:bg-red-100 disabled:opacity-50 text-red-600 text-sm font-semibold rounded-xl transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={!selectedReasonId || !password.trim() || loading}
          onClick={handleDelete}
          className="px-8 py-2.5 bg-primary hover:bg-orange-500 disabled:opacity-50 disabled:hover:bg-primary text-white text-sm font-bold rounded-xl transition-colors cursor-pointer shadow-md shadow-orange-500/10"
        >
          {loading ? "Confirming..." : "Confirm"}
        </button>
      </div>
    </div>
  );
}
