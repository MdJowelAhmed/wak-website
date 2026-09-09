export interface OrderAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export interface OrderLineItem {
  id: string;
  productId?: string;
  name: string;
  image?: string;
  slug?: string;
  quantity: number;
  unitPrice: number;
  unitTotal: number;
  canReview: boolean;
  alreadyReviewed: boolean;
}

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
  orderStatus?: string;
  paymentStatus?: string;
  paymentMethod?: string;
  deliveryType?: string;
  deliveryOption?: string;
  trackingStatus?: string;
  currency?: string;
  subTotal?: number;
  shippingFee?: number;
  discount?: number;
  grandTotal?: number;
  totalQuantity?: number;
  items?: OrderLineItem[];
  shippingAddress?: OrderAddress;
  pickupAddress?: OrderAddress;
  thumbnail?: string;
  serviceDescription?: string;
  serviceHref?: string;
  deliveryDate?: string;
  completedAt?: string;
  cancelledAt?: string;
  servicePrice?: number;
  serviceCharge?: number;
  netAmount?: number;
  deliveryDescription?: string | null;
  deliveryAttachments?: string[];
  canReview?: boolean;
  alreadyReviewed?: boolean;
}

export function formatMoney(amount: number, currency = "USD"): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(amount);
  } catch {
    return `$${amount}`;
  }
}

export function formatLabel(value?: string): string {
  if (!value) return "—";
  return value.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

export function isDeliveredStatus(status?: string): boolean {
  return (status || "").toLowerCase() === "delivered";
}

export function statusBadgeClass(status?: string): string {
  const value = (status || "").toLowerCase();
  if (value === "delivered") {
    return "border-primary bg-primary text-white shadow-lg shadow-primary/40 ring-2 ring-white/30";
  }
  if (
    value === "completed" ||
    value === "paid" ||
    value === "confirmed"
  ) {
    return "border-green-300/40 bg-green-400/15 text-green-200";
  }
  if (value === "cancelled" || value === "canceled" || value === "failed") {
    return "border-red-300/40 bg-red-400/15 text-red-200";
  }
  return "border-amber-300/40 bg-amber-400/15 text-amber-200";
}

export function formatDate(value?: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatAddress(address?: OrderAddress): string {
  if (!address) return "";
  return [address.address, address.city, address.state, address.postalCode, address.country]
    .filter(Boolean)
    .join(", ");
}
