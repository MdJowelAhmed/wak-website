"use server";

import { revalidatePath } from "next/cache";
import { myFetch } from "../../../../../helpers/myFetch";

export async function rejectServiceOrder(orderId: string, reason?: string) {
  const id = orderId.trim();
  if (!id) {
    return { success: false, message: "Order id is required" };
  }

  const trimmedReason = reason?.trim();
  const body = trimmedReason ? { reason: trimmedReason } : {};

  const res = await myFetch(`/service-orders/${id}/reject`, {
    method: "PATCH",
    body,
  });

  if (res.success) {
    revalidatePath("/profile/service-orders");
    revalidatePath(`/profile/service-orders/${id}`);
  }

  return {
    success: Boolean(res.success),
    message:
      res.message ||
      res.error ||
      (res.success ? "Delivery rejected successfully" : "Failed to reject delivery"),
  };
}
