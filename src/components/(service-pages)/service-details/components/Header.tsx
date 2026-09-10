import Image from "next/image";
import { Star } from "lucide-react";
import type { ServiceDetailsData } from "../types";

export default function Header({ service }: { service: ServiceDetailsData }) {
    return (
        <section className="overflow-hidden rounded-2xl border border-white/10 bg-secondary shadow-lg">
            <div className="relative h-64 w-full sm:h-80 md:h-96">
                <Image
                    src={service.image}
                    alt={service.name}
                    fill
                    unoptimized
                    priority
                    className="object-cover"
                    sizes="(min-width: 1024px) 66vw, 100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary via-black/20 to-transparent" />
            </div>

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
                        ({service.reviewCount} {service.reviewCount === 1 ? "review" : "reviews"})
                    </span>
                </div>
            </div>
        </section>
    );
}
