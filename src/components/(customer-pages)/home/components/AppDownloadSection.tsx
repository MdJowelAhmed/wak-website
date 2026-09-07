'use client';

import { useState } from 'react';
import Image from 'next/image';
import { User, Store, Briefcase, Truck, CheckCircle2, Sparkles } from 'lucide-react';

const apps = [
    {
        id: 'customer',
        title: 'Customer App',
        badge: 'For Customers',
        icon: User,
        iconBg: 'bg-primary text-white',
        description: 'Shop products, book professional services, and track your orders in real-time.',
        features: ['Live Order Tracking', 'Multi-payment Support', 'Exclusive Deals'],
        appStoreUrl: 'https://apple.com',
        playStoreUrl: 'https://google.com',
        activeTabBg: 'bg-primary text-white shadow-md shadow-primary/20',
        screenImage: '/app-screens/customer-phone.png',
        screenAlt: 'Customer App Screen',
    },
    {
        id: 'merchant',
        title: 'Merchant App',
        badge: 'For Merchants',
        icon: Store,
        iconBg: 'bg-secondary text-white',
        description: 'Manage store inventory, process customer orders, and view sales analytics on the go.',
        features: ['Inventory Control', 'Batch Fulfillment', 'Instant Payouts'],
        appStoreUrl: 'https://apple.com',
        playStoreUrl: 'https://google.com',
        activeTabBg: 'bg-secondary text-white shadow-md shadow-secondary/20',
        screenImage: '/app-screens/dashboard-phone.png',
        screenAlt: 'Merchant Dashboard Overview',
    },
    {
        id: 'provider',
        title: 'Service Provider App',
        badge: 'For Service Providers',
        icon: Briefcase,
        iconBg: 'bg-primary text-white',
        description: 'Receive client bookings, manage appointment schedules, and build your service business.',
        features: ['Booking Calendar', 'Direct Client Messaging', 'Earnings Cashout'],
        appStoreUrl: 'https://apple.com',
        playStoreUrl: 'https://google.com',
        activeTabBg: 'bg-primary text-white shadow-md shadow-primary/20',
        screenImage: '/app-screens/dashboard-phone.png',
        screenAlt: 'Provider Dashboard Overview',
    },
    {
        id: 'driver',
        title: 'Driver App',
        badge: 'For Drivers',
        icon: Truck,
        iconBg: 'bg-secondary text-white',
        description: 'Accept delivery requests, navigate optimized routes, and earn money on your schedule.',
        features: ['Route Navigation', 'Weekly Earnings Tracker', '24/7 Delivery Support'],
        appStoreUrl: 'https://apple.com',
        playStoreUrl: 'https://google.com',
        activeTabBg: 'bg-secondary text-white shadow-md shadow-secondary/20',
        screenImage: '/app-screens/driver-phone.png',
        screenAlt: 'Driver App Screen',
    },
];

const AppleIcon = () => (
    <svg className="w-5 h-5 fill-current" viewBox="0 0 170 170">
        <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.34.13-9.14-1.9-14.4-6.09-3.48-2.82-7.44-7.53-11.88-14.13-7.41-11.01-13.06-23.82-16.94-38.44-3.88-14.62-5.83-28.52-5.83-41.7 0-15.65 3.73-28.86 11.2-39.62 7.46-10.76 17.1-16.27 28.91-16.52 4.47 0 9.48 1.18 15.03 3.54 5.56 2.37 9.38 3.55 11.47 3.55 1.86 0 5.86-1.24 12-3.71 6.14-2.48 11.37-3.66 15.7-3.54 11.07.5 20.35 4.5 27.85 12-10.85 6.55-16.14 15.72-15.89 27.52.26 11.8 5.76 21.2 16.5 28.2-3.13 8.87-7.39 17.29-12.78 25.26zM119.22 31.84c0-7.72 2.76-15.11 8.28-22.17 5.52-7.06 12.39-11.36 20.61-12.91.25.99.38 1.94.38 2.85 0 7.72-2.82 15.22-8.47 22.5-5.65 7.28-12.63 11.66-20.93 13.14-.12-1.07-.18-2.2-.18-3.41z" />
    </svg>
);

const PlayStoreIcon = () => (
    <svg className="w-4 h-4 fill-current" viewBox="0 0 512 512">
        <path d="M325.8 243.8L61.7 48.7c-5.6-4.2-13-4.7-19.1-1.3C36.4 50.8 32 57.6 32 65v382c0 7.4 4.4 14.2 10.6 17.6 2.6 1.4 5.5 2.1 8.4 2.1 3.7 0 7.3-1.1 10.7-3.4l264.1-195.1c5.2-3.9 8.2-10 8.2-16.5s-3-12.6-8.2-16.5zM76.9 97.4l197.9 146L76.9 389.4V97.4z" />
        <path d="M394.4 212.1l-44.5-24.9-38 28.1 38 28.1 44.5-24.9c9.3-5.2 15.1-15 15.1-25.7s-5.8-20.5-15.1-25.7z" />
    </svg>
);

const AppDownloadSection = () => {
    const [activeTab, setActiveTab] = useState<string>('customer');
    const currentApp = apps.find((a) => a.id === activeTab) || apps[0];
    const Icon = currentApp.icon;

    return (
        <section className="py-8 sm:py-10 md:py-14 bg-background relative overflow-hidden">
            {/* Subtle Ambient Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[320px] bg-primary/8 rounded-full blur-[100px] pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10 max-w-6xl">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 md:mb-8">
                    <div>
                        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary/5 border border-primary/20 text-primary text-[11px] font-bold uppercase tracking-wider mb-2">
                            <Sparkles className="w-3.5 h-3.5 text-primary" />
                            Mobile Apps Ecosystem
                        </div>
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground tracking-tight leading-tight">
                            Everything You Need in <span className="text-primary">One App</span>
                        </h2>
                    </div>

                    {/* Compact Tabs Switcher */}
                    <div className="flex overflow-x-auto no-scrollbar bg-card p-1 rounded-xl border border-border shrink-0 self-start md:self-auto shadow-xs">
                        {apps.map((app) => {
                            const TabIcon = app.icon;
                            const isActive = activeTab === app.id;
                            return (
                                <button
                                    key={app.id}
                                    onClick={() => setActiveTab(app.id)}
                                    className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-300 cursor-pointer whitespace-nowrap ${isActive
                                            ? app.activeTabBg
                                            : 'text-body-text hover:text-foreground hover:bg-section-bg'
                                        }`}
                                >
                                    <TabIcon className="w-3.5 h-3.5" />
                                    {app.title}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Showcase Card */}
                <div className="bg-section-bg border border-border rounded-2xl p-5 sm:p-8 md:p-10 shadow-sm relative overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
                        {/* Left Side: App Details */}
                        <div className="lg:col-span-7 flex flex-col items-start gap-4">
                            <div className="flex items-center gap-3">
                                <div className={`${currentApp.iconBg} w-11 h-11 rounded-xl flex items-center justify-center shadow-sm shrink-0`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-primary block leading-none mb-1">
                                        {currentApp.badge}
                                    </span>
                                    <h3 className="text-xl sm:text-2xl font-bold text-foreground leading-tight">
                                        {currentApp.title}
                                    </h3>
                                </div>
                            </div>

                            <p className="text-sm text-body-text leading-relaxed font-medium">
                                {currentApp.description}
                            </p>

                            {/* Features Pill Badges */}
                            <div className="flex flex-wrap gap-2 my-1">
                                {currentApp.features.map((feat, idx) => (
                                    <div
                                        key={idx}
                                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-card border border-border text-foreground text-xs font-medium shadow-2xs"
                                    >
                                        <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                                        <span>{feat}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Download Buttons */}
                            <div className="w-full pt-4 border-t border-border flex flex-wrap items-center gap-3">
                                <a
                                    href={currentApp.appStoreUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-dark-brown hover:bg-black text-white transition-all duration-300 shadow-sm hover:scale-105 cursor-pointer text-xs"
                                >
                                    <AppleIcon />
                                    <div className="flex flex-col items-start text-left leading-none">
                                        <span className="text-[9px] text-zinc-300 uppercase tracking-wider">App Store</span>
                                        <span className="text-xs font-bold mt-0.5">Download</span>
                                    </div>
                                </a>

                                <a
                                    href={currentApp.playStoreUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-dark-brown hover:bg-black text-white transition-all duration-300 shadow-sm hover:scale-105 cursor-pointer text-xs"
                                >
                                    <PlayStoreIcon />
                                    <div className="flex flex-col items-start text-left leading-none">
                                        <span className="text-[9px] text-zinc-300 uppercase tracking-wider">Google Play</span>
                                        <span className="text-xs font-bold mt-0.5">Get it on</span>
                                    </div>
                                </a>
                            </div>
                        </div>

                        {/* Right Side: High-res Phone Mockup */}
                        <div className="lg:col-span-5 flex justify-center items-center">
                            <div className="relative w-full max-w-[280px] sm:max-w-[330px] md:max-w-[360px] lg:max-w-[380px] h-[460px] sm:h-[530px] md:h-[580px] flex items-center justify-center">
                                <Image
                                    key={currentApp.id}
                                    src={currentApp.screenImage}
                                    alt={currentApp.screenAlt}
                                    fill
                                    className="object-contain drop-shadow-2xl hover:scale-[1.03] transition-all duration-500 animate-in fade-in zoom-in-95"
                                    unoptimized={true}
                                    priority
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AppDownloadSection;
