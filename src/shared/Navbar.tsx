'use client';

import { useState, useEffect, useCallback } from 'react';
import { Menu, X, MapPin, HelpCircle, ChevronDown, ShoppingBag } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import { AnimatePresence } from 'framer-motion';
import { myFetch } from '../../helpers/myFetch';
import {
    defaultShippingAddress,
    mapShippingAddresses,
    shippingAddressLabel,
    type ShippingAddress,
} from '../../helpers/shipping-address';
import NavLinks from '@/ui/NavLinks';
import { useAuth } from '@/hooks/use-auth';
import Logo from '@/ui/Logo';
import CartButton from '@/ui/CartButton';
import UserAuthMenu from '@/ui/UserAuthMenu';
import SearchBar from '@/ui/SearchBar';
import CustomerMobileMenu from '@/ui/CustomerMobileMenu';
import LocationModal from '@/ui/LocationModal';
import LanguageRegionModal, { languagesList } from '@/ui/LanguageRegionModal';
import Flag from '@/ui/Flag';
import { useCurrency } from '@/hooks/use-currency';
import {
    readDeliveryLocation,
    shoppingCountryShortName,
    writeDeliveryLocation,
    type DeliveryLocation,
} from '../../helpers/delivery-location';
import Image from 'next/image';

interface NavbarProps {
    userMode?: string;
    initialShippingAddresses?: ShippingAddress[];
}

export default function Navbar({
    userMode = 'customer',
    initialShippingAddresses = [],
}: NavbarProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLocationOpen, setIsLocationOpen] = useState(false);
    const [isLangOpen, setIsLangOpen] = useState(false);
    const [addresses, setAddresses] = useState(initialShippingAddresses);
    const [currentLocation, setCurrentLocation] = useState<DeliveryLocation | null>(null);
    const locale = useLocale();
    const t = useTranslations();
    const router = useRouter();

    const { isLoggedIn, isLoading: authLoading, logout } = useAuth();
    const { country, currency, setCountry } = useCurrency();
    const defaultAddress = defaultShippingAddress(addresses);
    const deliveryLabel =
        (defaultAddress && shippingAddressLabel(defaultAddress)) ||
        currentLocation?.label ||
        shoppingCountryShortName(country.code);

    const addressSyncKey = initialShippingAddresses
        .map((address) => `${address._id}:${Number(address.isDefault)}:${address.address}`)
        .join(",");

    useEffect(() => {
        setAddresses(initialShippingAddresses);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [addressSyncKey]);

    useEffect(() => {
        setCurrentLocation(readDeliveryLocation());
        localStorage.setItem('user_language', locale);
    }, [locale]);

    useEffect(() => {
        const refreshAddresses = async () => {
            if (!isLoggedIn) {
                setAddresses([]);
                return;
            }
            const res = await myFetch('/shipping-addresses', { cache: 'no-store' });
            setAddresses(mapShippingAddresses(res?.data));
        };

        window.addEventListener('auth-change', refreshAddresses);
        return () => window.removeEventListener('auth-change', refreshAddresses);
    }, [isLoggedIn]);

    const handleSelectLocation = useCallback((location: DeliveryLocation) => {
        setCurrentLocation(location);
        writeDeliveryLocation(location);
    }, []);

    const handleAddressesChange = useCallback((next: ShippingAddress[]) => {
        setAddresses(next);
        router.refresh();
    }, [router]);

    const handleCloseLocation = useCallback(() => setIsLocationOpen(false), []);
    const handleCloseLang = useCallback(() => setIsLangOpen(false), []);
    const handleCloseMenu = useCallback(() => setIsMenuOpen(false), []);

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
                                <Flag countryCode={country.code} loading="eager" />
                                <span>{currency}</span>
                                <span className="text-border">|</span>
                                <span>{activeLangObj.name}</span>
                                <ChevronDown className={`w-3 h-3 text-accent-foreground/70 transition-transform duration-200 ${isLangOpen ? 'rotate-180' : ''}`} />
                            </button>

                            <LanguageRegionModal
                                isOpen={isLangOpen}
                                onClose={handleCloseLang}
                                currentLang={locale}
                                currentCountry={country.code}
                                onSelectLanguage={() => undefined}
                                onSelectCountry={setCountry}
                            />
                        </div>

                        {isLoggedIn && (
                            <Link
                                href="/profile/orders"
                                className="hidden sm:flex items-center gap-1 text-accent-foreground transition-colors hover:opacity-90"
                            >
                                <ShoppingBag className="w-3.5 h-3.5 text-accent-foreground" />
                                <span>{t("Profile.sidebar.orders")}</span>
                            </Link>
                        )}

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
                    {/* <Logo /> */}

                    <Link href="/">
                        <Image
                            src="/logo.png"
                            alt="Logo"
                            width={70}
                            height={70}
                            className='rounded-full object-cover h-[70px] w-[70px]'
                        /></Link>

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
                        <UserAuthMenu
                            isLoggedIn={isLoggedIn}
                            isLoading={authLoading}
                            logout={logout}
                        />

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
                onClose={handleCloseLocation}
                countryCode={country.code}
                currentLocation={currentLocation}
                onSelectLocation={handleSelectLocation}
                addresses={addresses}
                onAddressesChange={handleAddressesChange}
                isLoggedIn={isLoggedIn}
            />

            <AnimatePresence>
                {isMenuOpen && (
                    <CustomerMobileMenu
                        isOpen={isMenuOpen}
                        onClose={handleCloseMenu}
                        isLoggedIn={isLoggedIn}
                        logout={logout}
                        userMode={userMode}
                        currentLocation={deliveryLabel}
                        onOpenLocationModal={() => setIsLocationOpen(true)}
                        onOpenLangModal={() => setIsLangOpen(true)}
                        currentCurrencyLabel={
                            <>
                                <Flag countryCode={country.code} className="align-middle" />
                                {currency}
                            </>
                        }
                        currentLangName={activeLangObj.name}
                    />
                )}
            </AnimatePresence>
        </header>
    );
}