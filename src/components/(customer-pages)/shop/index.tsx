"use client";

import ShopFilter, { Category } from "./components/ShopFilter";
import ShopProductGrid from "./components/ShopProductGrid";
import { Product } from "../home/components/NewArrival";

export interface PaginationData {
    total: number;
    page: number;
    limit: number;
    totalPage: number;
}

interface ShopProps {
    products: Product[];
    pagination: PaginationData;
    categoriesList: Category[];
    searchParams?: { [key: string]: string | string[] | undefined };
}

export default function Shop({ products, pagination, categoriesList, searchParams }: ShopProps) {
    return (
        <div className="min-h-[calc(100vh-180px)] py-8 md:py-[50px]">
            <div className="container mx-auto px-4">
                <ShopFilter
                    categoriesList={categoriesList}
                    searchParams={searchParams}
                >
                    <ShopProductGrid
                        products={products}
                        pagination={pagination}
                    />
                </ShopFilter>
            </div>
        </div>
    );
}
