import { ArrowLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import ServiceOrderToolbar from "./ServiceOrderToolbar";
import ServiceOrderTabs from "./ServiceOrderTabs";
import {
  formatLabel,
  isDeliveredStatus,
  orderStatusMessageKey,
  statusBadgeClass,
  type Order,
  type ServiceOrderTab,
} from "./types";

function Badge({ value, label }: { value?: string; label: string }) {
  if (!value) return null;
  return (
    <span
      className={`whitespace-nowrap rounded-full border px-3 py-1 text-[11px] font-bold ${statusBadgeClass(value)}`}
    >
      {label}
    </span>
  );
}

export default async function ServiceOrderDetails({
  order,
  activeTab,
  backHref = "/profile/service-orders",
}: {
  order: Order;
  activeTab: ServiceOrderTab;
  backHref?: string;
}) {
  const t = await getTranslations("Orders");
  const isDelivered = isDeliveredStatus(order.orderStatus);
  const statusLabel = (value?: string) => {
    const key = orderStatusMessageKey(value);
    return key ? t(key) : formatLabel(value);
  };

  return (
    <div>
      <Link
        href={backHref}
        className="group mb-6 inline-flex items-center gap-2 text-xs font-semibold text-white/70 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1 rtl:rotate-180" />
        {t("backToServiceOrders")}
      </Link>

      <div className="mb-6 flex flex-col justify-between gap-4 border-b border-white/15 pb-6 lg:flex-row lg:items-start">
        <div>
          <p className="text-xs font-medium tracking-wide text-white/60">{t("orderLabel", { id: order.id })}</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white">{order.title}</h1>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge value={order.orderStatus} label={statusLabel(order.orderStatus)} />
            {order.paymentStatus && (
              <Badge value={order.paymentStatus} label={statusLabel(order.paymentStatus)} />
            )}
          </div>
        </div>
        <ServiceOrderToolbar order={order} />
      </div>

      {isDelivered && (
        <div className="mb-6 rounded-xl border-2 border-primary bg-primary/20 px-4 py-3 text-sm text-white shadow-lg shadow-primary/20 sm:px-5">
          <p className="font-semibold">{t("deliveryReady")}</p>
          <p className="mt-1 text-white/85">{t("deliveryReadyHint")}</p>
        </div>
      )}

      <ServiceOrderTabs order={order} activeTab={activeTab} />
    </div>
  );
}
