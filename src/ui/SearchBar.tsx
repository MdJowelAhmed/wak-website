// src/ui/SearchBar.tsx
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, ShoppingBag, Wrench } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCurrency } from '@/hooks/use-currency';
import { myFetch } from '../../helpers/myFetch';
import { resolveImageUrl } from '../../helpers/resolveImageUrl';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/ui/select';

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

export default function SearchBar({
    placeholder = 'Search...',
    containerClassName = 'relative w-full',
    onClose,
}: SearchBarProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [categoryFilter, setCategoryFilter] = useState('all');

    const router = useRouter();
    const { formatPrice } = useCurrency();
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const cacheRef = useRef<Map<string, SearchResult[]>>(new Map());

    // Debounced search API call with caching
    const performSearch = useCallback(async (term: string) => {
        const trimmed = term.trim().toLowerCase();
        if (!trimmed) {
            setResults([]);
            setIsOpen(false);
            setIsLoading(false);
            return;
        }

        // Return cached results if available
        if (cacheRef.current.has(trimmed)) {
            setResults(cacheRef.current.get(trimmed)!);
            setIsLoading(false);
            setIsOpen(true);
            return;
        }

        try {
            const res = await myFetch(`/search/?searchTerm=${encodeURIComponent(term.trim())}`);
            const data: SearchResult[] = res.success && Array.isArray(res.data) ? res.data : [];

            // Store in cache (maintain max 50 items to keep memory lightweight)
            if (cacheRef.current.size >= 50) {
                const firstKey = cacheRef.current.keys().next().value;
                if (firstKey) cacheRef.current.delete(firstKey);
            }
            cacheRef.current.set(trimmed, data);

            setResults(data);
        } catch {
            setResults([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        const trimmed = query.trim().toLowerCase();

        if (!trimmed) {
            setResults([]);
            setIsOpen(false);
            setIsLoading(false);
            setActiveIndex(-1);
            return;
        }

        // Instant response from cache without skeleton or network delay
        if (cacheRef.current.has(trimmed)) {
            setResults(cacheRef.current.get(trimmed)!);
            setIsLoading(false);
            setIsOpen(true);
            return;
        }

        // If not cached, show skeleton and fetch with debounce
        setIsLoading(true);
        setIsOpen(true);

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

    const filteredResults = results.filter(
        (item) => categoryFilter === 'all' || item.type === categoryFilter
    );

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
        if (!isOpen || filteredResults.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIndex((prev) => (prev < filteredResults.length - 1 ? prev + 1 : 0));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIndex((prev) => (prev > 0 ? prev - 1 : filteredResults.length - 1));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (activeIndex >= 0 && filteredResults[activeIndex]) {
                navigateTo(filteredResults[activeIndex]);
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
        setIsLoading(false);
        setActiveIndex(-1);
        inputRef.current?.focus();
    };

    const showDropdown = isOpen && query.trim().length > 0;

    return (
        <div className={containerClassName} ref={containerRef}>
            {/* Input Row with Category Dropdown */}
            <div className="flex items-center w-full bg-card border border-border focus-within:border-primary rounded-xl shadow-2xs overflow-hidden transition-all">
                {/* Category Select Component */}
                <div className="hidden sm:block shrink-0">
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger className="border-0 border-r border-border rounded-none bg-primary hover:bg-primary/90 text-foreground text-xs font-semibold h-full px-3 py-3 focus:ring-0 focus:ring-offset-0 shadow-none cursor-pointer">
                            <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent className="bg-primary text-foreground shadow-xl rounded-xl z-[250]">
                            <SelectItem value="all" className="text-xs font-medium cursor-pointer focus:bg-secondary focus:text-foreground">All Categories</SelectItem>
                            <SelectItem value="product" className="text-xs font-medium cursor-pointer focus:bg-secondary focus:text-foreground">Products</SelectItem>
                            <SelectItem value="service" className="text-xs font-medium cursor-pointer focus:bg-secondary focus:text-foreground">Services</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Search Input with Left Search Icon */}
                <div className="relative flex-1 flex items-center pl-3 sm:pl-3.5">
                    <Search className="w-4 h-4 text-muted-text shrink-0 mr-2" />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder={placeholder || "Search products, services..."}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onFocus={() => {
                            if (query.trim()) setIsOpen(true);
                        }}
                        className="w-full bg-transparent py-2.5 pr-3 text-xs sm:text-sm text-secondary placeholder:text-muted-text outline-none"
                        autoComplete="off"
                        aria-label="Search products and services"
                    />
                    {query && (
                        <button
                            onClick={clearQuery}
                            className="mr-3 text-muted-text hover:text-foreground transition-colors cursor-pointer shrink-0"
                            aria-label="Clear search"
                            type="button"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* Dropdown */}
            {showDropdown && (
                <div
                    role="listbox"
                    aria-label="Search suggestions"
                    className="absolute left-0 right-0 top-full mt-2 z-[200] bg-white rounded-xl shadow-2xl shadow-black/20 border border-gray-100 overflow-hidden"
                    style={{ maxHeight: '420px', overflowY: 'auto' }}
                >
                    {isLoading ? (
                        <div className="p-3 space-y-2">
                            <div className="px-2 pt-1 pb-1">
                                <div className="h-3 bg-gray-200 rounded w-28 animate-pulse" />
                            </div>
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg animate-pulse">
                                    <div className="w-12 h-12 rounded-lg bg-gray-200 shrink-0" />
                                    <div className="flex-1 min-w-0 space-y-2">
                                        <div className="h-3.5 bg-gray-200 rounded w-3/4" />
                                        <div className="flex items-center gap-2">
                                            <div className="h-3 bg-gray-200 rounded-full w-14" />
                                            <div className="h-3 bg-gray-200 rounded w-10" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : filteredResults.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                            <Search className="w-8 h-8 mb-2 opacity-30" />
                            <p className="text-sm font-medium">No results for &ldquo;{query}&rdquo;</p>
                            <p className="text-xs mt-1 text-gray-300">Try a different keyword</p>
                        </div>
                    ) : (
                        <>
                            <div className="px-4 pt-3 pb-1">
                                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                    {filteredResults.length} result{filteredResults.length !== 1 ? 's' : ''}
                                </span>
                            </div>
                            <ul className="divide-y divide-gray-50 pb-2">
                                {filteredResults.map((item, index) => (
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

