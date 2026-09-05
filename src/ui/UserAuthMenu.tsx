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
                    <button className="text-xs font-bold bg-primary px-5 py-2 rounded-xl transition-all cursor-pointer text-white hover:bg-primary-hover shadow-xs">
                        Login / Sign Up
                    </button>
                }
            />
        );
    }

    return (
        <div className="group relative shrink-0">
            <Link
                href="/profile"
                className="block w-10 h-10 rounded-full overflow-hidden border border-border cursor-pointer hover:border-primary transition-colors bg-section-bg shadow-2xs"
            >
                <img
                    src={profileImage}
                    alt="User Profile"
                    className="w-full h-full object-cover"
                />
            </Link>

            {/* Dropdown Menu on Hover */}
            <div className="absolute right-0 top-full pt-2 hidden group-hover:block z-50 min-w-[180px]">
                <div className="bg-card border border-border rounded-2xl shadow-xl p-1.5 flex flex-col gap-1 text-sm">
                    <div className="px-3 py-2 border-b border-border">
                        <p className="text-[10px] text-body-text uppercase font-bold tracking-wider">Signed in as</p>
                        <p className="font-bold text-foreground truncate text-xs mt-0.5">{userName}</p>
                    </div>

                    <Link
                        href="/profile"
                        className="flex items-center gap-2.5 px-3 py-2 text-body-text hover:text-foreground hover:bg-section-bg rounded-xl transition-colors cursor-pointer text-xs font-medium"
                    >
                        <User className="w-4 h-4 text-primary" />
                        <span>My Profile</span>
                    </Link>

                    <button
                        onClick={logout}
                        className="flex items-center gap-2.5 px-3 py-2 text-error hover:bg-error/10 rounded-xl transition-colors cursor-pointer w-full text-left text-xs font-semibold"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
