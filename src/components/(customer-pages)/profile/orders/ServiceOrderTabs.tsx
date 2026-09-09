"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Calendar, Clock, FileText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";
import { resolveImageUrl } from "../../../../../helpers/resolveImageUrl";
import OrderTimeline from "./OrderTimeline";
import {
  formatDate,
  formatLabel,
  formatMoney,
  type Order,
  type ServiceOrderTab,
} from "./types";

const TAB_TRIGGER =
  "rounded-none border-b-2 border-transparent bg-transparent px-0 pb-3 text-sm font-semibold text-white/50 shadow-none hover:text-white/80 data-[state=active]:border-white data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:shadow-none";

function isImageFile(path: string) {
  return /\.(png|jpe?g|gif|webp|svg)$/i.test(path);
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-10 text-center text-sm text-white/60">
      {message}
    </div>
  );
}

export default function ServiceOrderTabs({
  order,
  activeTab,
}: {
  order: Order;
  activeTab: ServiceOrderTab;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const currency = order.currency || "USD";
  const attachments = order.deliveryAttachments || [];
  const hasDelivery = Boolean(order.deliveryDescription) || attachments.length > 0;
  const imageSrc = resolveImageUrl(order.thumbnail, "/placeholder.jpg") || "/placeholder.jpg";

  const handleTabChange = (value: string) => {
    router.replace(`${pathname}?tab=${value}`, { scroll: false });
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="mb-5 h-auto w-full justify-start gap-6 overflow-x-auto rounded-none border-b border-white/15 bg-transparent p-0">
        <TabsTrigger value="order-details" className={TAB_TRIGGER}>
          Order details
        </TabsTrigger>
        <TabsTrigger value="activity" className={TAB_TRIGGER}>
          Activity
        </TabsTrigger>
        <TabsTrigger value="delivery" className={TAB_TRIGGER}>
          Delivery
        </TabsTrigger>
      </TabsList>

      <TabsContent value="order-details" className="mt-0 space-y-6">
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

        <section className="overflow-hidden rounded-xl border border-white/10 bg-white/5">
          <div className="relative aspect-[16/9] w-full bg-white/10">
            <Image
              src={imageSrc}
              alt={order.title}
              fill
              sizes="(max-width: 1024px) 100vw, 900px"
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
            {order.serviceDescription ? (
              <p className="mt-2 text-sm leading-relaxed text-white/75">{order.serviceDescription}</p>
            ) : (
              <p className="mt-2 text-sm text-white/55">No service description available.</p>
            )}
          </div>
        </section>
      </TabsContent>

      <TabsContent value="activity" className="mt-0">
        <OrderTimeline statusLog={order.statusLog} />
      </TabsContent>

      <TabsContent value="delivery" className="mt-0 space-y-6">
        <section className="rounded-xl border border-white/10 bg-white/5 p-4 sm:p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-white/50">Provider</p>
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

        {hasDelivery ? (
          <section className="overflow-hidden rounded-xl border border-white/10 bg-white/5">
            <div className="border-b border-white/10 bg-white/10 px-4 py-2.5 sm:px-5">
              <p className="text-xs font-bold uppercase tracking-wider text-white/55">Delivery #1</p>
            </div>
            <div className="p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-white/10">
                  <Image
                    src={resolveImageUrl(order.sellerAvatar, "/user.svg") || "/user.svg"}
                    alt={order.sellerName}
                    fill
                    sizes="40px"
                    unoptimized
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-primary">{order.sellerName}&apos;s message</p>
                  {order.deliveryDescription && (
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-white/80">
                      {order.deliveryDescription}
                    </p>
                  )}
                </div>
              </div>

              {attachments.length > 0 && (
                <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {attachments.map((file) => {
                    const href = resolveImageUrl(file) || file;
                    const name = file.split("/").pop() || "Attachment";
                    return (
                      <li key={file}>
                        <a
                          href={href}
                          target="_blank"
                          rel="noreferrer"
                          className="block overflow-hidden rounded-lg border border-white/10 bg-white/5 hover:border-white/25"
                        >
                          {isImageFile(file) ? (
                            <div className="relative aspect-square">
                              <Image src={href} alt={name} fill sizes="180px" unoptimized className="object-cover" />
                            </div>
                          ) : (
                            <p className="truncate px-3 py-4 text-xs font-medium text-white">{name}</p>
                          )}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </section>
        ) : (
          <EmptyState message="No delivery has been submitted yet." />
        )}
      </TabsContent>
    </Tabs>
  );
}
