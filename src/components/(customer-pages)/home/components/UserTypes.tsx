'use client';

import { Briefcase, Store, Truck, User } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

const UserTypes = () => {
    const t = useTranslations('Home.userTypes');

    const userTypes = [
        {
            id: 'customer',
            icon: User,
            iconBg: 'bg-primary text-white',
            title: t('customerTitle'),
            subtitle: t('customerSubtitle'),
            cta: t('customerCta'),
            href: '/shop',
            btnStyle: 'bg-primary hover:bg-primary-hover text-white shadow-xs',
        },
        {
            id: 'vendor',
            icon: Store,
            iconBg: 'bg-primary text-white',
            title: t('vendorTitle'),
            subtitle: t('vendorSubtitle'),
            cta: t('vendorCta'),
            href: '/vendor/register',
            btnStyle: 'bg-primary hover:bg-primary/90 text-white shadow-xs',
        },
        {
            id: 'provider',
            icon: Briefcase,
            iconBg: 'bg-primary text-white',
            title: t('providerTitle'),
            subtitle: t('providerSubtitle'),
            cta: t('providerCta'),
            href: '/provider/register',
            btnStyle: 'bg-primary hover:bg-primary-hover text-white shadow-xs',
        },
        {
            id: 'driver',
            icon: Truck,
            iconBg: 'bg-primary text-white',
            title: t('driverTitle'),
            subtitle: t('driverSubtitle'),
            cta: t('driverCta'),
            href: '/driver/register',
            btnStyle: 'bg-primary hover:bg-primary/90 text-white shadow-xs',
        },
    ] as const;

    return (
        <section className="bg-background mb-3 md:mb-4 ">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                    {userTypes.map(({ id, icon: Icon, iconBg, title, subtitle, cta, href, btnStyle }) => (
                        <div
                            key={id}
                            className="flex flex-col items-center text-center lg:flex-row lg:items-center lg:text-start gap-3 lg:gap-4 bg-secondary  hover:border-primary/60 rounded-2xl p-4 md:p-5 transition-all duration-300 group shadow-xs hover:shadow-md"
                        >
                            <div className={`${iconBg} w-10 h-10 lg:w-14 lg:h-14 rounded-xl flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform duration-300`}>
                                <Icon className="w-5 h-5 lg:w-6 lg:h-6" strokeWidth={2} />
                            </div>
                            <div className="flex flex-col items-center lg:items-start gap-2 min-w-0 w-full">
                                <div>
                                    <h3 className="text-foreground font-bold text-sm md:text-base lg:text-base leading-tight">{title}</h3>
                                    <p className="text-foreground/80 text-xs mt-0.5 leading-snug">{subtitle}</p>
                                </div>
                                <Link
                                    href={href}
                                    className={`inline-flex items-center justify-center px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${btnStyle}`}
                                >
                                    {cta}
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default UserTypes;
