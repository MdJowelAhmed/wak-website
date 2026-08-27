'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { myFetch } from '../../../../../helpers/myFetch';
import { resolveImageUrl } from '../../../../../helpers/resolveImageUrl';


interface Category {
    _id: string;
    name: string;
    slug: string;
    image: string;
    type: string;
}

const AllBrands = () => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'products' | 'services'>('services');
    const [productCategories, setProductCategories] = useState<Category[]>([]);
    const [serviceCategories, setServiceCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const [prodRes, servRes] = await Promise.all([
                    myFetch("/categories/active?type=product"),
                    myFetch("/categories/active?type=service")
                ]);

                if (prodRes?.data) setProductCategories(prodRes.data);
                if (servRes?.data) setServiceCategories(servRes.data);
            } catch (error) {
                console.error("Failed to fetch categories for marquee", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    // On mount, sync with existing user-mode cookie if present
    useEffect(() => {
        const isService = document.cookie.includes("user-mode=service");
        if (isService) {
            setActiveTab('services');
        } else {
            setActiveTab('products');
        }
    }, []);

    const handleTabChange = (tab: 'products' | 'services') => {
        setActiveTab(tab);
        const mode = tab === 'products' ? 'customer' : 'service';
        document.cookie = `user-mode=${mode}; path=/; max-age=31536000`;
        router.refresh();
    };

    return (
        <section className="py-12 bg-[#4f2c1d] ">
            {/* Segmented Tab Controller */}
            <div className="flex justify-center mb-10">
                <div className="inline-flex items-center gap-1.5 bg-white p-1.5 rounded-full border border-primary/50">
                    <button
                        onClick={() => handleTabChange('products')}
                        className={`px-8 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer ${activeTab === 'products'
                            ? 'bg-[#FF6700] text-white shadow-lg shadow-orange-600/20 scale-100'
                            : 'text-zinc-800 hover:text-primary hover:bg-white/5'
                            }`}
                    >
                        Products
                    </button>
                    <button
                        onClick={() => handleTabChange('services')}
                        className={`px-8 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer ${activeTab === 'services'
                            ? 'bg-[#FF6700] text-white shadow-lg shadow-orange-600/20 scale-100'
                            : 'text-zinc-700 hover:text-primary hover:bg-white/5'
                            }`}
                    >
                        Services
                    </button>
                </div>
            </div>

            {/* Marquee displays */}
            <div className="w-full relative overflow-hidden group py-4 ">
                {loading ? (
                    <div className="w-full flex justify-center py-10">
                        <span className="text-[#FFDDA5]">Loading categories...</span>
                    </div>
                ) : (
                    <div className="flex select-none">
                        {activeTab === 'products' ? (
                            /* Brands/Products Marquee */
                            productCategories.length > 0 ? (
                                <div className="flex space-x-12 animate-marquee whitespace-nowrap items-center">
                                    {[...productCategories, ...productCategories, ...productCategories].map((cat, index) => (
                                        <Link
                                            key={`${cat._id}-${index}`}
                                            href={`/shop?category=${cat.name}`}
                                            className="inline-flex items-center justify-center w-36 h-24 relative"
                                        >
                                            <Image
                                                src={resolveImageUrl(cat.image) || ""}
                                                alt={cat.name}
                                                fill
                                                unoptimized={true}
                                                className="object-contain p-1 filter brightness-90 hover:brightness-100 transition-all"
                                            />
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="w-full flex justify-center py-10 text-[#FFDDA5]">No product categories found</div>
                            )
                        ) : (
                            /* Service Categories Marquee */
                            serviceCategories.length > 0 ? (
                                <div className="flex space-x-8 animate-marquee whitespace-nowrap items-center">
                                    {[...serviceCategories, ...serviceCategories, ...serviceCategories].map((cat, index) => (
                                        <Link
                                            key={`${cat._id}-${index}`}
                                            href={`/services?category=${cat.name}`}
                                            className="inline-flex flex-col relative w-60 h-36 rounded-2xl overflow-hidden  shadow-lg group  transition-all duration-300 cursor-pointer select-none"
                                        >
                                            {/* Image Background */}
                                            <Image
                                                src={resolveImageUrl(cat.image) || ""}
                                                alt={cat.name}
                                                fill
                                                unoptimized={true}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            {/* Dark Gradient Overlay */}
                                            <div className="absolute inset-0 bg-linear-to-t from-black/65 via-black/30 to-black/10 transition-opacity duration-300 group-hover:from-black/90" />

                                            {/* Content inside card */}
                                            <div className="absolute bottom-4 left-4 text-left">
                                                <h4 className="text-white font-bold text-base tracking-wide group-hover:text-primary transition-colors">
                                                    {cat.name}
                                                </h4>
                                                <span className="text-[10px] text-zinc-200 font-medium uppercase tracking-wider mt-1 block">
                                                    Explore Services
                                                </span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="w-full flex justify-center py-10 text-[#FFDDA5]">No service categories found</div>
                            )
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};

export default AllBrands;
