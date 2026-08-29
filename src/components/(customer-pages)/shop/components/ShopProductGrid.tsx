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

const LINK_BASE = "bg-white border border-zinc-200 text-zinc-800 hover:bg-zinc-100 hover:text-zinc-900 transition-all duration-200 shadow-sm rounded-xl cursor-pointer";
const LINK_ACTIVE = "bg-primary border border-primary text-white shadow-md shadow-primary/20 hover:bg-orange-500 transition-all duration-200 rounded-xl cursor-pointer";
const LINK_DISABLED = "pointer-events-none opacity-40";

/** Returns the page numbers to display, inserting `null` for ellipsis. */
function buildPageRange(current: number, total: number): (number | null)[] {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

    const pages: (number | null)[] = [1];

    if (current > 3) pages.push(null); // left ellipsis

    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
    for (let i = start; i <= end; i++) pages.push(i);

    if (current < total - 2) pages.push(null); // right ellipsis

    pages.push(total);
    return pages;
}

export default function ShopProductGrid({ filters }: ShopProductGridProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [total, setTotal] = useState(0);

    // Reset to page 1 whenever filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [filters]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const params = new URLSearchParams();
                if (filters?.priceMin !== undefined) params.append("minPrice", filters.priceMin.toString());
                if (filters?.priceMax !== undefined) params.append("maxPrice", filters.priceMax.toString());
                if (filters?.categories && filters.categories.length > 0) {
                    params.append("category", filters.categories[0]);
                }
                if (filters?.rating !== null && filters?.rating !== undefined) {
                    params.append("minRating", filters.rating.toString());
                }
                // Discount filter: send only when one option is exclusively selected
                const offers = filters?.offers ?? [];
                if (offers.includes("discounted") && !offers.includes("regular")) {
                    params.append("discount", "true");
                } else if (offers.includes("regular") && !offers.includes("discounted")) {
                    params.append("discount", "false");
                }
                // Both or neither selected → no discount param (backend returns all)
                params.append("page", currentPage.toString());
                params.append("limit", "12");

                const res = await myFetch(`/products?${params.toString()}`);
                if (res?.data) {
                    setProducts(res.data);
                    if (res.pagination) {
                        setTotalPage(res.pagination.totalPage ?? 1);
                        setTotal(res.pagination.total ?? 0);
                    }
                } else {
                    setProducts([]);
                    setTotalPage(1);
                    setTotal(0);
                }
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };

        if (filters) {
            fetchProducts();
        }
    }, [filters, currentPage]);

    const pageRange = buildPageRange(currentPage, totalPage);

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
                            id: product.slug || (product._id as string),
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

            {/* Pagination */}
            {!loading && totalPage > 1 && (
                <div className="flex flex-col items-center gap-2 pt-8 pb-4">
                    <Pagination>
                        <PaginationContent className="gap-2 flex-wrap justify-center">
                            {/* Previous */}
                            <PaginationItem>
                                <PaginationPrevious
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (currentPage > 1) setCurrentPage((p) => p - 1);
                                    }}
                                    className={`${LINK_BASE} ${currentPage === 1 ? LINK_DISABLED : ""}`}
                                />
                            </PaginationItem>

                            {/* Page numbers */}
                            {pageRange.map((page, idx) =>
                                page === null ? (
                                    <PaginationItem key={`ellipsis-${idx}`}>
                                        <PaginationEllipsis className="bg-white border border-zinc-200 text-zinc-800 rounded-xl h-10 w-10 shadow-sm flex items-center justify-center" />
                                    </PaginationItem>
                                ) : (
                                    <PaginationItem key={page}>
                                        <PaginationLink
                                            href="#"
                                            isActive={page === currentPage}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setCurrentPage(page);
                                            }}
                                            className={page === currentPage ? LINK_ACTIVE : LINK_BASE}
                                        >
                                            {page}
                                        </PaginationLink>
                                    </PaginationItem>
                                )
                            )}

                            {/* Next */}
                            <PaginationItem>
                                <PaginationNext
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (currentPage < totalPage) setCurrentPage((p) => p + 1);
                                    }}
                                    className={`${LINK_BASE} ${currentPage === totalPage ? LINK_DISABLED : ""}`}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>

                    {/* Info text */}
                    {/* <p className="text-xs text-white/40 mt-1">
                        Page {currentPage} of {totalPage} — {total} products
                    </p> */}
                </div>
            )}
        </div>
    );
}

