import type { Order, OrderAddress, OrderLineItem } from "./types";
import { formatMoney } from "./types";

type ApiAddress = {
  fullName?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
};

type ApiItem = {
  _id?: string;
  quantity?: number;
  unitPrice?: number;
  unitTotal?: number;
  alreadyReviewed?: boolean;
  canReview?: boolean;
  product?: {
    _id?: string;
    name?: string;
    images?: string[];
    slug?: string;
  };
};

type ApiOrder = {
  _id: string;
  orderId?: string;
  createdAt?: string;
  orderStatus?: string;
  paymentStatus?: string;
  paymentMethod?: string;
  deliveryType?: string;
  deliveryOption?: string;
  grandTotal?: number;
  subTotal?: number;
  shippingFee?: number;
  discount?: number;
  totalQuantity?: number;
  price?: number;
  baseCurrency?: string;
  paymentCurrency?: string;
  items?: ApiItem[];
  shippingAddress?: ApiAddress;
  pickupAddress?: ApiAddress;
  shipment?: { trackingStatus?: string };
  vendor?: {
    _id?: string;
    name?: string;
    vendor?: {
      _id?: string;
      businessName?: string;
      logo?: string;
    };
  };
  service?: {
    _id?: string;
    name?: string;
    price?: number;
    image?: string;
    description?: string;
  };
  provider?: { _id?: string; name?: string; email?: string };
  deliveryDate?: string;
  completedAt?: string | null;
  cancelledAt?: string | null;
  charge?: number;
  netAmount?: number;
  deliveryDescription?: string | null;
  deliveryAttachments?: string[];
  alreadyReviewed?: boolean;
  canReview?: boolean;
  updatedAt?: string;
  statusLog?: { status: string; timestamp: string; note: string }[];
};

function toUiStatus(apiStatus: string): Order["status"] {
  const status = apiStatus.toLowerCase();
  if (status === "completed" || status === "delivered") return "Completed";
  if (status === "cancelled" || status === "failed" || status === "canceled") return "Canceled";
  return "In Progress";
}

function mapAddress(address?: ApiAddress): OrderAddress | undefined {
  if (!address) return undefined;
  return {
    fullName: address.fullName || "",
    phone: address.phone || "",
    address: address.address || "",
    city: address.city || "",
    state: address.state || "",
    country: address.country || "",
    postalCode: address.postalCode || "",
  };
}

function serviceStatusLog(apiOrder: ApiOrder): NonNullable<Order["statusLog"]> {
  if (Array.isArray(apiOrder.statusLog) && apiOrder.statusLog.length > 0) {
    return apiOrder.statusLog;
  }

  const createdAt = apiOrder.createdAt || new Date().toISOString();
  const logs: NonNullable<Order["statusLog"]> = [
    { status: "pending", timestamp: createdAt, note: "Service requested" },
  ];

  if (apiOrder.orderStatus === "cancelled") {
    logs.push({
      status: "cancelled",
      timestamp: apiOrder.cancelledAt || apiOrder.updatedAt || createdAt,
      note: "Order was cancelled",
    });
  } else if (apiOrder.orderStatus === "completed") {
    logs.push({
      status: "completed",
      timestamp: apiOrder.completedAt || apiOrder.updatedAt || createdAt,
      note: "Order completed",
    });
  } else if (apiOrder.orderStatus && apiOrder.orderStatus !== "pending") {
    logs.push({
      status: apiOrder.orderStatus,
      timestamp: apiOrder.updatedAt || createdAt,
      note: apiOrder.orderStatus.replace(/_/g, " "),
    });
  }

  return logs;
}

export function mapServiceOrder(apiOrder: ApiOrder): Order {
  const currency = apiOrder.paymentCurrency || apiOrder.baseCurrency || "USD";
  const servicePrice = apiOrder.service?.price ?? apiOrder.price ?? 0;
  const charge = apiOrder.charge ?? 0;
  const total = apiOrder.netAmount ?? servicePrice + charge;
  const date = apiOrder.createdAt
    ? new Date(apiOrder.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Unknown Date";

  return {
    id: apiOrder.orderId || apiOrder._id,
    dbId: apiOrder._id,
    itemId: apiOrder.service?._id || "",
    title: apiOrder.service?.name || "Service Order",
    date,
    sellerName: apiOrder.provider?.name || "Provider",
    sellerAvatar: "/user.svg",
    sellerId: apiOrder.provider?._id || "",
    amount: formatMoney(total, currency),
    status: toUiStatus(apiOrder.orderStatus || ""),
    statusLog: serviceStatusLog(apiOrder),
    orderStatus: apiOrder.orderStatus,
    paymentStatus: apiOrder.paymentStatus,
    paymentMethod: apiOrder.paymentMethod,
    currency,
    subTotal: servicePrice,
    grandTotal: total,
    thumbnail: apiOrder.service?.image,
    serviceDescription: apiOrder.service?.description,
    serviceHref: apiOrder.service?._id ? `/services/${apiOrder.service._id}` : undefined,
    deliveryDate: apiOrder.deliveryDate,
    completedAt: apiOrder.completedAt || undefined,
    cancelledAt: apiOrder.cancelledAt || undefined,
    servicePrice,
    serviceCharge: charge,
    netAmount: total,
    deliveryDescription: apiOrder.deliveryDescription,
    deliveryAttachments: apiOrder.deliveryAttachments || [],
    canReview: apiOrder.canReview === true,
    alreadyReviewed: apiOrder.alreadyReviewed === true,
  };
}

function mapItems(items: ApiItem[] = []): OrderLineItem[] {
  return items.map((item) => ({
    id: item._id || item.product?._id || "",
    productId: item.product?._id,
    name: item.product?.name || "Product",
    image: item.product?.images?.[0],
    slug: item.product?.slug,
    quantity: item.quantity || 1,
    unitPrice: item.unitPrice || 0,
    unitTotal: item.unitTotal ?? (item.unitPrice || 0) * (item.quantity || 1),
    canReview: item.canReview === true,
    alreadyReviewed: item.alreadyReviewed === true,
  }));
}

export function mapOrders(
  apiOrders: ApiOrder[],
  type: "product" | "service",
): Order[] {
  return apiOrders.map((apiOrder) => {
    if (type === "service") {
      return mapServiceOrder(apiOrder);
    }

    const currency = apiOrder.paymentCurrency || apiOrder.baseCurrency || "USD";
    const fallbackLog = [
      {
        status: apiOrder.orderStatus || "pending",
        timestamp: apiOrder.createdAt || new Date().toISOString(),
        note: "Order placed",
      },
    ];
    const statusLog =
      Array.isArray(apiOrder.statusLog) && apiOrder.statusLog.length > 0
        ? apiOrder.statusLog
        : fallbackLog;

    const date = apiOrder.createdAt
      ? new Date(apiOrder.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "Unknown Date";

    const items = mapItems(apiOrder.items);
    const firstItem = items[0];
    const extraCount = Math.max(items.length - 1, 0);
    const amount = apiOrder.grandTotal ?? 0;
    const vendorProfile = apiOrder.vendor?.vendor;

    return {
      id: apiOrder.orderId || apiOrder._id,
      dbId: apiOrder._id,
      itemId: firstItem?.productId || "",
      title:
        extraCount > 0
          ? `${firstItem?.name || "Product Order"} and ${extraCount} more`
          : firstItem?.name || "Product Order",
      date,
      sellerName: vendorProfile?.businessName || apiOrder.vendor?.name || "Vendor",
      sellerAvatar: vendorProfile?.logo || "/user.svg",
      sellerId: vendorProfile?._id || apiOrder.vendor?._id || "",
      amount: formatMoney(amount, currency),
      status: toUiStatus(apiOrder.orderStatus || ""),
      statusLog,
      orderStatus: apiOrder.orderStatus,
      paymentStatus: apiOrder.paymentStatus,
      paymentMethod: apiOrder.paymentMethod,
      deliveryType: apiOrder.deliveryType,
      deliveryOption: apiOrder.deliveryOption,
      trackingStatus: apiOrder.shipment?.trackingStatus,
      currency,
      subTotal: apiOrder.subTotal,
      shippingFee: apiOrder.shippingFee,
      discount: apiOrder.discount,
      grandTotal: amount,
      totalQuantity: apiOrder.totalQuantity,
      items,
      shippingAddress: mapAddress(apiOrder.shippingAddress),
      pickupAddress: mapAddress(apiOrder.pickupAddress),
    };
  });
}
