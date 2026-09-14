'use client';

import { useSearchParams } from 'next/navigation';
import { Star } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCurrency } from '@/hooks/use-currency';
import { resolveImageUrl } from '../../../../../helpers/resolveImageUrl';
import { PaginationData } from '../index';
import Image from 'next/image';
import { useRouter, usePathname } from '@/i18n/navigation';

export interface ServiceCategory {
    _id?: string;
    name: string;
    slug?: string;
}

export interface ServiceCreator {
    name?: string;
    profileImage?: string;
}

export interface ServiceItem {
    _id: string;
    slug?: string;
    name?: string;
    description?: string;
    price?: number;
    image?: string;
    ratingAverage?: number;
    ratingCount?: number;
    category?: ServiceCategory;
    creator?: ServiceCreator;
}

const HorizontalServiceCard = ({
    id,
    name,
    avatar,
    rating,
    reviewCount,
    category,
    description,
    price,
    coverImage,
    fromLabel,
}: {
    id: string | number;
    name: string;
    avatar: string;
    rating: number;
    reviewCount: number;
    category: string;
    description: string;
    price: number;
    coverImage: string;
    fromLabel: string;
}) => {
    const router = useRouter();

    const handleClick = () => {
        const cookies = document.cookie;
        const hasMode = cookies.includes("user-mode=service");

        if (!hasMode) {
            document.cookie = "user-mode=service; path=/; max-age=31536000";
        }

        router.push(`/services/${id}`);
        router.refresh();
    };

    return (
        <div
            onClick={handleClick}
            className="group flex cursor-pointer gap-4 rounded-2xl border border-white/10 bg-secondary p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-secondary/90"
        >
            <div className="w-28 h-20 sm:w-32 sm:h-24 rounded-xl overflow-hidden shrink-0 relative border border-white/10">
                <Image
                    src={coverImage}
                    alt={name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    width={100}
                    height={100}
                />
            </div>

            <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                <div>
                    <h4 className="text-foreground font-semibold text-sm sm:text-base line-clamp-1 group-hover:text-foreground/90 transition-colors">
                        {name}
                    </h4>
                    <p className="text-[11px] sm:text-xs text-foreground/80 line-clamp-1 mt-1 font-normal leading-relaxed">
                        {description}
                    </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 mt-2">
                    <div className="flex items-center gap-2 min-w-0">
                        <Image
                            src={avatar}
                            alt={name}
                            className="w-5.5 h-5.5 rounded-full object-cover border border-zinc-700/50 shrink-0"
                            width={20}
                            height={20}
                        />
                        <span className="text-[10px] bg-primary/80 text-white px-2 py-0.5 rounded font-medium truncate">
                            {category}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                        <div className="flex items-center gap-0.5 text-amber-400">
                            <Star size={11} className="fill-amber-400 text-amber-400" />
                            <span className="ml-0.5 text-[11px] font-semibold text-white">
                                {rating.toFixed(1)}{" "}
                                <span className="font-normal text-white/50">({reviewCount})</span>
                            </span>
                        </div>
                        <span className="text-[11px] font-bold text-primary">
                            {fromLabel}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

interface ServiceListProps {
    services?: ServiceItem[];
    pagination?: PaginationData;
    categoriesList?: ServiceCategory[];
    searchParams?: { [key: string]: string | string[] | undefined };
}

export default function ServiceList({
    services = [],
    categoriesList = [],
    searchParams = {},
}: ServiceListProps) {
    const t = useTranslations("Services");
    const { formatPrice } = useCurrency();
    const router = useRouter();
    const pathname = usePathname();
    const currentSearchParams = useSearchParams();

    const selectedCategory = (searchParams?.category ?? currentSearchParams.get('category')) as string || 'All';

    const categories = [
        { name: t("all"), value: "All" },
        ...categoriesList.map((c) => ({
            name: c.name,
            value: c.slug || c._id || c.name,
        })),
    ];

    const handleCategoryClick = (val: string) => {
        const params = new URLSearchParams(currentSearchParams.toString());
        if (val === 'All') {
            params.delete('category');
        } else {
            params.set('category', val);
        }
        params.set('page', '1');

        const queryStr = params.toString();
        router.push(queryStr ? `${pathname}?${queryStr}` : pathname);
    };

    const filteredServices = selectedCategory === 'All'
        ? services
        : services.filter((service) =>
            service.category?.slug === selectedCategory ||
            service.category?.name === selectedCategory ||
            service.category?._id === selectedCategory
        );

    return (
        <section className="pb-16 md:py-20 ">
            <div className="container mx-auto px-4">
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-1 rounded-full bg-primary"></div>
                            <div>
                                <h2 className="text-3xl md:text-4xl font-semibold text-white">
                                    {t("title")}
                                </h2>
                                <p className="text-white/70 text-sm mt-2">
                                    {t("subtitle")}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2.5 mb-12">
                    {categories.map((category) => {
                        const isActive = selectedCategory === category.value || (selectedCategory === 'All' && category.value === 'All');
                        return (
                            <button
                                key={category.value}
                                onClick={() => handleCategoryClick(category.value)}
                                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${isActive
                                    ? 'bg-secondary text-white shadow-lg '
                                    : 'bg-white/10 hover:bg-primary/80 border border-white/10 text-white hover:text-white'
                                    }`}
                            >
                                {category.name}
                            </button>
                        );
                    })}
                </div>

                {filteredServices.length === 0 ? (
                    <div key={selectedCategory} className="rounded-2xl border border-dashed border-white/20 bg-secondary/40 py-20 text-center animate-in fade-in duration-300">
                        <p className="text-sm text-white/70">{t("empty")}</p>
                    </div>
                ) : (
                    <div key={selectedCategory} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
                        {filteredServices.map((service) => (
                            <HorizontalServiceCard
                                key={service._id}
                                id={service.slug || service._id}
                                name={service.name || t("untitled")}
                                avatar={resolveImageUrl(service.creator?.profileImage) || `https://ui-avatars.com/api/?name=${encodeURIComponent(service.creator?.name || 'User')}&background=random`}
                                rating={service.ratingAverage || 0}
                                reviewCount={service.ratingCount || 0}
                                category={service.category?.name || t("fallbackCategory")}
                                description={service.description || service.name || ""}
                                price={service.price || 0}
                                coverImage={resolveImageUrl(service.image) || "/placeholder.jpg"}
                                fromLabel={t("from", { price: formatPrice(service.price || 0) })}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
