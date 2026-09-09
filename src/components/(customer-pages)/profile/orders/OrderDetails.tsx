import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Loader2, MapPin, MessageCircle, Store } from "lucide-react";
import { Button } from "@/ui/button";
import { resolveImageUrl } from "../../../../../helpers/resolveImageUrl";
import OrderTimeline from "./OrderTimeline";
import {
  formatAddress,
  formatLabel,
  formatMoney,
  statusBadgeClass,
  type Order,
  type OrderAddress,
} from "./types";

interface OrderDetailsProps {
  order: Order;
  type: "product" | "service";
  listTitle: string;
  isCreatingChat: boolean;
  onBack: () => void;
  onMessageSeller: () => void;
}

function Badge({ value }: { value?: string }) {
  if (!value) return null;
  return (
    <span
      className={`whitespace-nowrap rounded-full border px-3 py-1 text-[11px] font-bold ${statusBadgeClass(value)}`}
    >
      {formatLabel(value)}
    </span>
  );
}

function AddressBlock({ title, address }: { title: string; address: OrderAddress }) {
  const lines = formatAddress(address);

  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-white/50">{title}</p>
      {address.fullName && <p className="text-sm font-semibold text-white">{address.fullName}</p>}
      {address.phone && (
        <a href={`tel:${address.phone}`} className="mt-0.5 block text-sm text-white/75 hover:text-white">
          {address.phone}
        </a>
      )}
      {lines && <p className="mt-1 text-sm leading-relaxed text-white/70">{lines}</p>}
    </div>
  );
}

export default function OrderDetails({
  order,
  type,
  listTitle,
  isCreatingChat,
  onBack,
  onMessageSeller,
}: OrderDetailsProps) {
  const currency = order.currency || "USD";
  const fulfillmentAddress = order.deliveryOption === "pickup" ? order.pickupAddress : order.shippingAddress;
  const fulfillmentTitle = order.deliveryOption === "pickup" ? "Pickup address" : "Shipping address";
  const items = order.items || [];

  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="group mb-6 flex items-center gap-2 text-xs font-semibold text-white/70 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Back to {listTitle}
      </button>

      <div className="mb-8 flex flex-col justify-between gap-4 border-b border-white/15 pb-6 sm:flex-row sm:items-start">
        <div>
          <p className="text-xs font-medium tracking-wide text-white/60">
            {type === "product" ? "Product order" : "Service order"}
          </p>
          <h1 className="mt-1 text-2xl font-bold text-white">{order.id}</h1>
          <p className="mt-1 text-sm text-white/70">
            {order.date}
            {order.deliveryType || order.deliveryOption
              ? ` · ${[formatLabel(order.deliveryType), formatLabel(order.deliveryOption)].filter((part) => part !== "—").join(" · ")}`
              : ""}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge value={order.orderStatus} />
            {order.paymentStatus && <Badge value={order.paymentStatus} />}
          </div>
        </div>

        <Button
          type="button"
          onClick={onMessageSeller}
          disabled={isCreatingChat}
          className="shrink-0 self-start rounded-xl shadow-md shadow-primary/20"
        >
          {isCreatingChat ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageCircle className="h-4 w-4" />}
          Message seller
        </Button>
      </div>

      {items.length > 0 && (
        <section className="mb-6 rounded-xl border border-white/10 bg-white/5 p-4 sm:p-5">
          <h2 className="mb-4 text-sm font-semibold text-white">
            Items{order.totalQuantity ? ` · ${order.totalQuantity}` : ""}
          </h2>
          <ul className="divide-y divide-white/10">
            {items.map((item) => {
              const href = item.slug || item.productId ? `/shop/${item.slug || item.productId}` : undefined;
              const imageSrc = resolveImageUrl(item.image, "/placeholder.jpg") || "/placeholder.jpg";
              const content = (
                <>
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-white/10">
                    <Image src={imageSrc} alt={item.name} fill sizes="64px" unoptimized className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-white">{item.name}</p>
                    <p className="mt-1 text-xs text-white/60">
                      Qty {item.quantity} · {formatMoney(item.unitPrice, currency)} each
                    </p>
                  </div>
                  <p className="text-sm font-bold text-primary">{formatMoney(item.unitTotal, currency)}</p>
                </>
              );

              return (
                <li key={item.id || item.name}>
                  {href ? (
                    <Link href={href} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0 hover:opacity-90">
                      {content}
                    </Link>
                  ) : (
                    <div className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">{content}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-white/10 bg-white/5 p-4 sm:p-5">
          <h2 className="mb-4 text-sm font-semibold text-white">Order summary</h2>
          <dl className="space-y-2.5 text-sm">
            {order.subTotal != null && (
              <div className="flex justify-between gap-4">
                <dt className="text-white/65">Subtotal</dt>
                <dd className="font-medium text-white">{formatMoney(order.subTotal, currency)}</dd>
              </div>
            )}
            {order.shippingFee != null && (
              <div className="flex justify-between gap-4">
                <dt className="text-white/65">Shipping</dt>
                <dd className="font-medium text-white">{formatMoney(order.shippingFee, currency)}</dd>
              </div>
            )}
            {order.discount != null && order.discount > 0 && (
              <div className="flex justify-between gap-4">
                <dt className="text-white/65">Discount</dt>
                <dd className="font-medium text-white">-{formatMoney(order.discount, currency)}</dd>
              </div>
            )}
            <div className="flex justify-between gap-4 border-t border-white/10 pt-2.5">
              <dt className="font-semibold text-white">Total</dt>
              <dd className="font-bold text-primary">
                {order.grandTotal != null ? formatMoney(order.grandTotal, currency) : order.amount}
              </dd>
            </div>
            {order.paymentMethod && (
              <div className="flex justify-between gap-4">
                <dt className="text-white/65">Payment</dt>
                <dd className="font-medium text-white">
                  {formatLabel(order.paymentMethod)}
                  {order.paymentStatus ? ` · ${formatLabel(order.paymentStatus)}` : ""}
                </dd>
              </div>
            )}
          </dl>
        </section>

        <section className="rounded-xl border border-white/10 bg-white/5 p-4 sm:p-5">
          <h2 className="mb-4 text-sm font-semibold text-white">
            {type === "product" ? "Fulfillment" : "Details"}
          </h2>
          <div className="space-y-4">
            {fulfillmentAddress ? (
              <div className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                <AddressBlock title={fulfillmentTitle} address={fulfillmentAddress} />
              </div>
            ) : (
              <p className="text-sm text-white/60">{order.title}</p>
            )}
            {order.trackingStatus && (
              <p className="text-sm text-white/70">
                Tracking: <span className="font-medium text-white">{formatLabel(order.trackingStatus)}</span>
              </p>
            )}
            <div className="flex items-center gap-3 border-t border-white/10 pt-4">
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-white/10">
                <Image
                  src={resolveImageUrl(order.sellerAvatar, "/user.svg") || "/user.svg"}
                  alt={order.sellerName}
                  fill
                  sizes="40px"
                  unoptimized
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 text-xs text-white/50">
                  <Store className="h-3.5 w-3.5" aria-hidden />
                  {type === "product" ? "Seller" : "Provider"}
                </p>
                <p className="truncate text-sm font-semibold text-white">{order.sellerName}</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="mb-6 flex items-center gap-2">
        <CheckCircle2 className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold text-white/80">
          {type === "product" ? "Order" : "Service"} milestones
        </h2>
      </div>
      <OrderTimeline statusLog={order.statusLog} />
    </div>
  );
}
