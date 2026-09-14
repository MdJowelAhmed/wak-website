import OrdersPage from "@/components/(customer-pages)/profile/orders";
import { myFetch } from "../../../../../helpers/myFetch";
import { mapOrders } from "@/components/(customer-pages)/profile/orders/mapOrders";

export const fetchCache = "force-cache";

interface ServiceOrdersPageProps {
  searchParams:
    | Promise<{ [key: string]: string | string[] | undefined }>
    | { [key: string]: string | string[] | undefined };
}

export default async function ServiceOrdersRoute({ searchParams }: ServiceOrdersPageProps) {
  const resolvedSearchParams = await searchParams;
  const page = resolvedSearchParams?.page ? String(resolvedSearchParams.page) : "1";

  const ordersRes = await myFetch(`/service-orders/?page=${page}&limit=10`, {
    cache: "force-cache",
    next: { tags: ["service-orders"] },
  });

  const orders = Array.isArray(ordersRes?.data)
    ? mapOrders(ordersRes.data, "service")
    : [];

  const pagination = ordersRes?.pagination || {
    total: 0,
    page: Number(page),
    limit: 10,
    totalPage: 1,
  };

  return (
    <OrdersPage
      type="service"
      initialOrders={orders}
      pagination={pagination}
    />
  );
}
