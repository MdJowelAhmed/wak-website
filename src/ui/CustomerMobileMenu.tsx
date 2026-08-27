// src/ui/CustomerMobileMenu.tsx
'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import NavLinks from '@/ui/NavLinks';
import AuthModal from '@/components/(auth-pages)';
import SearchBar from '@/ui/SearchBar';
import LanguageSelector from '@/ui/LanguageSelector';

interface CustomerMobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    isLoggedIn: boolean;
    userMode: string;
}

export default function CustomerMobileMenu({ isOpen, onClose, isLoggedIn, userMode }: CustomerMobileMenuProps) {
    if (!isOpen) return null;

    return (
        <div className="xl:hidden py-6 border-t border-zinc-800 bg-[#111111] animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col gap-6 px-6">
                <div className="md:hidden">
                    <SearchBar
                        placeholder="Search Product"
                        inputClassName="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-3 pl-12 pr-4 text-sm text-white outline-none"
                    />
                </div>

                <div onClick={onClose}>
                    <NavLinks userMode={userMode} />
                </div>

                <div className="pt-6 border-t border-zinc-800 flex flex-col gap-4">
                    {!isLoggedIn ? (
                        <AuthModal
                            trigger={
                                <button className="w-full bg-primary transition-colors text-white py-3 rounded-lg font-medium cursor-pointer">
                                    Login / Sign Up
                                </button>
                            }
                        />
                    ) : (
                        <Link href="/profile" onClick={onClose} className="flex items-center justify-between text-white py-2 cursor-pointer">
                            <span className="text-sm font-medium">My Profile</span>
                            <div className="w-8 h-8 rounded-full overflow-hidden border border-zinc-700">
                                <img src="https://i.pravatar.cc/150?img=68" alt="Profile" className="w-full h-full object-cover" />
                            </div>
                        </Link>
                    )}

                    <Link href="/cart" onClick={onClose} className="flex items-center justify-between text-white py-2 cursor-pointer">
                        <span className="text-sm font-medium">My Cart</span>
                        <div className="relative">
                            <ShoppingCart className="w-6 h-6" />
                            <span className="absolute -top-2 -right-2 bg-red-600 text-[10px] w-5 h-5 flex items-center justify-center rounded-full">0</span>
                        </div>
                    </Link>

                    <LanguageSelector
                        className="flex items-center justify-between text-white py-2"
                        iconClassName="w-4 h-4 text-zinc-500"
                    />
                </div>
            </div>
        </div>
    );
}
