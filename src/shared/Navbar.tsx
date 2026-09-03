// components/Navbar.tsx
'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import NavLinks from '@/ui/NavLinks';
import { useAuth } from '@/hooks/use-auth';
import Logo from '@/ui/Logo';
import CartButton from '@/ui/CartButton';
import UserAuthMenu from '@/ui/UserAuthMenu';
import SearchBar from '@/ui/SearchBar';
import CustomerMobileMenu from '@/ui/CustomerMobileMenu';

interface NavbarProps {
    userMode?: string;
}

export default function Navbar({ userMode = 'customer' }: NavbarProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { isLoggedIn, logout } = useAuth();

    return (
        <header className="sticky top-0 z-50 w-full bg-[#4f2c1d]/95 backdrop-blur-md border-b border-white/10 shadow-lg shadow-black/20">
            <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center gap-4 xl:gap-6">

                {/* Logo */}
                <Logo />

                {/* Search Bar — hidden on small, visible from md */}
                <div className="hidden md:flex flex-1 max-w-xl">
                    <SearchBar placeholder="Search Product or service" />
                </div>

                {/* Nav Links — only on xl+ */}
                <div className="hidden xl:flex items-center ml-2">
                    <NavLinks userMode={userMode} />
                </div>

                {/* Right side actions */}
                <div className="ml-auto flex items-center gap-3 xl:gap-4 shrink-0">
                    <CartButton />
                    <UserAuthMenu isLoggedIn={isLoggedIn} logout={logout} />
                </div>

                {/* Mobile hamburger */}
                <button
                    className="xl:hidden text-white cursor-pointer p-1.5 rounded-md hover:bg-white/10 transition-colors"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle Mobile Menu"
                >
                    {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <CustomerMobileMenu
                    isOpen={isMenuOpen}
                    onClose={() => setIsMenuOpen(false)}
                    isLoggedIn={isLoggedIn}
                    logout={logout}
                    userMode={userMode}
                />
            )}
        </header>
    );
}