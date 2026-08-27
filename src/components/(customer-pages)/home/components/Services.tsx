"use client"
import { useState, useEffect } from "react";
import ServiceCard from "@/shared/ServiceCard";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { myFetch } from "../../../../../helpers/myFetch";
import { resolveImageUrl } from "../../../../../helpers/resolveImageUrl";


const Services = () => {
    const router = useRouter();
    const [services, setServices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await myFetch('/services');
                if (res?.data) {
                    setServices(res.data);
                }
            } catch (error) {
                console.error("Failed to fetch services:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, []);

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
                {loading ? (
                    <div className="flex justify-center items-center py-12 text-[#FFDDA5]">Loading...</div>
                ) : services.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
