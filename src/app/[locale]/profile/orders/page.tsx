import OrdersPage from "@/components/(customer-pages)/profile/orders";
import { myFetch } from "../../../../../helpers/myFetch";
import { mapOrders } from "@/components/(customer-pages)/profile/orders/mapOrders";

interface OrdersPageProps {
  searchParams:
    | Promise<{ [key: string]: string | string[] | undefined }>
    | { [key: string]: string | string[] | undefined };
}

export default async function OrdersRoute({ searchParams }: OrdersPageProps) {
  const resolvedSearchParams = await searchParams;
  const rawTab = Array.isArray(resolvedSearchParams?.tab)
    ? resolvedSearchParams.tab[0]
    : resolvedSearchParams?.tab;
  const tab = rawTab === "services" ? "services" : "products";
  const page = resolvedSearchParams?.page ? String(resolvedSearchParams.page) : "1";

  let ordersRes;
  if (tab === "services") {
    ordersRes = await myFetch(`/service-orders/?page=${page}&limit=10`, {
      cache: "no-store",
    });
  } else {
    ordersRes = await myFetch(`/product-orders/my-orders?page=${page}&limit=10`, {
      cache: "no-store",
    });
  }

  const orderType = tab === "services" ? "service" : "product";

  const orders = Array.isArray(ordersRes?.data)
    ? mapOrders(ordersRes.data, orderType)
    : [];

  const pagination = ordersRes?.pagination || {
    total: 0,
    page: Number(page),
    limit: 10,
    totalPage: 1,
  };

  return (
    <OrdersPage
      activeTab={tab}
      initialOrders={orders}
      pagination={pagination}
    />
  );
}
