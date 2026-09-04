"use client";

import ServiceCard from "@/shared/ServiceCard";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { resolveImageUrl } from "../../../../../helpers/resolveImageUrl";

interface ServicesProps {
    initialServices?: any[];
}

const Services = ({ initialServices = [] }: ServicesProps) => {
    const router = useRouter();
    const services = initialServices;

    const handleClick = () => {
        const cookies = document.cookie;
        const hasMode = cookies.includes("user-mode=service");

        if (!hasMode) {
            document.cookie = "user-mode=service; path=/; max-age=31536000";
        }

        router.push(`/services`);
        router.refresh();
    };
    return (
        <section className="py-[50px]">
            <div className="container mx-auto px-4">
                {/* Header */}

                <div className="mb-12">

                    <div className="flex justify-between items-end">
                        <div className="flex items-center gap-4 mb-3">
                            <div className="w-5 h-10 bg-primary rounded-xs"></div>
                            <h2 className="title mb-0!">Services</h2>
                        </div>

                        <button className="flex items-center gap-2  text-[#FFDDA5] px-6 py-3 rounded-md font-medium hover:underline underline-offset-4 transition-all group cursor-pointer" onClick={handleClick}>
                            View All
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>

                {/* Grid */}
                {services.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-6">
                        {services.map((service) => (
                            <ServiceCard 
                                key={service._id} 
                                id={service.slug || service._id}
                                name={service.creator?.name || "Unknown"}
                                avatar={resolveImageUrl(service.creator?.profileImage) || `https://ui-avatars.com/api/?name=${encodeURIComponent(service.creator?.name || 'User')}&background=random`}
                                rating={service.ratingAverage || 0}
                                reviewCount={service.ratingCount || 0}
                                category={service.category?.name || "Service"}
                                description={service.name || ""}
                                price={service.price || 0}
                                coverImage={resolveImageUrl(service.image) || "/placeholder.jpg"}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-[#FFDDA5] py-10">No services found.</div>
                )}
            </div>
        </section>
    );
};

export default Services;
