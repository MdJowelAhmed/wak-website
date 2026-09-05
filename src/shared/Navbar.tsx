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
import LanguageRegionModal, { countriesList, languagesList } from '@/ui/LanguageRegionModal';

interface NavbarProps {
    userMode?: string;
}

export default function Navbar({ userMode = 'customer' }: NavbarProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLocationOpen, setIsLocationOpen] = useState(false);
    const [isLangOpen, setIsLangOpen] = useState(false);

    const [currentLocation, setCurrentLocation] = useState('Lilongwe, 20100');
    const [currentLang, setCurrentLang] = useState('en');
    const [currentCountry, setCurrentCountry] = useState('MW');

    const { isLoggedIn, logout } = useAuth();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedLang = localStorage.getItem('user_language');
            const savedCountry = localStorage.getItem('user_country');
            const savedLoc = localStorage.getItem('user_location');

            if (savedLang) setCurrentLang(savedLang);
            if (savedCountry) setCurrentCountry(savedCountry);
            if (savedLoc) setCurrentLocation(savedLoc);
        }
    }, []);

    const handleSelectLocation = (loc: string) => {
        setCurrentLocation(loc);
        if (typeof window !== 'undefined') {
            localStorage.setItem('user_location', loc);
        }
    };

    const activeCountryObj = countriesList.find((c) => c.code === currentCountry) || countriesList[0];
    const activeLangObj = languagesList.find((l) => l.code === currentLang) || languagesList[0];

    return (
        <header className="sticky top-0 z-50 w-full shadow-sm">
            {/* 1. Top Utility Navigation Bar */}
            <div className="bg-section-bg border-b border-border py-1.5 px-4 sm:px-6 text-xs text-body-text font-medium">
                <div className="container mx-auto flex items-center justify-between gap-4">
                    {/* Left: Deliver to Location Control */}
                    <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span className="hidden sm:inline">Deliver to:</span>
                        <button
                            onClick={() => setIsLocationOpen(true)}
                            className="font-bold text-foreground hover:text-primary transition-colors cursor-pointer flex items-center gap-1"
                        >
                            <span>{currentLocation}</span>
                            <span className="text-[10px] text-primary underline ml-1 font-semibold">
                                (Update Location)
                            </span>
                        </button>
                    </div>

                    {/* Right: Quick Links & Language/Region Selector */}
                    <div className="flex items-center gap-4 sm:gap-6 shrink-0">
                        {/* Language & Region Selector Trigger */}
                        <button
                            onClick={() => setIsLangOpen(true)}
                            className="flex items-center gap-1.5 hover:text-primary transition-colors cursor-pointer text-foreground font-semibold"
                        >
                            <span>{activeCountryObj.flag}</span>
                            <span>{activeCountryObj.code}</span>
                            <span className="text-border">|</span>
                            <span>{activeLangObj.name}</span>
                            <ChevronDown className="w-3 h-3 text-body-text" />
                        </button>

                        <Link
                            href="/profile"
                            className="hidden md:flex items-center gap-1 hover:text-primary transition-colors"
                        >
                            <Truck className="w-3.5 h-3.5 text-primary" />
                            <span>Track Order</span>
                        </Link>

                        <Link
                            href="/contact-us"
                            className="hidden sm:flex items-center gap-1 hover:text-primary transition-colors"
                        >
                            <HelpCircle className="w-3.5 h-3.5 text-primary" />
                            <span>Support</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* 2. Main Header Bar */}
            <div className="bg-card/95 backdrop-blur-md border-b border-border py-3 px-4 sm:px-6">
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
                        <WishlistButton />
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

            <LanguageRegionModal
                isOpen={isLangOpen}
                onClose={() => setIsLangOpen(false)}
                currentLang={currentLang}
                currentCountry={currentCountry}
                onSelectLanguage={setCurrentLang}
                onSelectCountry={setCurrentCountry}
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
                />
            )}
        </header>
    );
}