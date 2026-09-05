'use client';

import Link from 'next/link';
import { User, Store, Briefcase, Car } from 'lucide-react';

const userTypes = [
    {
        id: 'customer',
        icon: User,
        iconBg: 'bg-primary',
        title: 'Customer',
        subtitle: 'Shop products & book services',
        cta: 'Shop Now',
        href: '/shop',
        btnStyle: 'bg-primary hover:bg-primary-hover text-white',
    },
    {
        id: 'vendor',
        icon: Store,
        iconBg: 'bg-card',
        title: 'Vendor / Merchant',
        subtitle: 'Sell your products',
        cta: 'Join as Merchant',
        href: '/vendor/register',
        btnStyle: 'bg-card hover:bg-card/80 text-white border border-primary/40',
    },
    {
        id: 'provider',
        icon: Briefcase,
        iconBg: 'bg-primary',
        title: 'Service Provider',
        subtitle: 'Offer your services',
        cta: 'Join as Provider',
        href: '/provider/register',
        btnStyle: 'bg-primary hover:bg-primary-hover text-white',
    },
    {
        id: 'driver',
        icon: Car,
        iconBg: 'bg-card',
        title: 'Driver',
        subtitle: 'Deliver & earn on your schedule',
        cta: 'Download App',
        href: '/driver/app',
        btnStyle: 'bg-card hover:bg-card/80 text-white border border-primary/40',
    },
];

const UserTypes = () => {
    return (
        <section className="bg-background py-8 md:pt-12 pb-0">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                    {userTypes.map(({ id, icon: Icon, iconBg, title, subtitle, cta, href, btnStyle }) => (
                        <div
                            key={id}
                            className="flex flex-col items-center text-center lg:flex-row lg:items-center lg:text-left gap-2 lg:gap-4 bg-white/8 hover:bg-white/12 border border-white/10 hover:border-[#FF6700]/40 rounded-2xl p-2 md:p-5 transition-all duration-300 group"
                        >
                            {/* Icon circle */}
                            <div className={`${iconBg} w-10 h-10 lg:w-16 lg:h-16 rounded-full flex items-center justify-center shrink-0 shadow-lg group-hover:scale-105 transition-transform duration-300`}>
                                <Icon className="w-5 h-5 lg:w-7 lg:h-7 text-white" strokeWidth={1.8} />
                            </div>

                            {/* Text + CTA */}
                            <div className="flex flex-col items-center lg:items-start gap-1 md:gap-2 min-w-0 w-full">
                                <div>
                                    <h3 className="text-white font-medium md:font-bold text-xs md:text-base lg:text-lg leading-tight">{title}</h3>
                                    <p className="text-white/60 text-xs mt-0.5 leading-snug">{subtitle}</p>
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
