import { Headset, RotateCcw, ShieldCheck, Truck, BadgeCheck } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

const Features = async () => {
    const t = await getTranslations("Home.features");

    const features = [
        {
            id: "secure-payments",
            icon: ShieldCheck,
            title: t("secureTitle"),
            description: t("secureDescription"),
            href: "/privacy-policy",
        },
        {
            id: "easy-returns",
            icon: RotateCcw,
            title: t("returnsTitle"),
            description: t("returnsDescription"),
            href: "/terms-of-services",
        },
        {
            id: "support",
            icon: Headset,
            title: t("supportTitle"),
            description: t("supportDescription"),
            href: "/contact-us",
        },
        {
            id: "fast-delivery",
            icon: Truck,
            title: t("deliveryTitle"),
            description: t("deliveryDescription"),
            href: "/about-us",
        },
        {
            id: "verified-merchants",
            icon: BadgeCheck,
            title: t("merchantsTitle"),
            description: t("merchantsDescription"),
            href: "/vendor/register",
        },
    ] as const;

    return (
        <section className="py-10 md:py-16 bg-background">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-2xl mx-auto mb-8 md:mb-12">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/5 border border-primary/20 text-foreground text-xs font-bold uppercase tracking-wider mb-3">
                        {t("badge")}
                    </div>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground tracking-tight mb-3">
                        {t("title")} <span className="text-primary">{t("titleHighlight")}</span>
                    </h2>
                    <p className="text-sm text-foreground/80 font-medium leading-relaxed">
                        {t("subtitle")}
                    </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
                    {features.map((feature) => {
                        const Icon = feature.icon;
                        return (
                            <Link
                                key={feature.id}
                                href={feature.href}
                                className="bg-secondary  hover:border-primary/60 p-4 sm:p-5 md:p-6 rounded-2xl flex flex-col items-center text-center group hover:-translate-y-1 transition-all duration-300 shadow-xs hover:shadow-md cursor-pointer select-none"
                            >
                                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary border border-primary/20 flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-105 group-hover:bg-primary transition-all duration-300">
                                    <Icon className="w-5 h-5 sm:w-7 sm:h-7 text-foreground group-hover:text-white transition-colors" strokeWidth={1.8} />
                                </div>
                                <h3 className="text-foreground font-bold text-xs sm:text-sm md:text-base leading-tight mb-1  transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-foreground/80 text-[11px] sm:text-xs font-medium leading-snug">
                                    {feature.description}
                                </p>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Features;
