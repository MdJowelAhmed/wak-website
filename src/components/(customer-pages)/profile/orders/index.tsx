// src/components/(customer-pages)/profile/orders/index.tsx
'use client';

import { useState, useEffect } from "react";
import { MessageCircle, CheckCircle2, ArrowLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import DashboardCard from "../../../../shared/DashboardCard";
import OrderTimeline from "./OrderTimeline";
import OrdersTable, { Order } from "./OrdersTable";
import ReviewModal from "./ReviewModal";
import { myFetch } from "../../../../../helpers/myFetch";

interface OrdersPageProps {
  title?: string;
  type?: "product" | "service";
}

export default function OrdersPage({ title = "My Orders", type }: OrdersPageProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [reviewOrder, setReviewOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const endpoint = type === "product" ? "/product-orders/my-orders" : "/service-orders/";
        const res = await myFetch(endpoint);
        
        if (res?.success && Array.isArray(res.data)) {
          const formattedOrders: Order[] = res.data.map((apiOrder: any) => {
            let orderTitle = "Order Item";
            let amount = 0;
            let sellerName = "Vendor";
            let sellerId = "";

            let itemId = "";

            if (type === "product") {
              const firstItem = apiOrder.items?.[0];
              const firstItemName = firstItem?.product?.name || "Product Order";
              const itemCount = apiOrder.items?.length || 1;
              orderTitle = itemCount > 1 ? `${firstItemName} and ${itemCount - 1} more` : firstItemName;
              amount = apiOrder.grandTotal || 0;
              itemId = firstItem?.product?._id || "";
              sellerId = apiOrder.vendor?._id || "";
            } else {
              orderTitle = apiOrder.service?.name || "Service Order";
              amount = apiOrder.price || 0;
              sellerName = apiOrder.provider?.name || "Vendor";
              sellerId = apiOrder.provider?._id || "";
              itemId = apiOrder.service?._id || "";
            }
            
            let uiStatus: "In Progress" | "Completed" | "Canceled" = "In Progress";
            const apiStatus = apiOrder.orderStatus?.toLowerCase() || "";
            if (apiStatus === "completed" || apiStatus === "delivered") uiStatus = "Completed";
            if (apiStatus === "cancelled" || apiStatus === "failed" || apiStatus === "canceled") uiStatus = "Canceled";

            const orderStatusLog = Array.isArray(apiOrder.statusLog) && apiOrder.statusLog.length > 0 
              ? apiOrder.statusLog 
              : [{
                  status: apiOrder.orderStatus || "pending",
                  timestamp: apiOrder.createdAt || new Date().toISOString(),
                  note: type === "product" ? "Order placed" : "Service requested"
                }];

            return {
              id: apiOrder.orderId || apiOrder._id,
              dbId: apiOrder._id,
              itemId: itemId,
              title: orderTitle,
              date: apiOrder.createdAt ? new Date(apiOrder.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "Unknown Date",
              sellerName: sellerName, 
              sellerAvatar: "/user.svg", 
              sellerId: sellerId,
              amount: `$${amount}`,
              status: uiStatus,
              statusLog: orderStatusLog,
            };
          });
          setOrders(formattedOrders);
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrders();
  }, [type]);

  const handleMessageSeller = async () => {
    if (!selectedOrder?.sellerId) {
      toast.error("Seller information is missing");
      return;
    }
    
    setIsCreatingChat(true);
    try {
      const res = await myFetch('/chats/', {
        method: 'POST',
        body: { otherParticipantId: selectedOrder.sellerId }
      });
      
      if (res?.success) {
        const chatId = res.data?._id || res.data?.id;
        if (chatId) {
          router.push(`/profile/message/${chatId}`);
        } else {
          router.push('/profile/message');
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
      <DashboardCard className="p-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <span className="text-zinc-500 font-medium">Loading orders...</span>
          </div>
        ) : (
          <OrdersTable 
            title={title} 
            orders={orders}
            onSelectOrder={setSelectedOrder} 
            onReviewOrder={setReviewOrder}
          />
        )}
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
    <DashboardCard className="p-8">
      {/* Back Button */}
      <button
        onClick={() => setSelectedOrder(null)}
        className="flex items-center gap-2 text-xs text-zinc-500 hover:text-zinc-800 mb-8 transition-colors cursor-pointer group font-semibold"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        Back to {title}
      </button>
 
      {/* Project Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-zinc-100">
        <div>
          <p className="text-xs text-zinc-500 font-medium tracking-wide">
            Active {type === "product" ? "Product" : "Service"} Order {selectedOrder.id}
          </p>
          <h1 className="text-2xl font-bold text-zinc-900 mt-1">
            {selectedOrder.title}
          </h1>
        </div>
 
        <button 
          onClick={handleMessageSeller}
          disabled={isCreatingChat}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-orange-500 text-white font-semibold text-sm rounded-lg transition-colors cursor-pointer shadow-md shadow-orange-500/10 self-start sm:self-auto shrink-0 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isCreatingChat ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <MessageCircle className="w-4 h-4 fill-white text-primary" />
          )}
          Message Seller
        </button>
      </div>
 
      {/* Milestone Header */}
      <div className="flex items-center gap-2 mb-8">
        <CheckCircle2 className="w-4 h-4 text-zinc-500" />
        <span className="text-sm font-semibold text-zinc-600">
          {type === "product" ? "Product" : "Service"} Delivery Milestones
        </span>
      </div>

      {/* Timeline */}
      <OrderTimeline statusLog={selectedOrder.statusLog} />
    </DashboardCard>
  );
}
