// components/Navbar.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import NavLinks from '@/ui/NavLinks';
import { useAuth } from '@/hooks/use-auth';
import Logo from '@/ui/Logo';
import CartButton from '@/ui/CartButton';
import UserAuthMenu from '@/ui/UserAuthMenu';
import SearchBar from '@/ui/SearchBar';
import LanguageSelector from '@/ui/LanguageSelector';
import BrowseCategoriesButton from '@/ui/BrowseCategoriesButton';
import CustomerMobileMenu from '@/ui/CustomerMobileMenu';

interface NavbarProps {
    userMode?: string;
}

export default function Navbar({ userMode = 'customer' }: NavbarProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { isLoggedIn, logout } = useAuth();

    return (
        <div className="text-white z-50 w-full bg-[#4f2c1d]">
            {/* Line 1: Top Bar */}
            <div className="container mx-auto px-6 h-16 flex items-center justify-between gap-8">
                <Logo />

                <div className="hidden md:flex flex-1 max-w-2xl mx-auto">
                    <SearchBar placeholder="Search Product" />
                </div>

                <div className="hidden sm:block">
                    <LanguageSelector />
                </div>

                <button
                    className="xl:hidden text-2xl text-white cursor-pointer"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle Mobile Menu"
                >
                    {isMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Line 2: Navigation Bar */}
            <div className="hidden xl:block ">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between gap-8">
                    <BrowseCategoriesButton />

                    <div className="flex-1 flex justify-center">
                        <NavLinks userMode={userMode} />
                    </div>

                    <div className="flex items-center gap-6 shrink-0">
                        <CartButton />
                        <UserAuthMenu isLoggedIn={isLoggedIn} logout={logout} />
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <CustomerMobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} isLoggedIn={isLoggedIn} userMode={userMode} />
            )}
        </div>
    );
}