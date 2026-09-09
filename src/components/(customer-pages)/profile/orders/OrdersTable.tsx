'use client';

import { Eye, Star } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/ui/pagination";
import type { Order } from "./types";

export type { Order } from "./types";

interface OrdersTableProps {
  title?: string;
  type?: "product" | "service";
  orders: Order[];
  onSelectOrder: (order: Order) => void;
  onReviewOrder: (order: Order) => void;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

function buildPageRange(current: number, total: number): (number | null)[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | null)[] = [1];
  if (current > 3) pages.push(null);

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 2) pages.push(null);
  pages.push(total);
  return pages;
}

const PAGE_BTN =
  "border border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white transition-all duration-200 rounded-xl cursor-pointer shadow-none";
const PAGE_ACTIVE =
  "bg-primary border border-primary text-white shadow-md shadow-primary/20 hover:bg-primary-hover transition-all duration-200 rounded-xl cursor-pointer";

export default function OrdersTable({
  title = "My Orders",
  type = "product",
  orders,
  onSelectOrder,
  onReviewOrder,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
}: OrdersTableProps) {
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange?.(page);
    }
  };

  const pageRange = buildPageRange(currentPage, totalPages);
  const subtitle =
    type === "product"
      ? "Manage and track all your product orders."
      : "Manage and track all your service requests.";

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-white">{title}</h1>
        <p className="mt-1 text-sm text-white/70">{subtitle}</p>
      </div>

      <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5">
        <div className="hidden grid-cols-12 border-b border-white/10 bg-white/10 px-6 py-4 text-xs font-bold uppercase tracking-wider text-white md:grid">
          <div className="col-span-4">Order details</div>
          <div className="col-span-3">Seller</div>
          <div className="col-span-2">Amount</div>
          <div className="col-span-1 text-center">Status</div>
          <div className="col-span-2 text-center">Action</div>
        </div>

        <div className="divide-y divide-white/10">
          {orders.length === 0 ? (
            <div className="p-8 text-center text-sm font-medium text-white/60">No orders found.</div>
          ) : (
            orders.map((order) => (
              <div key={`${order.id}-${order.dbId || order.title}`}>
                <div className="hidden grid-cols-12 items-center px-6 py-4 transition-colors hover:bg-white/10 md:grid">
                  <div className="col-span-4 pr-4">
                    <p className="text-sm font-semibold text-white">{order.title}</p>
                    <p className="mt-0.5 text-xs text-white/55">
                      ID: {order.id} • {order.date}
                    </p>
                  </div>
                  <div className="col-span-3 pr-4">
                    <span className="text-sm font-semibold text-white/90">{order.sellerName}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-sm font-bold text-primary">{order.amount}</span>
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <StatusBadge status={order.status} />
                  </div>
                  <div className="col-span-2 flex justify-center gap-2">
                    <OrderActions
                      order={order}
                      onSelectOrder={onSelectOrder}
                      onReviewOrder={onReviewOrder}
                    />
                  </div>
                </div>

                <div className="space-y-3 p-4 md:hidden">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-white">{order.title}</p>
                      <p className="mt-0.5 text-xs text-white/55">
                        ID: {order.id} • {order.date}
                      </p>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/80">{order.sellerName}</span>
                    <span className="text-sm font-bold text-primary">{order.amount}</span>
                  </div>
                  <div className="flex justify-end gap-2">
                    <OrderActions
                      order={order}
                      onSelectOrder={onSelectOrder}
                      onReviewOrder={onReviewOrder}
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination>
            <PaginationContent className="flex-wrap justify-center gap-2">
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(currentPage - 1);
                  }}
                  className={`${PAGE_BTN} ${currentPage === 1 ? "pointer-events-none opacity-50" : ""}`}
                />
              </PaginationItem>

              {pageRange.map((page, idx) =>
                page === null ? (
                  <PaginationItem key={`ellipsis-${idx}`}>
                    <PaginationEllipsis className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white" />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(page);
                      }}
                      isActive={currentPage === page}
                      className={currentPage === page ? PAGE_ACTIVE : PAGE_BTN}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ),
              )}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(currentPage + 1);
                  }}
                  className={`${PAGE_BTN} ${currentPage === totalPages ? "pointer-events-none opacity-50" : ""}`}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: Order["status"] }) {
  return (
    <span
      className={`whitespace-nowrap rounded-full border px-3 py-1 text-[11px] font-bold ${
        status === "In Progress"
          ? "border-amber-300/40 bg-amber-400/15 text-amber-200"
          : status === "Completed"
            ? "border-green-300/40 bg-green-400/15 text-green-200"
            : "border-red-300/40 bg-red-400/15 text-red-200"
      }`}
    >
      {status}
    </span>
  );
}

function OrderActions({
  order,
  onSelectOrder,
  onReviewOrder,
}: {
  order: Order;
  onSelectOrder: (order: Order) => void;
  onReviewOrder: (order: Order) => void;
}) {
  return (
    <>
      <button
        type="button"
        onClick={() => onSelectOrder(order)}
        className="rounded-lg p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        aria-label="View order details"
      >
        <Eye className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={() => onReviewOrder(order)}
        className="rounded-lg p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-primary"
        aria-label="Review order"
      >
        <Star className="h-5 w-5" />
      </button>
    </>
  );
}
