"use server";

import { revalidatePath } from "next/cache";
import { myFetch } from "../../../../../helpers/myFetch";

export async function completeServiceOrder(orderId: string) {
  const id = orderId.trim();
  if (!id) {
    return { success: false, message: "Order id is required" };
  }

  const res = await myFetch(`/service-orders/${id}/complete`, {
    method: "PATCH",
  });

  if (res.success) {
    revalidatePath("/profile/service-orders");
    revalidatePath(`/profile/service-orders/${id}`);
  }

  return {
    success: Boolean(res.success),
    message: res.message || res.error || "Failed to accept delivery",
  };
}
