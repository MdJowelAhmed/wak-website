import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ServiceOrderToolbar from "./ServiceOrderToolbar";
import ServiceOrderTabs from "./ServiceOrderTabs";
import {
  formatLabel,
  isDeliveredStatus,
  statusBadgeClass,
  type Order,
  type ServiceOrderTab,
} from "./types";

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

export default function ServiceOrderDetails({
  order,
  activeTab,
  backHref = "/profile/service-orders",
}: {
  order: Order;
  activeTab: ServiceOrderTab;
  backHref?: string;
}) {
  const isDelivered = isDeliveredStatus(order.orderStatus);

  return (
    <div>
      <Link
        href={backHref}
        className="group mb-6 inline-flex items-center gap-2 text-xs font-semibold text-white/70 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Back to service orders
      </Link>

      <div className="mb-6 flex flex-col justify-between gap-4 border-b border-white/15 pb-6 lg:flex-row lg:items-start">
        <div>
          <p className="text-xs font-medium tracking-wide text-white/60">Order {order.id}</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white">{order.title}</h1>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge value={order.orderStatus} />
            {order.paymentStatus && <Badge value={order.paymentStatus} />}
          </div>
        </div>
        <ServiceOrderToolbar order={order} />
      </div>

      {isDelivered && (
        <div className="mb-6 rounded-xl border-2 border-primary bg-primary/20 px-4 py-3 text-sm text-white shadow-lg shadow-primary/20 sm:px-5">
          <p className="font-semibold">Delivery is ready for review</p>
          <p className="mt-1 text-white/85">
            The seller marked this order as delivered. Check the Delivery tab, then press Accept to complete it.
          </p>
        </div>
      )}

      <ServiceOrderTabs order={order} activeTab={activeTab} />
    </div>
  );
}
