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
        <div className="min-h-[calc(100vh-180px)]  py-[50px]">
            <div className="container mx-auto px-4">

                {/* Layout: Sidebar + Grid */}
                <div className="grid grid-cols-12 gap-6 lg:gap-10">
                    {/* Filter Sidebar — fluid responsive width */}
                    <div className="col-span-12 lg:col-span-3 shrink-0">
                        <ShopFilter 
                            categoriesList={categoriesList}
                            searchParams={searchParams}
                        />
                    </div>

                    {/* Product Grid + Pagination */}
                    <div className="col-span-12 lg:col-span-9 bg-white/5 p-3 rounded-2xl">
                        <ShopProductGrid 
                            products={products}
                            pagination={pagination}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

