'use client';

import { useState, useEffect } from 'react';
import { Menu, X, MapPin, Globe, Truck, HelpCircle, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import NavLinks from '@/ui/NavLinks';
import { useAuth } from '@/hooks/use-auth';
import Logo from '@/ui/Logo';
import CartButton from '@/ui/CartButton';
import WishlistButton from '@/ui/WishlistButton';
import UserAuthMenu from '@/ui/UserAuthMenu';
import SearchBar from '@/ui/SearchBar';
import CustomerMobileMenu from '@/ui/CustomerMobileMenu';
import LocationModal from '@/ui/LocationModal';
import LanguageRegionModal, { languagesList } from '@/ui/LanguageRegionModal';
import { useCurrency } from '@/hooks/use-currency';

interface NavbarProps {
    userMode?: string;
}

export default function Navbar({ userMode = 'customer' }: NavbarProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLocationOpen, setIsLocationOpen] = useState(false);
    const [isLangOpen, setIsLangOpen] = useState(false);

    const [currentLocation, setCurrentLocation] = useState('Lilongwe, 20100');
    const [currentLang, setCurrentLang] = useState('en');

    const { isLoggedIn, logout } = useAuth();
    const { country, currency, rate, setCountry } = useCurrency();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedLang = localStorage.getItem('user_language');
            const savedLoc = localStorage.getItem('user_location');

            if (savedLang) setCurrentLang(savedLang);
            if (savedLoc) setCurrentLocation(savedLoc);
        }
    }, []);

    const handleSelectLocation = (loc: string) => {
        setCurrentLocation(loc);
        if (typeof window !== 'undefined') {
            localStorage.setItem('user_location', loc);
        }
    };

    const activeLangObj = languagesList.find((l) => l.code === currentLang) || languagesList[0];

    return (
        <header className="sticky top-0 z-50 w-full shadow-sm">
            {/* 1. Top Utility Navigation Bar */}
            <div className="bg-secondary border-b border-border/20 py-1.5 px-4 sm:px-6 text-xs text-body-text font-medium">
                <div className="container mx-auto flex items-center justify-between gap-4">
                    {/* Left: Deliver to Location Control */}
                    <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-accent-foreground shrink-0" />
                        <span className="hidden sm:inline text-accent-foreground">Deliver to:</span>
                        <button
                            onClick={() => setIsLocationOpen(true)}
                            className="font-bold text-accent-foreground hover:text-accent-foreground transition-colors cursor-pointer flex items-center gap-1"
                        >
                            <span>{currentLocation}</span>
                            <span className="text-[10px] text-accent-foreground underline ml-1 font-semibold">
                                (Update Location)
                            </span>
                        </button>
                    </div>

                    {/* Right: Quick Links & Language/Region Selector */}
                    <div className="flex items-center gap-4 sm:gap-6 shrink-0">
                        {/* Language & Region Selector Trigger + Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setIsLangOpen(!isLangOpen)}
                                className="flex items-center gap-1.5 hover:text-accent-foreground transition-colors cursor-pointer text-accent-foreground font-semibold py-0.5"
                                aria-label="Change Language and Currency"
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
                                currentLang={currentLang}
                                currentCountry={country.code}
                                onSelectLanguage={setCurrentLang}
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
                            <span>Support</span>
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
                        <SearchBar placeholder="Search products, services & categories..." />
                    </div>

                    {/* Nav Links — xl screens */}
                    <div className="hidden lg:flex items-center">
                        <NavLinks userMode={userMode} />
                    </div>

                    {/* Action Icons */}
                    <div className="ml-auto flex items-center gap-2.5 sm:gap-4 shrink-0">
                        {/* <WishlistButton /> */}
                        <CartButton />
                        <UserAuthMenu isLoggedIn={isLoggedIn} logout={logout} />

                        {/* Mobile Hamburger */}
                        <button
                            className="lg:hidden text-foreground cursor-pointer p-2 rounded-xl border border-border hover:bg-section-bg transition-colors ml-1"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-label="Toggle Mobile Menu"
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
                    currentLocation={currentLocation}
                    onOpenLocationModal={() => setIsLocationOpen(true)}
                    onOpenLangModal={() => setIsLangOpen(true)}
                    currentCurrencyLabel={`${country.flag} ${currency}`}
                    currentLangName={activeLangObj.name}
                />
            )}
        </header>
    );
}