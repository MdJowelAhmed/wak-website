'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Star } from 'lucide-react';
import { myFetch } from '../../../../../helpers/myFetch';
import { resolveImageUrl } from '../../../../../helpers/resolveImageUrl';

const HorizontalServiceCard = ({
    id,
    name,
    avatar,
    rating,
    reviewCount,
    category,
    description,
    price,
    coverImage
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
            className="flex gap-4 bg-white/5 border border-white/10 hover:border-[#FF6700]/30 hover:bg-white/10 rounded-2xl p-4 transition-all duration-350 hover:-translate-y-0.5 cursor-pointer group"
        >
            {/* Cover Image (Left Side) */}
            <div className="w-28 h-20 sm:w-32 sm:h-24 rounded-xl overflow-hidden shrink-0 relative border border-white/10">
                <img
                    src={coverImage}
                    alt={name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
            </div>

            {/* Content (Right Side) */}
            <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                <div>
                    <h4 className="text-white font-semibold text-sm sm:text-base line-clamp-1 group-hover:text-primary transition-colors">
                        {name}
                    </h4>
                    <p className="text-[11px] sm:text-xs text-white/60 line-clamp-1 mt-1 font-normal leading-relaxed">
                        {description}
                    </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 mt-2">
                    <div className="flex items-center gap-2 min-w-0">
                        <img
                            src={avatar}
                            alt={name}
                            className="w-5.5 h-5.5 rounded-full object-cover border border-zinc-700/50 shrink-0"
                        />
                        <span className="text-[10px] bg-primary/80 text-white px-2 py-0.5 rounded font-medium truncate">
                            {category}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                        <div className="flex items-center gap-0.5 text-amber-400">
                            <Star size={11} className="fill-amber-400 text-amber-400" />
                            <span className="text-[11px] font-semibold text-white ml-0.5">
                                {rating.toFixed(1)} <span className="text-zinc-500 font-normal">({reviewCount})</span>
                            </span>
                        </div>
                        <span className="text-[11px] font-bold text-[#FF6700]">
                            From: ${price}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function ServiceList() {
    const searchParams = useSearchParams();
    const categoryQuery = searchParams.get('category');
    const [selectedCategory, setSelectedCategory] = useState('All');
    
    const [categories, setCategories] = useState<{name: string, value: string}[]>([{ name: "All", value: "All" }]);
    const [servicesData, setServicesData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch categories
                const catRes = await myFetch("/categories/active?type=service");
                if (catRes?.data) {
                    const mappedCats = catRes.data.map((c: any) => ({ name: c.name, value: c.name }));
                    setCategories([{ name: "All", value: "All" }, ...mappedCats]);
                }

                // Fetch services
                const srvRes = await myFetch("/services");
                if (srvRes?.data) {
                    setServicesData(srvRes.data);
                }
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Sync selected tab with URL query category param if present
    useEffect(() => {
        if (categoryQuery) {
            setSelectedCategory(categoryQuery);
        } else {
            setSelectedCategory('All');
        }
    }, [categoryQuery]);

    const filteredServices = selectedCategory === 'All'
        ? servicesData
        : servicesData.filter(service => service.category?.name === selectedCategory);

    return (
        <section className="pb-16 md:py-20 bg-[#4f2c1d]">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-1 h-10 bg-[#FF6700] rounded-full"></div>
                            <div>
                                <h2 className="text-3xl md:text-4xl font-semibold text-white">
                                    Our Services
                                </h2>
                                <p className="text-white/70 text-sm mt-2">
                                    Browse through expert-vetted professionals
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Category Tabs */}
                <div className="flex flex-wrap gap-2.5 mb-12">
                    {categories.map((category) => {
                        const isActive = selectedCategory === category.value;
                        return (
                            <button
                                key={category.value}
                                onClick={() => setSelectedCategory(category.value)}
                                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${isActive
                                    ? 'bg-[#FF6700] text-white shadow-lg shadow-orange-600/10'
                                    : 'bg-white/5 hover:bg-primary/80 border border-white/10 text-white hover:text-white'
                                    }`}
                            >
                                {category.name}
                            </button>
                        );
                    })}
                </div>

                {loading ? (
                    <div className="py-20 text-center border border-dashed border-zinc-800 rounded-2xl bg-[#2a2a2a]/10 animate-in fade-in duration-300">
                        <p className="text-[#FFDDA5] font-medium">Loading services...</p>
                    </div>
                ) : filteredServices.length === 0 ? (
                    <div key={selectedCategory} className="py-20 text-center border border-dashed border-zinc-800 rounded-2xl bg-[#2a2a2a]/10 animate-in fade-in duration-300">
                        <p className="text-zinc-500 text-sm">No services found in this category.</p>
                    </div>
                ) : (
                    <div key={selectedCategory} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
                        {filteredServices.map((service) => (
                            <HorizontalServiceCard 
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
                )}
            </div>
        </section>
    );
}
