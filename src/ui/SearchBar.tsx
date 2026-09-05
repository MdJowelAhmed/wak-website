// src/ui/SearchBar.tsx
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, ShoppingBag, Wrench, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { myFetch } from '../../helpers/myFetch';
import { resolveImageUrl } from '../../helpers/resolveImageUrl';

interface SearchResult {
    _id: string;
    name: string;
    slug: string;
    image: string;
    price: number;
    discountPrice: number;
    type: 'product' | 'service';
}

interface SearchBarProps {
    placeholder?: string;
    containerClassName?: string;
    inputClassName?: string;
    iconClassName?: string;
    onClose?: () => void;
}

function formatPrice(price: number) {
    return '৳' + new Intl.NumberFormat('en-US').format(price);
}

export default function SearchBar({
    placeholder = 'Search...',
    containerClassName = 'relative w-full',
    inputClassName = 'w-full bg-white/10 border border-white/15 focus:border-[#FF6700]/70 focus:bg-white/15 rounded-full py-2.5 pl-11 pr-4 text-sm text-white outline-none transition-all placeholder:text-white/50 backdrop-blur-sm',
    iconClassName = 'absolute left-3.5 top-1/2 -translate-y-1/2 text-white/50 w-4.5 h-4.5',
    onClose,
}: SearchBarProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);

    const router = useRouter();
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Debounced search
    const performSearch = useCallback(async (term: string) => {
        if (!term.trim()) {
            setResults([]);
            setIsOpen(false);
            return;
        }

        setIsLoading(true);
        try {
            const res = await myFetch(`/search/?searchTerm=${encodeURIComponent(term.trim())}`);
            if (res.success && Array.isArray(res.data)) {
                setResults(res.data);
            } else {
                setResults([]);
            }
            setIsOpen(true);
        } catch {
            setResults([]);
            setIsOpen(true);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        if (!query.trim()) {
            setResults([]);
            setIsOpen(false);
            setActiveIndex(-1);
            return;
        }
        debounceRef.current = setTimeout(() => {
            performSearch(query);
        }, 350);
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [query, performSearch]);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
                setActiveIndex(-1);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const navigateTo = (item: SearchResult) => {
        const path = item.type === 'product' ? `/shop/${item.slug}` : `/services/${item.slug}`;
        setIsOpen(false);
        setQuery('');
        setResults([]);
        setActiveIndex(-1);
        onClose?.();
        router.push(path);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!isOpen || results.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (activeIndex >= 0 && results[activeIndex]) {
                navigateTo(results[activeIndex]);
            }
        } else if (e.key === 'Escape') {
            setIsOpen(false);
            setActiveIndex(-1);
            inputRef.current?.blur();
        }
    };

    const clearQuery = () => {
        setQuery('');
        setResults([]);
        setIsOpen(false);
        setActiveIndex(-1);
        inputRef.current?.focus();
    };

    const showDropdown = isOpen && query.trim().length > 0;

    const [categoryFilter, setCategoryFilter] = useState('all');

    return (
        <div className={containerClassName} ref={containerRef}>
            {/* Input Row with Category Dropdown & Search Button */}
            <div className="flex items-center w-full bg-card border border-border focus-within:border-primary rounded-xl shadow-2xs overflow-hidden transition-all">
                {/* Category Dropdown */}
                <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="hidden sm:block bg-section-bg border-r border-border text-foreground text-xs font-semibold px-3 py-2.5 outline-none cursor-pointer hover:bg-section-bg/80 transition-colors"
                >
                    <option value="all">All Categories</option>
                    <option value="product">Products</option>
                    <option value="service">Services</option>
                </select>

                {/* Search Input */}
                <div className="relative flex-1 flex items-center">
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder={placeholder || "Search products, services & categories..."}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onFocus={() => {
                            if (query.trim() && results.length > 0) setIsOpen(true);
                        }}
                        className="w-full bg-transparent py-2.5 px-3 sm:px-4 text-xs sm:text-sm text-foreground placeholder:text-muted-text outline-none"
                        autoComplete="off"
                        aria-label="Search products and services"
                    />
                    {query && (
                        <button
                            onClick={clearQuery}
                            className="mr-2 text-muted-text hover:text-foreground transition-colors cursor-pointer"
                            aria-label="Clear search"
                            type="button"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Search Button */}
                <button
                    onClick={() => performSearch(query)}
                    className="bg-primary hover:bg-primary-hover text-white px-4 py-2.5 flex items-center justify-center gap-1.5 text-xs font-bold transition-colors shrink-0 cursor-pointer"
                    aria-label="Search"
                >
                    {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Search className="w-4 h-4" />
                    )}
                    <span className="hidden md:inline">Search</span>
                </button>
            </div>

            {/* Dropdown */}
            {showDropdown && (
                <div
                    role="listbox"
                    aria-label="Search suggestions"
                    className="absolute left-0 right-0 top-full mt-2 z-[200] bg-white rounded-xl shadow-2xl shadow-black/20 border border-gray-100 overflow-hidden"
                    style={{ maxHeight: '420px', overflowY: 'auto' }}
                >
                    {results.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                            <Search className="w-8 h-8 mb-2 opacity-30" />
                            <p className="text-sm font-medium">No results for &ldquo;{query}&rdquo;</p>
                            <p className="text-xs mt-1 text-gray-300">Try a different keyword</p>
                        </div>
                    ) : (
                        <>
                            <div className="px-4 pt-3 pb-1">
                                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                    {results.length} result{results.length !== 1 ? 's' : ''}
                                </span>
                            </div>
                            <ul className="divide-y divide-gray-50 pb-2">
                                {results.map((item, index) => (
                                    <li
                                        key={item._id}
                                        role="option"
                                        aria-selected={activeIndex === index}
                                        onClick={() => navigateTo(item)}
                                        onMouseEnter={() => setActiveIndex(index)}
                                        className={`flex items-center gap-3 px-4 py-2 cursor-pointer transition-colors group
                                            ${activeIndex === index
                                                ? 'bg-orange-50'
                                                : 'hover:bg-gray-50'
                                            }`}
                                    >
                                        {/* Thumbnail */}
                                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                                            <Image
                                                src={resolveImageUrl(item.image) || 'https://placehold.co/48x48'}
                                                alt={item.name}
                                                fill
                                                sizes="48px"
                                                className="object-cover"
                                                unoptimized
                                            />
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-gray-800 truncate group-hover:text-orange-600 transition-colors">
                                                {item.name}
                                            </p>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                {/* Type badge */}
                                                <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full 
                                                    ${item.type === 'product'
                                                        ? 'bg-blue-100 text-blue-600'
                                                        : 'bg-emerald-100 text-emerald-600'
                                                    }`}>
                                                    {item.type === 'product'
                                                        ? <ShoppingBag className="w-2.5 h-2.5" />
                                                        : <Wrench className="w-2.5 h-2.5" />
                                                    }
                                                    {item.type === 'product' ? 'Product' : 'Service'}
                                                </span>

                                                {/* Price */}
                                                {item.discountPrice > 0 ? (
                                                    <div className="flex items-center gap-1">
                                                        <span className="text-xs font-bold text-orange-600">
                                                            {formatPrice(item.discountPrice)}
                                                        </span>
                                                        <span className="text-[10px] text-gray-400 line-through">
                                                            {formatPrice(item.price)}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs font-bold text-gray-700">
                                                        {formatPrice(item.price)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Arrow indicator */}
                                        <div className={`shrink-0 text-gray-300 transition-all duration-150
                                            ${activeIndex === index ? 'text-orange-400 translate-x-0.5' : 'group-hover:text-gray-400'}`}>
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
