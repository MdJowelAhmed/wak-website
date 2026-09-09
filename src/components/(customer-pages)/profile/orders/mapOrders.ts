import type { Order } from "./types";

type OrderItem = {
  product?: {
    _id?: string;
    name?: string;
  };
};

type ApiOrder = {
  _id: string;
  orderId?: string;
  createdAt?: string;
  orderStatus?: string;
  grandTotal?: number;
  price?: number;
  items?: OrderItem[];
  vendor?: { _id?: string; name?: string };
  service?: { _id?: string; name?: string };
  provider?: { _id?: string; name?: string };
  statusLog?: { status: string; timestamp: string; note: string }[];
};

function toUiStatus(apiStatus: string): Order["status"] {
  const status = apiStatus.toLowerCase();
  if (status === "completed" || status === "delivered") return "Completed";
  if (status === "cancelled" || status === "failed" || status === "canceled") return "Canceled";
  return "In Progress";
}

export function mapOrders(
  apiOrders: ApiOrder[],
  type: "product" | "service",
): Order[] {
  return apiOrders.map((apiOrder) => {
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
      sellerName = apiOrder.vendor?.name || "Vendor";
    } else {
      orderTitle = apiOrder.service?.name || "Service Order";
      amount = apiOrder.price || 0;
      sellerName = apiOrder.provider?.name || "Vendor";
      sellerId = apiOrder.provider?._id || "";
      itemId = apiOrder.service?._id || "";
    }

    const orderStatusLog =
      Array.isArray(apiOrder.statusLog) && apiOrder.statusLog.length > 0
        ? apiOrder.statusLog
        : [
            {
              status: apiOrder.orderStatus || "pending",
              timestamp: apiOrder.createdAt || new Date().toISOString(),
              note: type === "product" ? "Order placed" : "Service requested",
            },
          ];

    return {
      id: apiOrder.orderId || apiOrder._id,
      dbId: apiOrder._id,
      itemId,
      title: orderTitle,
      date: apiOrder.createdAt
        ? new Date(apiOrder.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "Unknown Date",
      sellerName,
      sellerAvatar: "/user.svg",
      sellerId,
      amount: `$${amount}`,
      status: toUiStatus(apiOrder.orderStatus || ""),
      statusLog: orderStatusLog,
    };
  });
}
