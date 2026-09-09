"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import ProductCard from "@/shared/ProductCard";
import { resolveImageUrl } from "../../../../../helpers/resolveImageUrl";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/ui/pagination";
import { Product } from "../../home/components/NewArrival";
import { PaginationData } from "../index";

interface ShopProductGridProps {
    products: Product[];
    pagination: PaginationData;
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

export default function ShopProductGrid({ products = [], pagination }: ShopProductGridProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const currentPage = pagination?.page ?? 1;
    const totalPage = pagination?.totalPage ?? 1;

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPage) {
            const params = new URLSearchParams(searchParams.toString());
            params.set("page", newPage.toString());
            router.push(`${pathname}?${params.toString()}`);
        }
    };

    const pageRange = buildPageRange(currentPage, totalPage);

    return (
        <div className="flex-1 flex flex-col gap-6">
            {/* Product Grid */}
            {products.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    {products.map((product) => (
                        <ProductCard key={product._id} product={{
                            id: product.slug || product._id,
                            productId: product._id,
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
            {totalPage > 1 && (
                <div className="flex flex-col items-center gap-2 pt-8 pb-4">
                    <Pagination>
                        <PaginationContent className="gap-2 flex-wrap justify-center">
                            {/* Previous */}
                            <PaginationItem>
                                <PaginationPrevious
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (currentPage > 1) handlePageChange(currentPage - 1);
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
                                                handlePageChange(page);
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
                                        if (currentPage < totalPage) handlePageChange(currentPage + 1);
                                    }}
                                    className={`${LINK_BASE} ${currentPage === totalPage ? LINK_DISABLED : ""}`}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}
        </div>
    );
}


