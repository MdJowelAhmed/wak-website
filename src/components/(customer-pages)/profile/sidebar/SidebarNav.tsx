"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  User,
  ShoppingBag,
  MessageCircle,
  Star,
  Settings,
  FolderKanban,
  LogOut,
} from "lucide-react";
import { TbMessageStar } from "react-icons/tb";
import { HiOutlineUserCircle } from "react-icons/hi2";
import type { ComponentType } from "react";
import type { SidebarItem } from "../config/sidebar-config";
import { useAuth } from "@/hooks/use-auth";

const iconMap: Record<string, ComponentType<{ className?: string }>> = {
  HiOutlineUserCircle,
  ShoppingBag,
  MessageCircle,
  Star,
  Settings,
  FolderKanban,
  TbMessageStar,
};

interface SidebarNavProps {
  items: SidebarItem[];
}

export default function SidebarNav({ items }: SidebarNavProps) {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <div className="flex flex-col h-full">
      <nav className="flex flex-col gap-3.5 mb-6">
        {items.map((item) => {
          const isActive = pathname === item.href;
          const Icon = iconMap[item.icon] || User;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                group relative flex items-center gap-3 px-4 py-3 rounded-xl
                text-sm font-semibold transition-all duration-200
                ${isActive
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 bg-transparent cursor-pointer"
                }`}>
              <Icon className="w-[18px] h-[18px] shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <button
        onClick={logout}
        className="mt-auto flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-zinc-600 hover:text-red-600 hover:bg-red-50 transition-all duration-200 cursor-pointer w-full"
      >
        <LogOut className="w-[18px] h-[18px] shrink-0" />
        <span>Logout</span>
      </button>
    </div>
  );
}
