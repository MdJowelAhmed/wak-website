// src/ui/UserAuthMenu.tsx
'use client';

import AuthModal from '@/components/(auth-pages)';
import { useEffect, useState } from 'react';
import { User, LogOut } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import getProfile from '../../helpers/getProfile';
import ProfileAvatar from '@/ui/ProfileAvatar';

interface UserAuthMenuProps {
    isLoggedIn: boolean;
    isLoading?: boolean;
    logout: () => void;
}

export default function UserAuthMenu({ isLoggedIn, isLoading = false, logout }: UserAuthMenuProps) {
    const t = useTranslations("Navigation");
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [userName, setUserName] = useState<string>("");

    useEffect(() => {
        let isMounted = true;

        if (isLoggedIn) {
            getProfile()
                .then((data) => {
                    if (!isMounted) return;
                    if (!data) {
                        window.dispatchEvent(new Event("auth-change"));
                        return;
                    }
                    setProfileImage(data.profileImage ?? null);
                    if (data.name) {
                        setUserName(data.name);
                    }
                })
                .catch(() => {
                    if (isMounted) {
                        window.dispatchEvent(new Event("auth-change"));
                    }
                });
        } else {
            setProfileImage(null);
            setUserName("");
        }

        return () => {
            isMounted = false;
        };
    }, [isLoggedIn]);

    if (isLoading) {
        return (
            <div
                className="h-10 w-10 shrink-0 rounded-full border border-border bg-section-bg"
                aria-hidden
            />
        );
    }

    if (!isLoggedIn) {
        return (
            <AuthModal
                trigger={
                    <button className="text-xs font-bold bg-primary px-5 py-2 rounded-xl transition-all cursor-pointer text-white hover:bg-primary-hover shadow-xs">
                        {t("login")}
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
                <ProfileAvatar
                    src={profileImage}
                    alt={userName || t("myAccount")}
                    className="h-10 w-10"
                    sizes="40px"
                />
            </Link>

            {/* Dropdown Menu on Hover */}
            <div className="absolute end-0 top-full pt-2 hidden group-hover:block z-50 min-w-[180px]">
                <div className="bg-card border border-border rounded-2xl shadow-xl p-1.5 flex flex-col gap-1 text-sm">
                    <div className="px-3 py-2 border-b border-border">
                        <p className="text-[10px] text-body-text uppercase font-bold tracking-wider">{t("signedInAs")}</p>
                        <p className="font-bold text-secondary truncate text-xs mt-0.5">{userName || t("myAccount")}</p>
                    </div>

                    <Link
                        href="/profile"
                        className="flex items-center gap-2.5 px-3 py-2 text-body-text hover:text-secondary hover:bg-section-bg rounded-xl transition-colors cursor-pointer text-xs font-medium"
                    >
                        <User className="w-4 h-4 text-primary" />
                        <span>{t("myProfile")}</span>
                    </Link>

                    <button
                        onClick={logout}
                        className="flex items-center gap-2.5 px-3 py-2 text-error hover:bg-error/10 rounded-xl transition-colors cursor-pointer w-full text-left text-xs font-semibold"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>{t("logout")}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
