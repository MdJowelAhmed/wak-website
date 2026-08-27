// src/ui/UserAuthMenu.tsx
'use client';

import Link from 'next/link';
import AuthModal from '@/components/(auth-pages)';
import { useEffect, useState } from 'react';
import getProfile from '../../helpers/getProfile';

interface UserAuthMenuProps {
    isLoggedIn: boolean;
    logout: () => void;
}

export default function UserAuthMenu({ isLoggedIn, logout }: UserAuthMenuProps) {
    const [profileImage, setProfileImage] = useState<string>("/user.svg");

    useEffect(() => {
        if (isLoggedIn) {
            getProfile().then((data) => {
                if (data?.profileImage) {
                    setProfileImage(data.profileImage);
                }
            }).catch(console.error);
        }
    }, [isLoggedIn]);

    if (!isLoggedIn) {
        return (
            <AuthModal
                trigger={
                    <button className="text-sm font-bold bg-primary  px-6 py-2.5 rounded-lg transition-colors cursor-pointer text-white">
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
                    className="w-full h-full object-fit"
                />
            </Link>

        </div>
    );
}
