"use client";

import Image from "next/image";
import { ArrowLeft, CheckCircle2, Loader2, MapPin, MessageCircle, Store } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/ui/button";
import { resolveImageUrl } from "../../../../../helpers/resolveImageUrl";
import OrderTimeline from "./OrderTimeline";
import {
  formatAddress,
  formatLabel,
  formatMoney,
  orderStatusMessageKey,
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
  const t = useTranslations("Orders");
  if (!value) return null;
  const key = orderStatusMessageKey(value);
  return (
    <span
      className={`whitespace-nowrap rounded-full border px-3 py-1 text-[11px] font-bold ${statusBadgeClass(value)}`}
    >
      {key ? t(key) : formatLabel(value)}
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
  const t = useTranslations("Orders");
  const locale = useLocale();
  const currency = order.currency || "USD";
  const money = (amount: number) => formatMoney(amount, currency, locale);
  const fulfillmentAddress = order.deliveryOption === "pickup" ? order.pickupAddress : order.shippingAddress;
  const fulfillmentTitle = order.deliveryOption === "pickup" ? t("pickupAddress") : t("shippingAddress");
  const trackingKey = orderStatusMessageKey(order.trackingStatus);
  const trackingLabel = trackingKey ? t(trackingKey) : formatLabel(order.trackingStatus);
  const items = order.items || [];
  const deliveryLabel = [order.deliveryType, order.deliveryOption]
    .map((value) => {
      const key = orderStatusMessageKey(value);
      return key ? t(key) : formatLabel(value);
    })
    .filter((part) => part !== "—")
    .join(" · ");

  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="group mb-6 flex items-center gap-2 text-xs font-semibold text-white/70 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1 rtl:rotate-180" />
        {t("backTo", { title: listTitle })}
      </button>

      <div className="mb-8 flex flex-col justify-between gap-4 border-b border-white/15 pb-6 sm:flex-row sm:items-start">
        <div>
          <p className="text-xs font-medium tracking-wide text-white/60">
            {type === "product" ? t("productOrder") : t("serviceOrder")}
          </p>
          <h1 className="mt-1 text-2xl font-bold text-white">{order.id}</h1>
          <p className="mt-1 text-sm text-white/70">
            {order.date}
            {deliveryLabel ? ` · ${deliveryLabel}` : ""}
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
          {t("messageSeller")}
        </Button>
      </div>

      {items.length > 0 && (
        <section className="mb-6 rounded-xl border border-white/10 bg-white/5 p-4 sm:p-5">
          <h2 className="mb-4 text-sm font-semibold text-white">
            {order.totalQuantity ? t("itemsWithCount", { count: order.totalQuantity }) : t("items")}
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
                      {t("qtyEach", { quantity: item.quantity, price: money(item.unitPrice) })}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-primary">{money(item.unitTotal)}</p>
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
          <h2 className="mb-4 text-sm font-semibold text-white">{t("summary")}</h2>
          <dl className="space-y-2.5 text-sm">
            {order.subTotal != null && (
              <div className="flex justify-between gap-4">
                <dt className="text-white/65">{t("subtotal")}</dt>
                <dd className="font-medium text-white">{money(order.subTotal)}</dd>
              </div>
            )}
            {order.shippingFee != null && (
              <div className="flex justify-between gap-4">
                <dt className="text-white/65">{t("shipping")}</dt>
                <dd className="font-medium text-white">{money(order.shippingFee)}</dd>
              </div>
            )}
            {order.discount != null && order.discount > 0 && (
              <div className="flex justify-between gap-4">
                <dt className="text-white/65">{t("discount")}</dt>
                <dd className="font-medium text-white">-{money(order.discount)}</dd>
              </div>
            )}
            <div className="flex justify-between gap-4 border-t border-white/10 pt-2.5">
              <dt className="font-semibold text-white">{t("total")}</dt>
              <dd className="font-bold text-primary">
                {order.grandTotal != null ? money(order.grandTotal) : order.amount}
              </dd>
            </div>
            {order.paymentMethod && (
              <div className="flex justify-between gap-4">
                <dt className="text-white/65">{t("payment")}</dt>
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
            {type === "product" ? t("fulfillment") : t("details")}
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
                {t("tracking", { status: trackingLabel })}
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
                  {type === "product" ? t("seller") : t("provider")}
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
          {type === "product" ? t("orderMilestones") : t("serviceMilestones")}
        </h2>
      </div>
      <OrderTimeline statusLog={order.statusLog} />
    </div>
  );
}
