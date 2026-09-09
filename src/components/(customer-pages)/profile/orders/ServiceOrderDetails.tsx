import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, CheckCircle2, Clock, FileText, Paperclip } from "lucide-react";
import { resolveImageUrl } from "../../../../../helpers/resolveImageUrl";
import OrderTimeline from "./OrderTimeline";
import ServiceOrderToolbar from "./ServiceOrderToolbar";
import {
  formatDate,
  formatLabel,
  formatMoney,
  isDeliveredStatus,
  statusBadgeClass,
  type Order,
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
  backHref = "/profile/service-orders",
}: {
  order: Order;
  backHref?: string;
}) {
  const currency = order.currency || "USD";
  const imageSrc = resolveImageUrl(order.thumbnail, "/placeholder.jpg") || "/placeholder.jpg";
  const attachments = order.deliveryAttachments || [];
  const hasDelivery = Boolean(order.deliveryDescription) || attachments.length > 0;
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
            The seller marked this order as delivered. Check the work, then press Accept to complete it.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          <section className="overflow-hidden rounded-xl border border-white/10 bg-white/5">
            <div className="relative aspect-[16/9] w-full bg-white/10">
              <Image
                src={imageSrc}
                alt={order.title}
                fill
                sizes="(max-width: 1024px) 100vw, 55vw"
                unoptimized
                className="object-cover"
              />
            </div>
            <div className="p-4 sm:p-5">
              {order.serviceHref ? (
                <Link href={order.serviceHref} className="text-lg font-semibold text-white hover:underline">
                  {order.title}
                </Link>
              ) : (
                <h2 className="text-lg font-semibold text-white">{order.title}</h2>
              )}
              {order.serviceDescription && (
                <p className="mt-2 text-sm leading-relaxed text-white/75">{order.serviceDescription}</p>
              )}
            </div>
          </section>

          {hasDelivery && (
            <section className="rounded-xl border border-white/10 bg-white/5 p-4 sm:p-5">
              <div className="mb-3 flex items-center gap-2">
                <Paperclip className="h-4 w-4 text-primary" aria-hidden />
                <h2 className="text-sm font-semibold text-white">Delivery</h2>
              </div>
              {order.deliveryDescription && (
                <p className="text-sm leading-relaxed text-white/75">{order.deliveryDescription}</p>
              )}
              {attachments.length > 0 && (
                <ul className="mt-3 space-y-2">
                  {attachments.map((file) => (
                    <li key={file}>
                      <a
                        href={resolveImageUrl(file) || file}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-medium text-white underline-offset-4 hover:underline"
                      >
                        {file.split("/").pop() || "Attachment"}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}

          <section>
            <div className="mb-4 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold text-white/80">Activity</h2>
            </div>
            <OrderTimeline statusLog={order.statusLog} />
          </section>
        </div>

        <aside className="space-y-6 lg:col-span-5">
          <section className="rounded-xl border border-white/10 bg-white/5 p-4 sm:p-5">
            <h2 className="mb-4 text-sm font-semibold text-white">Order details</h2>
            <dl className="space-y-3 text-sm">
              <div className="flex items-start justify-between gap-4">
                <dt className="flex items-center gap-2 text-white/65">
                  <Calendar className="h-4 w-4 text-primary" aria-hidden />
                  Ordered
                </dt>
                <dd className="font-medium text-white">{order.date}</dd>
              </div>
              <div className="flex items-start justify-between gap-4">
                <dt className="flex items-center gap-2 text-white/65">
                  <Clock className="h-4 w-4 text-primary" aria-hidden />
                  Due date
                </dt>
                <dd className="font-medium text-white">{formatDate(order.deliveryDate)}</dd>
              </div>
              {order.cancelledAt && (
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-white/65">Cancelled</dt>
                  <dd className="font-medium text-white">{formatDate(order.cancelledAt)}</dd>
                </div>
              )}
              {order.completedAt && (
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-white/65">Completed</dt>
                  <dd className="font-medium text-white">{formatDate(order.completedAt)}</dd>
                </div>
              )}
            </dl>
          </section>

          <section className="rounded-xl border border-white/10 bg-white/5 p-4 sm:p-5">
            <h2 className="mb-4 text-sm font-semibold text-white">Price summary</h2>
            <dl className="space-y-2.5 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-white/65">Service</dt>
                <dd className="font-medium text-white">
                  {formatMoney(order.servicePrice ?? order.subTotal ?? 0, currency)}
                </dd>
              </div>
              {order.serviceCharge != null && (
                <div className="flex justify-between gap-4">
                  <dt className="text-white/65">Service fee</dt>
                  <dd className="font-medium text-white">{formatMoney(order.serviceCharge, currency)}</dd>
                </div>
              )}
              <div className="flex justify-between gap-4 border-t border-white/10 pt-2.5">
                <dt className="font-semibold text-white">Total</dt>
                <dd className="font-bold text-primary">
                  {formatMoney(order.netAmount ?? order.grandTotal ?? 0, currency)}
                </dd>
              </div>
              {order.paymentMethod && (
                <div className="flex justify-between gap-4">
                  <dt className="flex items-center gap-2 text-white/65">
                    <FileText className="h-4 w-4 text-primary" aria-hidden />
                    Payment
                  </dt>
                  <dd className="text-right font-medium text-white">
                    {formatLabel(order.paymentMethod)}
                    {order.paymentStatus ? ` · ${formatLabel(order.paymentStatus)}` : ""}
                  </dd>
                </div>
              )}
            </dl>
          </section>

          <section className="rounded-xl border border-white/10 bg-white/5 p-4 sm:p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-white/50">Seller</p>
            <div className="mt-3 flex items-center gap-3">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-white/10">
                <Image
                  src={resolveImageUrl(order.sellerAvatar, "/user.svg") || "/user.svg"}
                  alt={order.sellerName}
                  fill
                  sizes="48px"
                  unoptimized
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">{order.sellerName}</p>
                <p className="text-xs text-white/55">Service provider</p>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
