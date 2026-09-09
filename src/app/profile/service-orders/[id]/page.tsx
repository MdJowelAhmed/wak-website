import { notFound, redirect } from "next/navigation";
import DashboardCard from "@/shared/DashboardCard";
import ServiceOrderDetails from "@/components/(customer-pages)/profile/orders/ServiceOrderDetails";
import { mapServiceOrder } from "@/components/(customer-pages)/profile/orders/mapOrders";
import { resolveServiceOrderTab } from "@/components/(customer-pages)/profile/orders/types";
import { myFetch } from "../../../../../helpers/myFetch";

export const fetchCache = "force-cache";

export default async function ServiceOrderDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string | string[] }>;
}) {
  const { id } = await params;
  const { tab } = await searchParams;
  const activeTab = resolveServiceOrderTab(tab);
  const rawTab = Array.isArray(tab) ? tab[0] : tab;

  if (rawTab !== activeTab) {
    redirect(`/profile/service-orders/${id}?tab=${activeTab}`);
  }

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
      <ServiceOrderDetails order={order} activeTab={activeTab} />
    </DashboardCard>
  );
}
