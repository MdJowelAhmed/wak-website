// src/ui/ServiceMobileMenu.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SearchBar from '@/ui/SearchBar';
import { serviceNavItems } from '@/ui/ServiceNav';

interface ServiceMobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ServiceMobileMenu({ isOpen, onClose }: ServiceMobileMenuProps) {
    const pathname = usePathname();

    if (!isOpen) return null;

    return (
        <div className="lg:hidden py-6 border-t border-zinc-800 bg-[#111111] animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col gap-6 px-6">
                <div className="md:hidden">
                    <SearchBar
                        placeholder="Search for any service.."
                        inputClassName="w-full bg-[#1c1c1c] border border-zinc-800 rounded-lg py-3 pl-12 pr-4 text-sm text-white outline-none"
                    />
                </div>

                <div className="flex flex-col gap-4 border-b border-zinc-800 pb-6">
                    {serviceNavItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={onClose}
                                className={`py-2 font-medium transition-colors ${
                                    isActive ? 'text-[#FF6700]' : 'text-white'
                                }`}
                            >
                                {item.name}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
