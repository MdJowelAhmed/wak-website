import { redirect } from "next/navigation";

export default function ServiceOrdersRedirect() {
  redirect("/profile/orders?tab=services");
}
