import { notFound } from "next/navigation";
import DashboardCard from "@/shared/DashboardCard";
import ServiceOrderDetails from "@/components/(customer-pages)/profile/orders/ServiceOrderDetails";
import { mapServiceOrder } from "@/components/(customer-pages)/profile/orders/mapOrders";
import { myFetch } from "../../../../../helpers/myFetch";

export const fetchCache = "force-cache";

export default async function ServiceOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await myFetch(`/service-orders/${id}`, {
    cache: "force-cache",
    next: { revalidate: 3600, tags: ["service-orders"] },
  });

  if (!res?.success || !res.data) {
    notFound();
  }

  const order = mapServiceOrder(res.data);

  return (
    <DashboardCard className="border-white/10 bg-secondary p-6 md:p-8">
      <ServiceOrderDetails order={order} />
    </DashboardCard>
  );
}
