// src/ui/CustomerMobileMenu.tsx
'use client';

import { LogOut, MapPin, Truck, HelpCircle, Globe } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import NavLinks from '@/ui/NavLinks';
import AuthModal from '@/components/(auth-pages)';
import SearchBar from '@/ui/SearchBar';

interface CustomerMobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    isLoggedIn: boolean;
    userMode: string;
    logout?: () => void;
    currentLocation?: string;
    onOpenLocationModal?: () => void;
    onOpenLangModal?: () => void;
    currentCurrencyLabel?: string;
    currentLangName?: string;
}

export default function CustomerMobileMenu({
    isOpen,
    onClose,
    isLoggedIn,
    userMode,
    logout,
    currentLocation = 'Lilongwe, 20100',
    onOpenLocationModal,
    onOpenLangModal,
    currentCurrencyLabel = '🇲🇼 MWK',
    currentLangName = 'English',
}: CustomerMobileMenuProps) {
    const t = useTranslations();

    if (!isOpen) return null;

    return (
        <div className="xl:hidden py-6 border-t border-border bg-card animate-in fade-in slide-in-from-top-2 duration-200 shadow-xl">
            <div className="flex flex-col gap-5 px-5">
                {/* Mobile Search */}
                <div className="md:hidden">
                    <SearchBar
                        placeholder={t("MobileMenu.searchPlaceholder")}
                        onClose={onClose}
                    />
                </div>

                {/* Location Control Pill */}
                <div
                    onClick={() => {
                        onClose();
                        onOpenLocationModal?.();
                    }}
                    className="flex items-center justify-between p-3 rounded-xl bg-section-bg border border-border cursor-pointer"
                >
                    <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                        <MapPin className="w-4 h-4 text-primary shrink-0" />
                        <span>{t("MobileMenu.deliverTo")} <strong className="text-primary">{currentLocation}</strong></span>
                    </div>
                    <span className="text-[10px] font-bold text-primary underline">{t("MobileMenu.change")}</span>
                </div>

                {/* Main Navigation Links */}
                <div onClick={onClose} className="py-2 border-y border-border">
                    <NavLinks userMode={userMode} />
                </div>

                {/* Quick Utility Links */}
                <div className="flex flex-col gap-3 text-xs font-medium text-foreground">
                    <button
                        onClick={() => {
                            onClose();
                            onOpenLangModal?.();
                        }}
                        className="flex items-center justify-between py-2 text-foreground hover:text-primary transition-colors cursor-pointer text-left"
                    >
                        <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4 text-primary" />
                            <span>{t("MobileMenu.languageCountry")}</span>
                        </div>
                        <span className="text-[10px] bg-primary/5 text-primary px-2 py-0.5 rounded font-bold">
                            {currentCurrencyLabel} / {currentLangName}
                        </span>
                    </button>

                    <Link href="/profile" onClick={onClose} className="flex items-center gap-2 py-2 text-foreground hover:text-primary transition-colors">
                        <Truck className="w-4 h-4 text-primary" />
                        <span>{t("Navigation.trackOrder")}</span>
                    </Link>

                    <Link href="/contact-us" onClick={onClose} className="flex items-center gap-2 py-2 text-foreground hover:text-primary transition-colors">
                        <HelpCircle className="w-4 h-4 text-primary" />
                        <span>{t("Navigation.supportHelp")}</span>
                    </Link>
                </div>

                {/* Account & Cart Actions */}
                <div className="pt-4 border-t border-border flex flex-col gap-3">
                    {!isLoggedIn ? (
                        <AuthModal
                            trigger={
                                <button className="w-full bg-primary hover:bg-primary-hover transition-colors text-white py-2.5 rounded-xl font-bold text-xs cursor-pointer shadow-xs">
                                    {t("Navigation.login")}
                                </button>
                            }
                        />
                    ) : (
                        <button
                            onClick={() => {
                                onClose();
                                logout?.();
                            }}
                            className="flex items-center justify-between text-error hover:bg-error/10 py-2.5 px-3 rounded-xl cursor-pointer w-full text-left font-semibold text-xs border border-error/20"
                        >
                            <span>{t("Navigation.logoutAccount")}</span>
                            <LogOut className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
