// src/ui/CustomerMobileMenu.tsx
'use client';

import type { ReactNode } from 'react';
import { motion, type Variants } from 'framer-motion';
import { LogOut, MapPin, Truck, HelpCircle, Globe, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import NavLinks from '@/ui/NavLinks';
import AuthModal from '@/components/(auth-pages)';
import SearchBar from '@/ui/SearchBar';
import Logo from '@/ui/Logo';

interface CustomerMobileMenuProps {
    isOpen?: boolean;
    onClose: () => void;
    isLoggedIn: boolean;
    userMode: string;
    logout?: () => void;
    currentLocation?: string;
    onOpenLocationModal?: () => void;
    onOpenLangModal?: () => void;
    currentCurrencyLabel?: ReactNode;
    currentLangName?: string;
}

const menuVariants: Variants = {
    hidden: {
        opacity: 0,
        height: 0,
        transition: {
            duration: 0.25,
            ease: "easeInOut",
            when: "afterChildren",
        },
    },
    visible: {
        opacity: 1,
        height: "auto",
        transition: {
            duration: 0.35,
            ease: "easeOut",
            when: "beforeChildren",
            staggerChildren: 0.04,
        },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: -8 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.2, ease: "easeOut" },
    },
};

export default function CustomerMobileMenu({
    onClose,
    isLoggedIn,
    userMode,
    logout,
    currentLocation = 'Malawi',
    onOpenLocationModal,
    onOpenLangModal,
    currentCurrencyLabel = '🇲🇼 MWK',
    currentLangName = 'English',
}: CustomerMobileMenuProps) {
    const t = useTranslations();

    return (
        <>
            {/* Blurred Backdrop Overlay covering the rest of the screen below the menu */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                onClick={onClose}
                className="fixed inset-0 z-[190] bg-black/60 backdrop-blur-sm xl:hidden cursor-pointer"
            />

            {/* Menu Container starting from top-0 taking dynamic content height */}
            <motion.div
                variants={menuVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="fixed top-0 left-0 right-0 w-full z-[200] xl:hidden bg-secondary shadow-2xl text-white overflow-hidden rounded-b-2xl max-h-[85vh] flex flex-col"
            >
                {/* Top Bar with Logo & Close Button */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-secondary shrink-0">
                    <Logo />
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 text-white/90 hover:text-white rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                        aria-label="Close menu"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Menu Body Content (Dynamic height, scrollable on smaller screens if needed) */}
                <div className="flex flex-col gap-4 px-5 py-6 overflow-y-auto max-h-[calc(85vh-70px)]">
                    {/* Mobile Search */}
                    <motion.div variants={itemVariants} className="md:hidden">
                        <SearchBar
                            placeholder={t("MobileMenu.searchPlaceholder")}
                            onClose={onClose}
                        />
                    </motion.div>

                    {/* Location Control Pill */}
                    <motion.div
                        variants={itemVariants}
                        onClick={() => {
                            onClose();
                            onOpenLocationModal?.();
                        }}
                        className="flex items-center justify-between p-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 cursor-pointer transition-colors"
                    >
                        <div className="flex items-center gap-2 text-xs font-semibold text-white">
                            <MapPin className="w-4 h-4 text-primary shrink-0" />
                            <span>{t("MobileMenu.deliverTo")} <strong className="text-primary">{currentLocation}</strong></span>
                        </div>
                        <span className="text-[10px] font-bold text-primary underline">{t("MobileMenu.change")}</span>
                    </motion.div>

                    {/* Main Navigation Links */}
                    <motion.div variants={itemVariants} onClick={onClose} className="py-2 border-y border-white/10">
                        <NavLinks userMode={userMode} />
                    </motion.div>

                    {/* Quick Utility Links */}
                    <motion.div variants={itemVariants} className="flex flex-col gap-3 text-xs font-medium text-white/90">
                        <button
                            onClick={() => {
                                onClose();
                                onOpenLangModal?.();
                            }}
                            className="flex items-center justify-between py-2 text-white/90 hover:text-primary transition-colors cursor-pointer text-left"
                        >
                            <div className="flex items-center gap-2">
                                <Globe className="w-4 h-4 text-primary shrink-0" />
                                <span>{t("MobileMenu.languageCountry")}</span>
                            </div>
                            <span className="inline-flex items-center gap-1.5 text-[11px] bg-white/10 text-white px-2.5 py-1 rounded-lg font-semibold border border-white/15">
                                {currentCurrencyLabel} / {currentLangName}
                            </span>
                        </button>

                        <Link href="/profile" onClick={onClose} className="flex items-center gap-2 py-2 text-white/90 hover:text-primary transition-colors">
                            <Truck className="w-4 h-4 text-primary shrink-0" />
                            <span>{t("Navigation.trackOrder")}</span>
                        </Link>

                        <Link href="/contact-us" onClick={onClose} className="flex items-center gap-2 py-2 text-white/90 hover:text-primary transition-colors">
                            <HelpCircle className="w-4 h-4 text-primary shrink-0" />
                            <span>{t("Navigation.supportHelp")}</span>
                        </Link>
                    </motion.div>

                    {/* Account & Cart Actions */}
                    <motion.div variants={itemVariants} className="pt-4 border-t border-white/10 flex flex-col gap-3">
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
                                className="flex items-center justify-between text-red-400 hover:bg-red-500/10 py-2.5 px-3.5 rounded-xl cursor-pointer w-full text-left font-semibold text-xs border border-red-500/20 transition-colors"
                            >
                                <span>{t("Navigation.logoutAccount")}</span>
                                <LogOut className="w-4 h-4" />
                            </button>
                        )}
                    </motion.div>
                </div>
            </motion.div>
        </>
    );
}
