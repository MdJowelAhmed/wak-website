"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function Logo() {
    const t = useTranslations("Logo");

    return (
        <Link
            href="/"
            className="inline-flex flex-col items-start shrink-0 cursor-pointer group"
        >
            <div className="flex items-center gap-1.5">
                <span className="text-foreground font-extrabold text-base sm:text-lg tracking-tight group-hover:text-primary transition-colors">
                    WorthWorld
                </span>
            </div>
            <span className="hidden sm:block text-[9px] font-semibold text-foreground/80 tracking-widest uppercase mt-0.5">
                {t("tagline")}
            </span>
        </Link>
    );
}
