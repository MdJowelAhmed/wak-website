'use client';

import { useState } from "react";
import { MessageCircle, CheckCircle2, ArrowLeft, Loader2 } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import DashboardCard from "../../../../shared/DashboardCard";
import OrderTimeline from "./OrderTimeline";
import type { Order } from "./types";
import OrdersTable from "./OrdersTable";
import ReviewModal from "./ReviewModal";
import { myFetch } from "../../../../../helpers/myFetch";
import { Button } from "@/ui/button";

export interface OrdersPagination {
  total: number;
  page: number;
  limit: number;
  totalPage: number;
}

interface OrdersPageProps {
  title?: string;
  type?: "product" | "service";
  initialOrders?: Order[];
  pagination?: OrdersPagination;
}

export default function OrdersPage({
  title = "My Orders",
  type = "product",
  initialOrders = [],
  pagination,
}: OrdersPageProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [reviewOrder, setReviewOrder] = useState<Order | null>(null);
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const currentPage = pagination?.page ?? 1;
  const totalPages = pagination?.totalPage ?? 1;

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams();
    if (page > 1) params.set("page", String(page));
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  const handleMessageSeller = async () => {
    if (!selectedOrder?.sellerId) {
      toast.error("Seller information is missing");
      return;
    }

    setIsCreatingChat(true);
    try {
      const res = await myFetch("/chats/", {
        method: "POST",
        body: { otherParticipantId: selectedOrder.sellerId },
      });

      if (res?.success) {
        const chatId = res.data?._id || res.data?.id;
        if (chatId) {
          router.push(`/profile/message/${chatId}`);
        } else {
          router.push("/profile/message");
        }
      } else {
        toast.error(res?.message || "Failed to initiate chat");
      }
    } catch (error) {
      console.error("Error creating chat:", error);
      toast.error("An error occurred while initiating chat");
    } finally {
      setIsCreatingChat(false);
    }
  };

  if (!selectedOrder) {
    return (
      <DashboardCard className="border-white/10 bg-secondary p-6 md:p-8">
        <OrdersTable
          title={title}
          type={type}
          orders={initialOrders}
          onSelectOrder={setSelectedOrder}
          onReviewOrder={setReviewOrder}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
        <ReviewModal
          order={reviewOrder}
          isOpen={!!reviewOrder}
          onClose={() => setReviewOrder(null)}
          type={type}
        />
      </DashboardCard>
    );
  }

  return (
    <DashboardCard className="border-white/10 bg-secondary p-6 md:p-8">
      <button
        type="button"
        onClick={() => setSelectedOrder(null)}
        className="group mb-8 flex items-center gap-2 text-xs font-semibold text-white/70 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Back to {title}
      </button>

      <div className="mb-8 flex flex-col justify-between gap-4 border-b border-white/15 pb-6 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-medium tracking-wide text-white/60">
            Active {type === "product" ? "Product" : "Service"} Order {selectedOrder.id}
          </p>
          <h1 className="mt-1 text-2xl font-bold text-white">{selectedOrder.title}</h1>
        </div>

        <Button
          type="button"
          onClick={handleMessageSeller}
          disabled={isCreatingChat}
          className="shrink-0 self-start rounded-xl shadow-md shadow-primary/20 sm:self-auto"
        >
          {isCreatingChat ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <MessageCircle className="h-4 w-4" />
          )}
          Message Seller
        </Button>
      </div>

      <div className="mb-8 flex items-center gap-2">
        <CheckCircle2 className="h-4 w-4 text-primary" />
        <span className="text-sm font-semibold text-white/80">
          {type === "product" ? "Product" : "Service"} Delivery Milestones
        </span>
      </div>

      <OrderTimeline statusLog={selectedOrder.statusLog} />
    </DashboardCard>
  );
}
