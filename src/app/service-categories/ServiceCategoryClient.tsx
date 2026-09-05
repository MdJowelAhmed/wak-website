'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Category } from '../../../helpers/categoryService';
import { resolveImageUrl } from '../../../helpers/resolveImageUrl';

export default function ServiceCategoryClient({ initialCategories = [] }: { initialCategories: Category[] }) {
    const [tab, setTab] = useState<'all' | 'featured'>('all');

    const featuredCategories = initialCategories.filter(
        (c) => c.isFeatured === true || String(c.isFeatured).toLowerCase() === 'true' || (c as any).isFeatured === 1
    );

    const activeCategories = tab === 'all' ? initialCategories : featuredCategories;

    return (
        <div className="min-h-screen bg-background py-10 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto max-w-7xl">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-4 h-9 bg-primary rounded-xs" />
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
                                Service Categories
                            </h1>
                        </div>
                        <p className="text-muted-text text-sm sm:text-base">
                            Browse all available service categories or filter by featured categories.
                        </p>
                    </div>

                    {/* Tabs */}
                    <div className="inline-flex bg-white/10 p-1 rounded-xl backdrop-blur-sm select-none self-start md:self-auto">
                        <button
                            type="button"
                            onClick={() => setTab('all')}
                            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                                tab === 'all'
                                    ? 'bg-primary text-white shadow-md'
                                    : 'text-white/80 hover:text-white hover:bg-white/10'
                            }`}
                        >
                            All Categories ({initialCategories.length})
                        </button>
                        <button
                            type="button"
                            onClick={() => setTab('featured')}
                            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                                tab === 'featured'
                                    ? 'bg-primary text-white shadow-md'
                                    : 'text-white/80 hover:text-white hover:bg-white/10'
                            }`}
                        >
                            Featured Categories ({featuredCategories.length})
                        </button>
                    </div>
                </div>

                {activeCategories.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
                        {activeCategories.map((cat) => (
                            <Link
                                key={cat._id}
                                href={`/services?category=${encodeURIComponent(cat.name)}`}
                                className="group flex flex-col items-center justify-between gap-3 p-3.5 rounded-2xl bg-card border border-card-border hover:border-primary/60 transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-1 cursor-pointer select-none"
                            >
                                <div className="w-full aspect-square relative rounded-xl overflow-hidden bg-white p-3 shadow-inner flex items-center justify-center">
                                    <Image
                                        src={resolveImageUrl(cat.image) || "/placeholder.jpg"}
                                        alt={cat.name}
                                        fill
                                        unoptimized={true}
                                        className="object-cover p-2 group-hover:scale-110 transition-transform duration-300"
                                    />
                                </div>
                                <span className="text-xs sm:text-sm font-semibold text-white group-hover:text-primary transition-colors text-center w-full line-clamp-2 leading-tight">
                                    {cat.name}
                                </span>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-card/40 rounded-2xl border border-card-border text-accent font-medium">
                        {tab === 'all' ? 'No service categories found' : 'No featured service categories found'}
                    </div>
                )}
            </div>
        </div>
    );
}
