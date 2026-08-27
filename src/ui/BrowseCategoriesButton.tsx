// src/ui/BrowseCategoriesButton.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    LayoutGrid,
    ChevronDown,
    ChevronRight,
} from 'lucide-react';
import { myFetch } from '../../helpers/myFetch';
import { resolveImageUrl } from '../../helpers/resolveImageUrl';

interface Category {
    _id: string;
    name: string;
    slug: string;
    image: string;
    type: string;
}

export default function BrowseCategoriesButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'products' | 'services'>('products');
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [productCategories, setProductCategories] = useState<Category[]>([]);
    const [serviceCategories, setServiceCategories] = useState<Category[]>([]);

    console.log("product", productCategories, productCategories.length > 0 ? resolveImageUrl(productCategories[0]?.image) : "no image yet");

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const prodRes = await myFetch("/categories/active?type=product");
                if (prodRes?.data) setProductCategories(prodRes.data);

                const servRes = await myFetch("/categories/active?type=service");
                if (servRes?.data) setServiceCategories(servRes.data);
            } catch (error) {
                console.error("Failed to fetch categories", error);
            }
        };
        fetchCategories();
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 bg-[#FF6700] hover:bg-orange-500 transition-colors text-white px-5 py-2.5 rounded-lg font-semibold text-sm cursor-pointer shrink-0 w-64 justify-between"
                aria-expanded={isOpen}
            >
                <div className="flex items-center gap-3">
                    <LayoutGrid className="w-5 h-5" />
                    Browse All Categories
                </div>
                <ChevronDown className={`w-4 h-4 ml-1 opacity-80 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute left-0 top-full mt-2 w-[480px] bg-[#4f2c1d]/80 border border-white/50 rounded-xl shadow-2xl shadow-black/80 flex overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* Left Column: Top-level headers (Products, Services) */}
                    <div className="w-[180px] border-r border-white/80 bg-[#4f2c1d] p-2.5 flex flex-col gap-1.5">
                        <button
                            onMouseEnter={() => setActiveTab('products')}
                            onClick={() => setActiveTab('products')}
                            className={`flex items-center justify-between px-4 py-3 text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer text-left group ${activeTab === 'products'
                                ? 'bg-[#FF6700] text-white shadow-md shadow-orange-600/20'
                                : 'text-white hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <span>Products</span>
                            <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${activeTab === 'products' ? 'translate-x-0.5' : 'opacity-40 group-hover:opacity-100'}`} />
                        </button>
                        <button
                            onMouseEnter={() => setActiveTab('services')}
                            onClick={() => setActiveTab('services')}
                            className={`flex items-center justify-between px-4 py-3 text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer text-left group ${activeTab === 'services'
                                ? 'bg-[#FF6700] text-white shadow-md shadow-orange-600/20'
                                : 'text-white hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <span>Services</span>
                            <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${activeTab === 'services' ? 'translate-x-0.5' : 'opacity-40 group-hover:opacity-100'}`} />
                        </button>
                    </div>

                    {/* Right Column: Subcategories list depending on activeTab */}
                    <div className="flex-1 p-3 bg-[#4f2c1d] max-h-[360px] overflow-y-auto animate-in fade-in duration-200">
                        <div className="grid grid-cols-1 gap-1">
                            {(activeTab === 'products' ? productCategories : serviceCategories).map((category) => {
                                const href = activeTab === 'products'
                                    ? `/shop?category=${category.name}`
                                    : `/services?category=${category.name}`;
                                return (
                                    <Link
                                        key={category._id}
                                        href={href}
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 hover:text-primary hover:bg-white/5 rounded-lg transition-colors font-medium group"
                                    >
                                        <Image
                                            src={resolveImageUrl(category.image) || ""}
                                            alt={category.name}
                                            width={18}
                                            height={18}
                                            unoptimized={true}
                                            className="w-[18px] h-[18px] object-cover rounded-full"
                                        />
                                        <span>{category.name}</span>
                                    </Link>
                                );
                            })}

                            {(activeTab === 'products' ? productCategories : serviceCategories).length === 0 && (
                                <div className="px-4 py-3 text-sm text-zinc-400">
                                    Loading categories...
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
