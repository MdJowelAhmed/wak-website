'use client';

import { useState } from 'react';
import { User, Store, Briefcase, Truck, QrCode, CheckCircle2, Sparkles } from 'lucide-react';

const apps = [
    {
        id: 'customer',
        title: 'Customer App',
        badge: 'For Customers',
        icon: User,
        iconBg: 'bg-primary',
        description: 'Shop products, book professional services, and track your orders in real-time.',
        features: ['Live Order Tracking', 'Multi-payment Support', 'Exclusive Deals'],
        appStoreUrl: 'https://apple.com',
        playStoreUrl: 'https://google.com',
        qrValue: 'WAK Customer App',
        activeTabBg: 'bg-primary text-white shadow-lg shadow-primary/20',
    },
    {
        id: 'merchant',
        title: 'Merchant App',
        badge: 'For Merchants',
        icon: Store,
        iconBg: 'bg-amber-600',
        description: 'Manage store inventory, process customer orders, and view sales analytics on the go.',
        features: ['Inventory Control', 'Batch Fulfillment', 'Instant Payouts'],
        appStoreUrl: 'https://apple.com',
        playStoreUrl: 'https://google.com',
        qrValue: 'WAK Merchant App',
        activeTabBg: 'bg-amber-600 text-white shadow-lg shadow-amber-600/20',
    },
    {
        id: 'provider',
        title: 'Service Provider App',
        badge: 'For Service Providers',
        icon: Briefcase,
        iconBg: 'bg-primary',
        description: 'Receive client bookings, manage appointment schedules, and build your service business.',
        features: ['Booking Calendar', 'Direct Client Messaging', 'Earnings Cashout'],
        appStoreUrl: 'https://apple.com',
        playStoreUrl: 'https://google.com',
        qrValue: 'WAK Provider App',
        activeTabBg: 'bg-primary text-white shadow-lg shadow-primary/20',
    },
    {
        id: 'driver',
        title: 'Driver App',
        badge: 'For Drivers',
        icon: Truck,
        iconBg: 'bg-amber-600',
        description: 'Accept delivery requests, navigate optimized routes, and earn money on your schedule.',
        features: ['Route Navigation', 'Weekly Earnings Tracker', '24/7 Delivery Support'],
        appStoreUrl: 'https://apple.com',
        playStoreUrl: 'https://google.com',
        qrValue: 'WAK Driver App',
        activeTabBg: 'bg-amber-600 text-white shadow-lg shadow-amber-600/20',
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
        <section className="py-6 sm:py-8 md:py-10 bg-background relative overflow-hidden">
            {/* Subtle Ambient Lighting Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[300px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10 max-w-6xl">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                    <div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/15 border border-primary/30 text-accent text-[11px] font-bold uppercase tracking-wider mb-2">
                            <Sparkles className="w-3 h-3 text-accent" />
                            Mobile Apps Ecosystem
                        </div>
                        <h2 className="text-xl sm:text-3xl font-bold text-white tracking-tight leading-tight">
                            Everything You Need in <span className="text-accent">One App</span>
                        </h2>
                    </div>

                    {/* Compact Tabs Switcher */}
                    <div className="flex overflow-x-auto no-scrollbar bg-card/80 p-1 rounded-xl border border-card-border shrink-0 self-start md:self-auto">
                        {apps.map((app) => {
                            const TabIcon = app.icon;
                            const isActive = activeTab === app.id;
                            return (
                                <button
                                    key={app.id}
                                    onClick={() => setActiveTab(app.id)}
                                    className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs font-semibold transition-all duration-300 cursor-pointer whitespace-nowrap ${isActive
                                            ? app.activeTabBg
                                            : 'text-zinc-300 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <TabIcon className="w-3.5 h-3.5" />
                                    {app.title}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Compact Glassmorphism Showcase Card */}
                <div className="bg-card/70 backdrop-blur-xl border border-card-border rounded-2xl p-5 sm:p-7 shadow-xl relative overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
                        {/* Left Side: App Details */}
                        <div className="lg:col-span-8 flex flex-col items-start gap-4">
                            <div className="flex items-center gap-3">
                                <div className={`${currentApp.iconBg} w-10 h-10 rounded-xl flex items-center justify-center shadow-md text-white shrink-0`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-accent block leading-none mb-0.5">
                                        {currentApp.badge}
                                    </span>
                                    <h3 className="text-lg sm:text-2xl font-bold text-white leading-tight">
                                        {currentApp.title}
                                    </h3>
                                </div>
                            </div>

                            <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed font-medium">
                                {currentApp.description}
                            </p>

                            {/* Features Pill Badges */}
                            <div className="flex flex-wrap gap-2 my-1">
                                {currentApp.features.map((feat, idx) => (
                                    <div
                                        key={idx}
                                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-zinc-100 text-xs font-medium"
                                    >
                                        <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                                        <span>{feat}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Download Buttons + QR Code */}
                            <div className="w-full pt-3 border-t border-white/10 flex flex-wrap items-center gap-3">
                                <a
                                    href={currentApp.appStoreUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-black border border-white/15 text-white transition-all duration-300 shadow-md hover:scale-105 cursor-pointer text-xs"
                                >
                                    <AppleIcon />
                                    <div className="flex flex-col items-start text-left leading-none">
                                        <span className="text-[9px] text-zinc-400 uppercase tracking-wider">App Store</span>
                                        <span className="text-xs font-bold mt-0.5">Download</span>
                                    </div>
                                </a>

                                <a
                                    href={currentApp.playStoreUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-black border border-white/15 text-white transition-all duration-300 shadow-md hover:scale-105 cursor-pointer text-xs"
                                >
                                    <PlayStoreIcon />
                                    <div className="flex flex-col items-start text-left leading-none">
                                        <span className="text-[9px] text-zinc-400 uppercase tracking-wider">Google Play</span>
                                        <span className="text-xs font-bold mt-0.5">Get it on</span>
                                    </div>
                                </a>

                                <div className="hidden sm:flex items-center gap-2.5 ml-auto px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10">
                                    <QrCode className="w-6 h-6 text-accent" />
                                    <div className="flex flex-col text-left">
                                        <span className="text-xs font-semibold text-white">Scan QR Code</span>
                                        <span className="text-[9px] text-zinc-400">Desktop quick install</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Compact Phone Mockup Visual */}
                        <div className="lg:col-span-4 flex justify-center items-center">
                            <div className="relative w-full max-w-[190px] sm:max-w-[210px] aspect-[9/16] bg-zinc-950 border-[4px] border-zinc-800 rounded-[32px] shadow-xl p-3 flex flex-col justify-between overflow-hidden">
                                {/* Smartphone Camera Notch */}
                                <div className="w-20 h-3 bg-zinc-800 rounded-full mx-auto mb-2 shrink-0" />

                                {/* Simulated App Preview Screen */}
                                <div className="w-full h-full bg-gradient-to-b from-zinc-900 via-zinc-900/90 to-background rounded-[22px] p-3 flex flex-col justify-between border border-white/10 overflow-hidden relative">
                                    {/* App UI Header */}
                                    <div className="flex justify-between items-center pb-2 border-b border-white/10">
                                        <div className="flex items-center gap-1.5">
                                            <div className={`${currentApp.iconBg} w-5 h-5 rounded-md flex items-center justify-center text-white shrink-0`}>
                                                <Icon className="w-3 h-3" />
                                            </div>
                                            <span className="text-[10px] font-bold text-white tracking-wide truncate max-w-[80px]">WAK App</span>
                                        </div>
                                        <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-primary/20 text-accent font-semibold">
                                            Active
                                        </span>
                                    </div>

                                    {/* App UI Content Preview */}
                                    <div className="my-auto py-2 space-y-2">
                                        <div className="p-2 rounded-lg bg-white/5 border border-white/10 space-y-1">
                                            <div className="h-2 w-1/2 bg-white/20 rounded" />
                                            <div className="h-2 w-3/4 bg-white/10 rounded" />
                                        </div>

                                        <div className="p-2 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-between">
                                            <span className="text-[9px] font-bold text-white">Live Service</span>
                                            <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
                                        </div>
                                    </div>

                                    {/* App UI Bottom Nav */}
                                    <div className="pt-2 border-t border-white/10 flex justify-around items-center">
                                        <div className="w-3.5 h-3.5 rounded-full bg-primary" />
                                        <div className="w-3.5 h-3.5 rounded-full bg-white/20" />
                                        <div className="w-3.5 h-3.5 rounded-full bg-white/20" />
                                    </div>
                                </div>

                                {/* Home Bar */}
                                <div className="w-20 h-1 bg-zinc-700 rounded-full mx-auto mt-2 shrink-0" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AppDownloadSection;
