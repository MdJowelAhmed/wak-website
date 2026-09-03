// components/NavLinks.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type NavLink = {
    name: string;
    href: string;
};


const navLinks: NavLink[] = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/shop' },
    { name: 'Services', href: '/services' },
    { name: 'Contact Us', href: '/contact-us' },
];


export default function NavLinks({ userMode }: { userMode: string }) {
    const pathname = usePathname();
    const navItems = navLinks;
    return (
        <nav className="flex flex-col xl:flex-row items-stretch xl:items-center gap-1 xl:gap-1 w-full xl:w-auto">
            {navItems.map((link) => {
                const isActive = pathname === link.href;
                return (
                    <Link
                        key={link.name}
                        href={link.href}
                        className={`relative px-3 py-2 xl:py-1.5 text-sm font-medium rounded-md transition-all duration-200
                            border-b border-white/5 xl:border-0
                            ${isActive
                                ? 'text-white xl:text-white'
                                : 'text-white/70 hover:text-white hover:bg-white/10 xl:hover:bg-white/10'
                            }`}
                    >
                        {link.name}
                        {/* Active underline indicator — desktop only */}
                        {isActive && (
                            <span className="hidden xl:block absolute bottom-0 left-3 right-3 h-0.5 bg-[#FF6700] rounded-full" />
                        )}
                    </Link>
                );
            })}
        </nav>
    );
}