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
        <nav className="flex flex-col xl:flex-row items-stretch xl:items-center gap-2 xl:gap-8 w-full xl:w-auto">
            {navItems.map((link) => {
                const isActive = pathname === link.href;
                return (
                    <Link
                        key={link.name}
                        href={link.href}
                        className={`hover:text-primary transition-colors duration-200 font-normal text-sm py-2.5 xl:py-0 border-b border-white/5 xl:border-0 ${isActive ? 'text-primary font-medium' : 'text-white'}`}
                    >
                        {link.name}
                    </Link>
                );
            })}
        </nav>
    );
}