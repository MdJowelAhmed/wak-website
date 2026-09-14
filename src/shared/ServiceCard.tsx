'use client';
import { Star } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useCurrency } from "@/hooks/use-currency";

interface service {
    id: string | number,
    name: string,
    avatar: string,
    rating: number,
    reviewCount: number,
    category: string,
    description: string,
    price: number,
    coverImage: string
}

const ServiceCard = ({ id, name, coverImage, category, price, rating, reviewCount, avatar, description }: service) => {
    const router = useRouter();
    const { formatPrice } = useCurrency();
    const t = useTranslations("Services");

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
            className="group relative h-full overflow-hidden rounded-xl sm:rounded-2xl bg-secondary  transition-all duration-300 hover:border-white/20 hover:shadow-2xl hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
        >
            {/* Cover Image */}
            <div className="relative w-full h-24 sm:h-48 overflow-hidden">
                <Image
                    src={coverImage}
                    alt={name}
                    fill
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-linear-to-b from-black/20 to-black/40" />

                {/* Category Badge */}
                <div className="absolute top-2 right-2 px-2 py-0.5 sm:top-4 sm:right-4 sm:px-4 sm:py-2 rounded-full bg-white/5 backdrop-blur-lg border border-primary/20 text-[10px] sm:text-xs font-semibold text-primary shadow-lg truncate max-w-[80%]">
                    {category}
                </div>
            </div>

            {/* Card Body */}
            <div className="p-2.5 sm:p-5 space-y-2 sm:space-y-4 flex-1 flex flex-col justify-between">
                {/* Author Row */}
                <div className="flex items-center justify-between gap-1 sm:gap-3">
                    <div className="flex items-center gap-1.5 sm:gap-3 flex-1 min-w-0">
                        <Image
                            src={avatar}
                            alt={name}
                            width={40}
                            height={40}
                            className="w-6 h-6 sm:w-9 sm:h-9 rounded-full object-cover border-2 border-white/2 shrink-0"
                        />
                        <span className="text-xs sm:text-sm font-semibold text-foreground truncate">
                            {name}
                        </span>
                    </div>
                    <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
                        <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-[#FFC107] text-[#FFC107]" />
                        <span className="text-[10px] sm:text-xs font-semibold text-foreground">
                            {rating.toFixed(1)}{" "}
                            <span className="text-foreground/50 font-normal hidden sm:inline">
                                ({reviewCount})
                            </span>
                        </span>
                    </div>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-foreground/80 line-clamp-2 leading-tight sm:leading-relaxed">
                    {description}
                </p>

                {/* Price */}
                <p className="text-xs sm:text-sm font-bold text-primary tracking-wide">
                    {t("from", { price: formatPrice(price) })}
                </p>
            </div>
        </div>
    );
};

export default ServiceCard;
