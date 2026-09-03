'use client';

import Link from 'next/link';
import { User, Store, Briefcase, Car } from 'lucide-react';

const userTypes = [
    {
        id: 'customer',
        icon: User,
        iconBg: 'bg-[#FF6700]',
        title: 'Customer',
        subtitle: 'Shop products & book services',
        cta: 'Shop Now',
        href: '/shop',
        btnStyle: 'bg-[#FF6700] hover:bg-[#FF6700]/90 text-white',
    },
    {
        id: 'vendor',
        icon: Store,
        iconBg: 'bg-[#3b1f11]',
        title: 'Vendor / Merchant',
        subtitle: 'Sell your products',
        cta: 'Join as Merchant',
        href: '/vendor/register',
        btnStyle: 'bg-[#3b1f11] hover:bg-[#2a1609] text-white border border-[#FF6700]/40',
    },
    {
        id: 'provider',
        icon: Briefcase,
        iconBg: 'bg-[#FF6700]',
        title: 'Service Provider',
        subtitle: 'Offer your services',
        cta: 'Join as Provider',
        href: '/provider/register',
        btnStyle: 'bg-[#FF6700] hover:bg-[#FF6700]/90 text-white',
    },
    {
        id: 'driver',
        icon: Car,
        iconBg: 'bg-[#3b1f11]',
        title: 'Driver',
        subtitle: 'Deliver & earn on your schedule',
        cta: 'Download App',
        href: '/driver/app',
        btnStyle: 'bg-[#3b1f11] hover:bg-[#2a1609] text-white border border-[#FF6700]/40',
    },
];

const UserTypes = () => {
    return (
        <section className="bg-[#4f2c1d] py-8 md:pt-12 pb-0">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                    {userTypes.map(({ id, icon: Icon, iconBg, title, subtitle, cta, href, btnStyle }) => (
                        <div
                            key={id}
                            className="flex flex-col items-center text-center lg:flex-row lg:items-center lg:text-left gap-3 lg:gap-4 bg-white/8 hover:bg-white/12 border border-white/10 hover:border-[#FF6700]/40 rounded-2xl p-4 md:p-5 transition-all duration-300 group"
                        >
                            {/* Icon circle */}
                            <div className={`${iconBg} w-12 h-12 lg:w-16 lg:h-16 rounded-full flex items-center justify-center shrink-0 shadow-lg group-hover:scale-105 transition-transform duration-300`}>
                                <Icon className="w-5 h-5 lg:w-7 lg:h-7 text-white" strokeWidth={1.8} />
                            </div>

                            {/* Text + CTA */}
                            <div className="flex flex-col items-center lg:items-start gap-2 min-w-0 w-full">
                                <div>
                                    <h3 className="text-white font-bold text-sm md:text-base lg:text-lg leading-tight">{title}</h3>
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
