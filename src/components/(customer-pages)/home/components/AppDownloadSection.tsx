'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { LucideIcon } from 'lucide-react';
import { User, Store, Briefcase, Truck, Check } from 'lucide-react';
import { FaApple, FaGooglePlay } from 'react-icons/fa6';
import { useTranslations } from 'next-intl';
import { Tabs, TabsList, TabsTrigger } from '@/ui/tabs';
import { cn } from '@/lib/utils';

type AppRole = 'customer' | 'merchant' | 'provider' | 'driver';

const APP_ICONS: Record<AppRole, LucideIcon> = {
    customer: User,
    merchant: Store,
    provider: Briefcase,
    driver: Truck,
};

const APP_META: Record<AppRole, { appStoreUrl: string; playStoreUrl: string; screenImage: string }> = {
    customer: {
        appStoreUrl: 'https://apple.com',
        playStoreUrl: 'https://google.com',
        screenImage: '/app-screens/customer-phone.png',
    },
    merchant: {
        appStoreUrl: 'https://apple.com',
        playStoreUrl: 'https://google.com',
        screenImage: '/app-screens/dashboard-phone.png',
    },
    provider: {
        appStoreUrl: 'https://apple.com',
        playStoreUrl: 'https://google.com',
        screenImage: '/app-screens/dashboard-phone.png',
    },
    driver: {
        appStoreUrl: 'https://apple.com',
        playStoreUrl: 'https://google.com',
        screenImage: '/app-screens/driver-phone.png',
    },
};

const APP_ROLES: AppRole[] = ['customer', 'merchant', 'provider', 'driver'];

const featureChipPositions = [
    'lg:left-0 lg:top-[16%]',
    'lg:right-0 lg:top-[38%]',
    'lg:left-4 lg:bottom-[14%]',
];

const storeButtonClass =
    'inline-flex min-w-[168px] items-center gap-3 rounded-2xl bg-white px-5 py-3.5 text-secondary shadow-lg shadow-dark-brown/15 transition-all duration-300 hover:-translate-y-0.5 hover:bg-section-bg hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary';

const AppDownloadSection = () => {
    const t = useTranslations('Home.appDownload');
    const [activeTab, setActiveTab] = useState<AppRole>('customer');

    const apps = APP_ROLES.map((id) => ({
        id,
        title: t(`${id}Title`),
        tabLabel: t(`${id}Tab`),
        badge: t(`${id}Badge`),
        description: t(`${id}Description`),
        features: [t(`${id}Feature1`), t(`${id}Feature2`), t(`${id}Feature3`)],
        screenAlt: t(`${id}Alt`),
        icon: APP_ICONS[id],
        ...APP_META[id],
    }));

    const currentApp = apps.find((app) => app.id === activeTab) ?? apps[0];

    const handleTabChange = (value: string) => {
        const nextApp = apps.find((app) => app.id === value);
        if (nextApp) setActiveTab(nextApp.id);
    };

    return (
        <section
            className="relative overflow-hidden bg-primary py-16 md:py-20 lg:py-24"
            aria-labelledby="app-download-heading"
        >
            <div
                className="pointer-events-none absolute inset-0 opacity-25"
                style={{
                    backgroundImage: 'radial-gradient(rgba(255,255,255,0.35) 1px, transparent 1px)',
                    backgroundSize: '22px 22px',
                }}
            />
            <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-white/20 blur-3xl" />
            <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-dark-brown/25 blur-3xl" />

            <div className="container relative z-10 mx-auto max-w-6xl px-4">
                <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-8 xl:gap-16">
                    <div className="max-w-xl">
                        <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-white/80">
                            {currentApp.badge}
                        </p>
                        <h2
                            id="app-download-heading"
                            className="text-[2rem] font-bold leading-[1.15] tracking-tight text-white sm:text-4xl lg:text-[2.75rem]"
                        >
                            {t('heading')}
                            <span className="block text-secondary">{t('headingAccent')}</span>
                        </h2>
                        <p
                            key={`${currentApp.id}-desc`}
                            className="mt-4 max-w-md text-base font-medium leading-relaxed text-white/85 animate-in fade-in duration-300"
                        >
                            {currentApp.description}
                        </p>

                        <Tabs value={activeTab} onValueChange={handleTabChange} className="mt-8">
                            <TabsList
                                aria-label={t('chooseApp')}
                                className="grid h-auto w-full grid-cols-4 gap-2 bg-transparent p-0"
                            >
                                {apps.map((app) => {
                                    const TabIcon = app.icon;
                                    return (
                                        <TabsTrigger
                                            key={app.id}
                                            value={app.id}
                                            className={cn(
                                                'h-auto flex-col gap-2 rounded-2xl border border-white/20 bg-white/95 px-2 py-3 text-sub-heading shadow-sm',
                                                'hover:bg-white hover:shadow-md',
                                                'focus-visible:ring-offset-primary',
                                                'data-[state=active]:border-secondary data-[state=active]:bg-secondary data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-dark-brown/30',
                                            )}
                                        >
                                            <TabIcon className="h-5 w-5" aria-hidden />
                                            <span className="text-[11px] font-semibold leading-none">
                                                {app.tabLabel}
                                            </span>
                                        </TabsTrigger>
                                    );
                                })}
                            </TabsList>
                        </Tabs>

                        <ul className="mt-6 flex flex-col gap-2.5 lg:hidden">
                            {currentApp.features.map((feature) => (
                                <li
                                    key={feature}
                                    className="flex items-center gap-2.5 text-sm font-semibold text-white"
                                >
                                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-secondary">
                                        <Check className="h-3 w-3" strokeWidth={3} aria-hidden />
                                    </span>
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <div className="mt-8 flex flex-wrap gap-3">
                            <a
                                href={currentApp.appStoreUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={storeButtonClass}
                            >
                                <FaApple className="h-6 w-6 shrink-0" aria-hidden />
                                <span className="flex flex-col items-start leading-none">
                                    <span className="text-[10px] font-medium uppercase tracking-wider text-secondary/60">
                                        {t('downloadOnThe')}
                                    </span>
                                    <span className="mt-1 text-sm font-bold">{t('appStore')}</span>
                                </span>
                            </a>
                            <a
                                href={currentApp.playStoreUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={storeButtonClass}
                            >
                                <FaGooglePlay className="h-5 w-5 shrink-0" aria-hidden />
                                <span className="flex flex-col items-start leading-none">
                                    <span className="text-[10px] font-medium uppercase tracking-wider text-secondary/60">
                                        {t('getItOn')}
                                    </span>
                                    <span className="mt-1 text-sm font-bold">{t('googlePlay')}</span>
                                </span>
                            </a>
                        </div>
                    </div>

                    <div className="relative mx-auto flex min-h-[420px] w-full max-w-[420px] items-center justify-center sm:min-h-[500px] lg:max-w-none lg:min-h-[560px]">
                        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[340px] w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/35 blur-[90px] sm:h-[420px] sm:w-[420px]" />
                        <div className="pointer-events-none absolute left-1/2 top-[42%] h-48 w-48 -translate-x-1/2 rounded-full bg-white/50 blur-[50px]" />
                        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/25 sm:h-[380px] sm:w-[380px]" />

                        <div className="relative z-10 h-[380px] w-[230px] transition-transform duration-500 hover:-rotate-2 sm:h-[480px] sm:w-[280px] lg:h-[520px] lg:w-[300px]">
                            <Image
                                key={currentApp.id}
                                src={currentApp.screenImage}
                                alt={currentApp.screenAlt}
                                fill
                                sizes="(max-width: 640px) 230px, (max-width: 1024px) 280px, 300px"
                                className="object-contain drop-shadow-[0_30px_60px_rgba(62,39,35,0.28)] animate-in fade-in zoom-in-95 duration-500"
                            />
                        </div>

                        {currentApp.features.map((feature, index) => (
                            <div
                                key={`${currentApp.id}-${feature}`}
                                className={cn(
                                    'absolute z-20 hidden items-center gap-2 rounded-2xl border border-white/70 bg-white/90 px-3.5 py-2.5 text-xs font-semibold text-sub-heading shadow-lg shadow-dark-brown/20 backdrop-blur-md animate-in fade-in slide-in-from-bottom-1 duration-500 lg:flex',
                                    featureChipPositions[index],
                                )}
                            >
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white">
                                    <Check className="h-3 w-3" strokeWidth={3} aria-hidden />
                                </span>
                                {feature}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AppDownloadSection;
