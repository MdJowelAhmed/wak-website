'use client';

import { useState } from 'react';
import type { Category } from '../../helpers/categoryService';
import { isFeaturedCategory, type CategoryKind } from '../../helpers/categoryUtils';
import CategoryCard from './CategoryCard';
import { cn } from '@/lib/utils';

interface CategoryListPageProps {
    title: string;
    description: string;
    kind: CategoryKind;
    initialCategories?: Category[];
}

export default function CategoryListPage({
    title,
    description,
    kind,
    initialCategories = [],
}: CategoryListPageProps) {
    const [tab, setTab] = useState<'all' | 'featured'>('all');
    const featuredCategories = initialCategories.filter(isFeaturedCategory);
    const activeCategories = tab === 'all' ? initialCategories : featuredCategories;
    const emptyMessage =
        tab === 'all'
            ? `No ${kind} categories found`
            : `No featured ${kind} categories found`;

    return (
        <div className="min-h-screen bg-background py-10 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto max-w-7xl">
                <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="mb-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
                            {title}
                        </h1>
                        <p className="text-sm text-foreground/80 sm:text-base">{description}</p>
                    </div>

                    <div className="inline-flex select-none self-start rounded-xl bg-white/10 p-1 backdrop-blur-sm md:self-auto">
                        <button
                            type="button"
                            onClick={() => setTab('all')}
                            className={cn(
                                'cursor-pointer whitespace-nowrap rounded-lg px-4 py-2 text-xs font-semibold transition-all sm:text-sm',
                                tab === 'all'
                                    ? 'bg-primary text-white shadow-md'
                                    : 'text-white/80 hover:bg-white/10 hover:text-white',
                            )}
                        >
                            All Categories ({initialCategories.length})
                        </button>
                        <button
                            type="button"
                            onClick={() => setTab('featured')}
                            className={cn(
                                'cursor-pointer whitespace-nowrap rounded-lg px-4 py-2 text-xs font-semibold transition-all sm:text-sm',
                                tab === 'featured'
                                    ? 'bg-primary text-white shadow-md'
                                    : 'text-white/80 hover:bg-white/10 hover:text-white',
                            )}
                        >
                            Featured Categories ({featuredCategories.length})
                        </button>
                    </div>
                </div>

                {activeCategories.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 md:grid-cols-4 lg:grid-cols-6">
                        {activeCategories.map((category) => (
                            <CategoryCard
                                key={category._id}
                                category={category}
                                kind={kind}
                                layout="grid"
                            />
                        ))}
                    </div>
                ) : (
                    <div className="rounded-2xl border border-card-border bg-card/40 py-16 text-center font-medium text-foreground/80">
                        {emptyMessage}
                    </div>
                )}
            </div>
        </div>
    );
}
