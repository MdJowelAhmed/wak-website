// src/components/(customer-pages)/profile/orders/OrdersTable.tsx
'use client';

import { Plus, Eye, Star } from "lucide-react";
import { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/ui/pagination";

export interface Order {
  id: string;
  dbId?: string;
  itemId?: string;
  title: string;
  date: string;
  sellerName: string;
  sellerAvatar: string;
  sellerId?: string;
  amount: string;
  status: "In Progress" | "Completed" | "Canceled";
  statusLog?: { status: string; timestamp: string; note: string }[];
}

interface OrdersTableProps {
  title?: string;
  orders: Order[];
  onSelectOrder: (order: Order) => void;
  onReviewOrder: (order: Order) => void;
}

export default function OrdersTable({ title = "My Orders", orders, onSelectOrder, onReviewOrder }: OrdersTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(orders.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentOrders = orders.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div>
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">{title}</h1>
          <p className="text-sm text-zinc-500 mt-1">Manage and track all your active service requests.</p>
        </div>
      </div>
 
      {/* Orders Table Container */}
      <div className="rounded-xl overflow-hidden border border-zinc-200 bg-white shadow-md">
        {/* Table Header Bar */}
        <div className="bg-primary/5 text-primary border-b border-zinc-250/20 grid grid-cols-12 px-6 py-4 text-xs font-bold uppercase tracking-wider">
          <div className="col-span-4">ORDER DETAILS</div>
          <div className="col-span-3">SELLER</div>
          <div className="col-span-2">AMOUNT</div>
          <div className="col-span-1 text-center">STATUS</div>
          <div className="col-span-2 text-center">ACTION</div>
        </div>
 
        {/* Table Rows */}
        <div className="divide-y divide-zinc-100">
          {currentOrders.length === 0 ? (
            <div className="p-8 text-center text-zinc-500">No orders found.</div>
          ) : currentOrders.map((order, index) => (
            <div
              key={order.id + order.title}
              className={`grid grid-cols-12 items-center px-6 py-4.5 transition-colors hover:bg-zinc-50/80 ${index % 2 === 0 ? 'bg-zinc-50/20' : 'bg-white'
                }`}
            >
              {/* ORDER DETAILS */}
              <div className="col-span-4 pr-4">
                <p className="font-semibold text-zinc-900 text-sm">{order.title}</p>
                <p className="text-xs text-zinc-500 mt-0.5">ID: {order.id} • {order.date}</p>
              </div>
 
              {/* SELLER */}
              <div className="col-span-3 flex items-center gap-3 pr-4">
                <span className="text-zinc-800 text-sm font-semibold">{order.sellerName}</span>
              </div>
 
              {/* AMOUNT */}
              <div className="col-span-2">
                <span className="text-zinc-900 font-bold text-sm">{order.amount}</span>
              </div>
 
              {/* STATUS */}
              <div className="col-span-1 flex justify-center">
                <span
                  className={`px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap border ${order.status === 'In Progress'
                    ? 'bg-amber-50 text-amber-600 border-amber-200'
                    : order.status === 'Completed'
                      ? 'bg-green-50 text-green-600 border-green-200'
                      : 'bg-red-50 text-red-600 border-red-200'
                    }`}
                >
                  {order.status}
                </span>
              </div>
 
              {/* ACTION */}
              <div className="col-span-2 flex justify-center gap-3">
                <button
                  onClick={() => onSelectOrder(order)}
                  className="p-2 text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer rounded-lg hover:bg-zinc-100"
                  aria-label="View Order Details"
                >
                  <Eye className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onReviewOrder(order)}
                  className="p-2 text-zinc-500 hover:text-amber-500 transition-colors cursor-pointer rounded-lg hover:bg-zinc-100"
                  aria-label="Review Order"
                >
                  <Star className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Container */}
      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination>
            <PaginationContent className="gap-2">
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(currentPage - 1);
                  }}
                  className={`bg-white border border-zinc-200 text-zinc-800 hover:bg-zinc-100 hover:text-zinc-900 transition-all duration-200 shadow-sm rounded-xl cursor-pointer ${
                    currentPage === 1 ? "opacity-50 pointer-events-none" : ""
                  }`}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(page);
                    }}
                    isActive={currentPage === page}
                    className={
                      currentPage === page
                        ? "bg-primary border border-primary text-white shadow-md shadow-primary/20 hover:bg-orange-500 transition-all duration-200 rounded-xl cursor-pointer"
                        : "bg-white border border-zinc-200 text-zinc-800 hover:bg-zinc-100 hover:text-zinc-900 transition-all duration-200 shadow-sm rounded-xl cursor-pointer"
                    }
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(currentPage + 1);
                  }}
                  className={`bg-white border border-zinc-200 text-zinc-800 hover:bg-zinc-100 hover:text-zinc-900 transition-all duration-200 shadow-sm rounded-xl cursor-pointer ${
                    currentPage === totalPages ? "opacity-50 pointer-events-none" : ""
                  }`}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
