// src/ui/UserAuthMenu.tsx
'use client';

import Link from 'next/link';
import AuthModal from '@/components/(auth-pages)';
import { useEffect, useState } from 'react';
import { User, LogOut } from 'lucide-react';
import getProfile from '../../helpers/getProfile';

interface UserAuthMenuProps {
    isLoggedIn: boolean;
    logout: () => void;
}

export default function UserAuthMenu({ isLoggedIn, logout }: UserAuthMenuProps) {
    const [profileImage, setProfileImage] = useState<string>("/user.svg");
    const [userName, setUserName] = useState<string>("My Account");

    useEffect(() => {
        if (isLoggedIn) {
            getProfile().then((data) => {
                if (data?.profileImage) {
                    setProfileImage(data.profileImage);
                }
                if (data?.name) {
                    setUserName(data.name);
                }
            }).catch(console.error);
        } else {
            setProfileImage("/user.svg");
            setUserName("My Account");
        }
    }, [isLoggedIn]);

    if (!isLoggedIn) {
        return (
            <AuthModal
                trigger={
                    <button className="text-sm font-bold bg-primary px-6 py-2.5 rounded-lg transition-colors cursor-pointer text-white hover:bg-orange-500">
                        Login
                    </button>
                }
            />
        );
    }

    return (
        <div className="group relative shrink-0">
            <Link
                href="/profile"
                className="block w-10 h-10 rounded-full overflow-hidden border border-zinc-700 cursor-pointer hover:border-orange-500 transition-colors bg-zinc-800"
            >
                <img
                    src={profileImage}
                    alt="User Profile"
                    className="w-full h-full object-cover"
                />
            </Link>

            {/* Dropdown Menu on Hover */}
            <div className="absolute right-0 top-full pt-2 hidden group-hover:block z-50 min-w-[170px]">
                <div className="bg-[#1f1f1f] border border-zinc-800 rounded-xl shadow-xl p-1.5 flex flex-col gap-1 text-sm">
                    <div className="px-3 py-2 border-b border-zinc-800">
                        <p className="text-xs text-zinc-400">Signed in as</p>
                        <p className="font-semibold text-white truncate text-xs">{userName}</p>
                    </div>

                    <Link
                        href="/profile"
                        className="flex items-center gap-2.5 px-3 py-2 text-zinc-300 hover:text-white hover:bg-zinc-800/80 rounded-lg transition-colors cursor-pointer"
                    >
                        <User className="w-4 h-4 text-zinc-400" />
                        <span>My Profile</span>
                    </Link>

                    <button
                        onClick={logout}
                        className="flex items-center gap-2.5 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer w-full text-left"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
