'use client';

import { useState } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import DashboardCard from "../../../../shared/DashboardCard";
import type { Order } from "./types";
import OrdersTable from "./OrdersTable";
import OrderDetails from "./OrderDetails";
import ReviewModal from "./ReviewModal";
import { myFetch } from "../../../../../helpers/myFetch";

export interface OrdersPagination {
  total: number;
  page: number;
  limit: number;
  totalPage: number;
}

interface OrdersPageProps {
  type?: "product" | "service";
  initialOrders?: Order[];
  pagination?: OrdersPagination;
}

export default function OrdersPage({
  type = "product",
  initialOrders = [],
  pagination,
}: OrdersPageProps) {
  const t = useTranslations("Orders");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [reviewOrder, setReviewOrder] = useState<Order | null>(null);
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const currentPage = pagination?.page ?? 1;
  const totalPages = pagination?.totalPage ?? 1;

  const handleSelectOrder = (order: Order) => {
    if (type === "service" && order.dbId) {
      router.push(`/profile/service-orders/${order.dbId}`);
      return;
    }
    setSelectedOrder(order);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams();
    if (page > 1) params.set("page", String(page));
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  const handleMessageSeller = async () => {
    if (!selectedOrder?.sellerId) {
      toast.error(t("missingSeller"));
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
        toast.error(res?.message || t("chatError"));
      }
    } catch {
      toast.error(t("chatUnexpected"));
    } finally {
      setIsCreatingChat(false);
    }
  };

  const heading = type === "product" ? t("productOrders") : t("serviceOrders");

  if (!selectedOrder) {
    return (
      <DashboardCard className="border-white/10 bg-secondary p-6 md:p-8">
        <OrdersTable
          title={heading}
          type={type}
          orders={initialOrders}
          onSelectOrder={handleSelectOrder}
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
      <OrderDetails
        order={selectedOrder}
        type={type}
        listTitle={heading}
        isCreatingChat={isCreatingChat}
        onBack={() => setSelectedOrder(null)}
        onMessageSeller={handleMessageSeller}
      />
    </DashboardCard>
  );
}
