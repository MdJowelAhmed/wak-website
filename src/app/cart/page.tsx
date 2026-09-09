import { myFetch } from "../../../helpers/myFetch";
import ProductCart from "@/components/(customer-pages)/cart";
import { mapCartItems } from "@/components/(customer-pages)/check-out/types";

export default async function CartPage() {
    const res = await myFetch("/carts/", { cache: "no-store", next: {} });
    const items = mapCartItems(res?.data?.items).filter((item) => item.productId);

    return <ProductCart initialItems={items} />;
}
