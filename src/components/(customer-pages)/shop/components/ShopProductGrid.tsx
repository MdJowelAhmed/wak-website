"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/shared/ProductCard";
import { FilterState } from "./ShopFilter";
import { myFetch } from "../../../../../helpers/myFetch";
import { resolveImageUrl } from "../../../../../helpers/resolveImageUrl";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/ui/pagination"
import { Product } from "../../home/components/NewArrival";

interface ShopProductGridProps {
    filters?: FilterState;
}

export default function ShopProductGrid({ filters }: ShopProductGridProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                // Construct query params
                const params = new URLSearchParams();
                if (filters?.priceMin !== undefined) params.append("minPrice", filters.priceMin.toString());
                if (filters?.priceMax !== undefined) params.append("maxPrice", filters.priceMax.toString());
                if (filters?.categories && filters.categories.length > 0) {
                    params.append("category", filters.categories[0]);
                }
                if (filters?.brands && filters.brands.length > 0) {
                    // Send first brand for now if API expects single brand ID
                    params.append("brand", filters.brands[0]);
                }
                if (filters?.rating !== null && filters?.rating !== undefined) {
                    params.append("minRating", filters.rating.toString());
                }

                const res = await myFetch(`/products?${params.toString()}`);
                if (res?.data) {
                    setProducts(res.data);
                } else {
                    setProducts([]);
                }
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };

        // If filters are ready, fetch
        if (filters) {
            fetchProducts();
        }
    }, [filters]);

    return (
        <div className="flex-1 flex flex-col gap-6">
            {/* Product Grid */}
            {loading ? (
                <div className="flex justify-center items-center py-20 text-[#FFDDA5]">
                    Loading products...
                </div>
            ) : products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    {products.map((product) => (
                        <ProductCard key={product._id} product={{
                            id: product.slug || (product._id as any),
                            name: product.name,
                            image: resolveImageUrl(product.images?.[0]) || "/placeholder.jpg",
                            currentPrice: product.discountPrice || product.price,
                            originalPrice: product.price,
                            discount: product.discountPrice ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0,
                            rating: product.ratingAverage || 0,
                            reviews: product.ratingCount || 0
                        }} />
                    ))}
                </div>
            ) : (
                <div className="flex justify-center items-center py-20 text-white/50">
                    No products found matching your criteria.
                </div>
            )}

            {/* Pagination + Info Row */}
            {products.length > 0 && (
                <div className="flex items-center justify-center gap-4 pt-8 pb-4">
                    <Pagination>
                        <PaginationContent className="gap-2">
                            <PaginationItem>
                                <PaginationPrevious href="#" className="bg-white border border-zinc-200 text-zinc-800 hover:bg-zinc-100 hover:text-zinc-900 transition-all duration-200 shadow-sm rounded-xl cursor-pointer" />
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink href="#" className="bg-white border border-zinc-200 text-zinc-800 hover:bg-zinc-100 hover:text-zinc-900 transition-all duration-200 shadow-sm rounded-xl cursor-pointer">
                                    1
                                </PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink href="#" isActive className="bg-primary border border-primary text-white shadow-md shadow-primary/20 hover:bg-orange-500 transition-all duration-200 rounded-xl cursor-pointer">
                                    2
                                </PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink href="#" className="bg-white border border-zinc-200 text-zinc-800 hover:bg-zinc-100 hover:text-zinc-900 transition-all duration-200 shadow-sm rounded-xl cursor-pointer">
                                    3
                                </PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationEllipsis className="bg-white border border-zinc-200 text-zinc-800 rounded-xl h-10 w-10 shadow-sm flex items-center justify-center" />
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationNext href="#" className="bg-white border border-zinc-200 text-zinc-800 hover:bg-zinc-100 hover:text-zinc-900 transition-all duration-200 shadow-sm rounded-xl cursor-pointer" />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}
        </div>
    );
}
