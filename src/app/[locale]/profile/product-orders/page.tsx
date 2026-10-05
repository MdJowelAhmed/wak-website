import { redirect } from "next/navigation";

export default function ProductOrdersRedirect() {
  redirect("/profile/orders?tab=products");
}
