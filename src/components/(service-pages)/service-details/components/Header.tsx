import Image from "next/image";
import { Star } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { ServiceDetailsData } from "../types";
import ServiceHeroMedia from "./ServiceHeroMedia";

export default async function Header({ service }: { service: ServiceDetailsData }) {
    const t = await getTranslations("ServiceDetails");

    return (
        <section className="overflow-hidden rounded-2xl border border-white/10 bg-secondary shadow-lg">
            <ServiceHeroMedia
                name={service.name}
                image={service.image}
                video={service.video}
            />

            <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-white/15 bg-white/10">
                        <Image
                            src={service.creator.profileImage}
                            alt={service.creator.name}
                            fill
                            unoptimized
                            className="object-cover"
                            sizes="48px"
                        />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-white">{service.creator.name}</p>
                        <p className="text-xs font-medium uppercase tracking-wide text-primary">
                            {service.categoryName}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 text-sm">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <span className="font-semibold text-white">{service.rating.toFixed(1)}</span>
                    <span className="text-white/65">
                        ({t("reviewCount", { count: service.reviewCount })})
                    </span>
                </div>
            </div>
        </section>
    );
}
