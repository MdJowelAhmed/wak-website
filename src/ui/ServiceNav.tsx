// src/ui/ServiceNav.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export type NavItem = {
    name: string;
    href: string;
};

export const serviceNavItems: NavItem[] = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'Contact Us', href: '/contact-us' },
];

export default function ServiceNav() {
    const pathname = usePathname();

    return (
        <nav className="hidden lg:flex items-center gap-8">
            {serviceNavItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                    <Link
                        key={item.name}
                        href={item.href}
                        className={`hover:text-primary transition-colors duration-200 font-medium text-sm cursor-pointer ${isActive ? 'text-primary' : 'text-white'
                            }`}
                    >
                        {item.name}
                    </Link>
                );
            })}
        </nav>
    );
}
