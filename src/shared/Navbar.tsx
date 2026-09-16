'use client';

import { useState, useEffect } from 'react';
import { Menu, X, MapPin, HelpCircle, ChevronDown } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import NavLinks from '@/ui/NavLinks';
import { useAuth } from '@/hooks/use-auth';
import Logo from '@/ui/Logo';
import CartButton from '@/ui/CartButton';
import UserAuthMenu from '@/ui/UserAuthMenu';
import SearchBar from '@/ui/SearchBar';
import CustomerMobileMenu from '@/ui/CustomerMobileMenu';
import LocationModal from '@/ui/LocationModal';
import LanguageRegionModal, { languagesList } from '@/ui/LanguageRegionModal';
import { useCurrency } from '@/hooks/use-currency';
import {
    readDeliveryLocation,
    shoppingCountryShortName,
    writeDeliveryLocation,
    type DeliveryLocation,
} from '../../helpers/delivery-location';

interface NavbarProps {
    userMode?: string;
}

export default function Navbar({ userMode = 'customer' }: NavbarProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLocationOpen, setIsLocationOpen] = useState(false);
    const [isLangOpen, setIsLangOpen] = useState(false);

    const [currentLocation, setCurrentLocation] = useState<DeliveryLocation | null>(null);
    const locale = useLocale();
    const t = useTranslations();

    const { isLoggedIn, logout } = useAuth();
    const { country, currency, rate, setCountry } = useCurrency();
    const deliveryLabel = currentLocation?.label || shoppingCountryShortName(country.code);

    useEffect(() => {
        setCurrentLocation(readDeliveryLocation());
        localStorage.setItem('user_language', locale);
    }, [locale]);

    const handleSelectLocation = (location: DeliveryLocation) => {
        setCurrentLocation(location);
        writeDeliveryLocation(location);
    };

    const activeLangObj = languagesList.find((l) => l.code === locale) || languagesList[0];

    return (
        <header className="sticky top-0 z-50 w-full shadow-sm">
            {/* 1. Top Utility Navigation Bar */}
            <div className="bg-secondary border-b border-border/20 py-1.5 px-4 sm:px-6 text-xs text-body-text font-medium">
                <div className="container mx-auto flex items-center justify-between gap-4">
                    {/* Left: Deliver to Location Control */}
                    <button
                        type="button"
                        onClick={() => setIsLocationOpen(true)}
                        className="flex min-w-0 items-center gap-1.5 text-left text-accent-foreground transition-colors cursor-pointer hover:opacity-90"
                    >
                        <MapPin className="w-4 h-4 shrink-0" />
                        <span className="flex min-w-0 flex-col leading-tight">
                            <span className="text-[11px] font-medium text-accent-foreground/80">
                                {t("Navbar.deliverTo")}
                            </span>
                            <span className="max-w-[160px] truncate text-xs font-bold sm:max-w-[240px]">
                                {deliveryLabel}
                            </span>
                        </span>
                    </button>

                    {/* Right: Quick Links & Language/Region Selector */}
                    <div className="flex items-center gap-4 sm:gap-6 shrink-0">
                        {/* Language & Region Selector Trigger + Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setIsLangOpen(!isLangOpen)}
                                className="flex items-center gap-1.5 hover:text-accent-foreground transition-colors cursor-pointer text-accent-foreground font-semibold py-0.5"
                                aria-label={t("Navbar.languageCurrency")}
                            >
                                <span>{country.flag}</span>
                                <span>{currency}</span>
                                <span className="hidden sm:inline text-accent-foreground/80 font-medium">
                                    {rate.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                                </span>
                                <span className="text-border">|</span>
                                <span>{activeLangObj.name}</span>
                                <ChevronDown className={`w-3 h-3 text-accent-foreground/70 transition-transform duration-200 ${isLangOpen ? 'rotate-180' : ''}`} />
                            </button>

                            <LanguageRegionModal
                                isOpen={isLangOpen}
                                onClose={() => setIsLangOpen(false)}
                                currentLang={locale}
                                currentCountry={country.code}
                                onSelectLanguage={() => undefined}
                                onSelectCountry={setCountry}
                            />
                        </div>

                        {/* <Link
                            href="/profile"
                            className="hidden md:flex items-center gap-1 text-accent-foreground transition-colors"
                        >
                            <Truck className="w-3.5 h-3.5 text-accent-foreground" />
                            <span>Track Order</span>
                        </Link> */}

                        <Link
                            href="/contact-us"
                            className="hidden sm:flex items-center gap-1 text-accent-foreground transition-colors"
                        >
                            <HelpCircle className="w-3.5 h-3.5 text-accent-foreground" />
                            <span>{t("Navigation.support")}</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* 2. Main Header Bar */}
            <div className="bg-secondary  py-3 px-4 sm:px-6">
                <div className="container mx-auto flex items-center justify-between gap-4 lg:gap-6">
                    {/* Logo & Tagline */}
                    <Logo />

                    {/* All Categories & Search Bar */}
                    <div className="hidden md:flex flex-1 max-w-2xl mx-2">
                        <SearchBar placeholder={t("Navbar.searchPlaceholder")} />
                    </div>

                    {/* Nav Links — xl screens */}
                    <div className="hidden lg:flex items-center">
                        <NavLinks userMode={userMode} />
                    </div>

                    {/* Action Icons */}
                    <div className="ms-auto flex items-center gap-2.5 sm:gap-4 shrink-0">
                        {/* <WishlistButton /> */}
                        <CartButton />
                        <UserAuthMenu isLoggedIn={isLoggedIn} logout={logout} />

                        {/* Mobile Hamburger */}
                        <button
                            className="lg:hidden text-foreground cursor-pointer p-2 rounded-xl border border-border hover:bg-section-bg transition-colors ms-1"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-label={t("Navbar.toggleMenu")}
                        >
                            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Modals & Slide-out Menus */}
            <LocationModal
                isOpen={isLocationOpen}
                onClose={() => setIsLocationOpen(false)}
                countryCode={country.code}
                currentLocation={currentLocation}
                onSelectLocation={handleSelectLocation}
            />

            {isMenuOpen && (
                <CustomerMobileMenu
                    isOpen={isMenuOpen}
                    onClose={() => setIsMenuOpen(false)}
                    isLoggedIn={isLoggedIn}
                    logout={logout}
                    userMode={userMode}
                    currentLocation={deliveryLabel}
                    onOpenLocationModal={() => setIsLocationOpen(true)}
                    onOpenLangModal={() => setIsLangOpen(true)}
                    currentCurrencyLabel={`${country.flag} ${currency}`}
                    currentLangName={activeLangObj.name}
                />
            )}
        </header>
    );
}