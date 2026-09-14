'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';

const navHrefs = [
    { key: 'home', href: '/' },
    { key: 'products', href: '/shop' },
    { key: 'services', href: '/services' },
    { key: 'contact', href: '/contact-us' },
] as const;

export default function NavLinks({ userMode }: { userMode: string }) {
    const pathname = usePathname();
    const t = useTranslations('Navigation');
    const navItems = navHrefs;

    void userMode;

    return (
        <nav className="flex flex-col xl:flex-row items-stretch xl:items-center gap-1 xl:gap-1 w-full xl:w-auto">
            {navItems.map((link) => {
                const isActive = pathname === link.href;
                return (
                    <Link
                        key={link.key}
                        href={link.href}
                        className={`relative px-3.5 py-2 xl:py-1.5 text-sm font-semibold rounded-lg transition-all duration-200
                            ${isActive
                                ? 'text-accent-foreground bg-primary'
                                : 'text-foreground hover:text-primary hover:bg-section-bg'
                            }`}
                    >
                        {t(link.key)}
                        {isActive && (
                            <span className="hidden xl:block absolute -bottom-1 start-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
                        )}
                    </Link>
                );
            })}
        </nav>
    );
}
