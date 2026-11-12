'use client';

import AuthModal from '@/components/(auth-pages)';
import { User, LogOut } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useAuth } from '@/hooks/use-auth';
import ProfileAvatar from '@/ui/ProfileAvatar';

export default function UserAuthMenu() {
    const t = useTranslations("Navigation");
    const { isLoggedIn, user, logout } = useAuth();

    if (!isLoggedIn) {
        return (
            <AuthModal
                trigger={
                    <button
                        type="button"
                        className="text-xs font-bold px-5 py-2 rounded-xl transition-all cursor-pointer text-white shadow-xs bg-primary hover:bg-primary-hover"
                    >
                        {t("login")}
                    </button>
                }
            />
        );
    }

    const displayName = user?.name || t("myAccount");

    return (
        <div className="group relative shrink-0">
            <Link
                href="/profile"
                aria-label={t("myProfile")}
                className="block w-10 h-10 rounded-full overflow-hidden border border-border cursor-pointer hover:border-primary transition-colors bg-section-bg shadow-2xs"
            >
                <ProfileAvatar
                    src={user?.profileImage}
                    alt={displayName}
                    className="h-10 w-10"
                    sizes="40px"
                />
            </Link>

            <div className="absolute end-0 top-full pt-2 hidden group-hover:block group-focus-within:block z-50 min-w-[180px]">
                <div className="bg-card border border-border rounded-2xl shadow-xl p-1.5 flex flex-col gap-1 text-sm">
                    <div className="px-3 py-2 border-b border-border">
                        <p className="text-[10px] text-body-text uppercase font-bold tracking-wider">{t("signedInAs")}</p>
                        <p className="font-bold text-secondary truncate text-xs mt-0.5">{displayName}</p>
                    </div>

                    <Link
                        href="/profile"
                        className="flex items-center gap-2.5 px-3 py-2 text-body-text hover:text-secondary hover:bg-section-bg rounded-xl transition-colors cursor-pointer text-xs font-medium"
                    >
                        <User className="w-4 h-4 text-primary" />
                        <span>{t("myProfile")}</span>
                    </Link>

                    <button
                        type="button"
                        onClick={logout}
                        className="flex items-center gap-2.5 px-3 py-2 text-error hover:bg-error/10 rounded-xl transition-colors cursor-pointer w-full text-start text-xs font-semibold"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>{t("logout")}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
