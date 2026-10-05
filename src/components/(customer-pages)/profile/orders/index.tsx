'use client';

import { useState } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { ShoppingBag, Briefcase } from "lucide-react";
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
  activeTab?: "products" | "services";
  initialOrders?: Order[];
  pagination?: OrdersPagination;
}

export default function OrdersPage({
  activeTab = "products",
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
  const currentType: "product" | "service" = activeTab === "services" ? "service" : "product";

  const handleTabChange = (tab: "products" | "services") => {
    if (tab === activeTab) return;
    setSelectedOrder(null);
    router.push(`/profile/orders?tab=${tab}`);
  };

  const handleSelectOrder = (order: Order) => {
    if (currentType === "service" && order.dbId) {
      router.push(`/profile/service-orders/${order.dbId}`);
      return;
    }
    setSelectedOrder(order);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams();
    params.set("tab", activeTab);
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

  const heading = currentType === "product" ? t("productOrders") : t("serviceOrders");

  return (
    <DashboardCard className="border-white/10 bg-secondary p-6 md:p-8">
      {/* Tabs Header */}
      <div className="mb-6 flex items-center gap-2 border-b border-white/15 pb-4 overflow-x-auto">
        <button
          type="button"
          onClick={() => handleTabChange("products")}
          className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === "products"
              ? "bg-primary text-white shadow-lg shadow-primary/25"
              : "text-white/70 hover:text-white hover:bg-white/10"
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>{t("productOrders")}</span>
        </button>
        <button
          type="button"
          onClick={() => handleTabChange("services")}
          className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === "services"
              ? "bg-primary text-white shadow-lg shadow-primary/25"
              : "text-white/70 hover:text-white hover:bg-white/10"
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>{t("serviceOrders")}</span>
        </button>
      </div>

      {!selectedOrder ? (
        <>
          <OrdersTable
            title={heading}
            type={currentType}
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
            type={currentType}
          />
        </>
      ) : (
        <OrderDetails
          order={selectedOrder}
          type={currentType}
          listTitle={heading}
          isCreatingChat={isCreatingChat}
          onBack={() => setSelectedOrder(null)}
          onMessageSeller={handleMessageSeller}
        />
      )}
    </DashboardCard>
  );
}
