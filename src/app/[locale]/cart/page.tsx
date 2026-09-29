import { apiGetCart } from "../../../../helpers/cartService";
import ProductCart from "@/components/(customer-pages)/cart";
import { mapCartItems } from "@/components/(customer-pages)/check-out/types";

export default async function CartPage() {
    const res = await apiGetCart();
    const items = mapCartItems(res?.data?.items).filter((item) => item.productId);

    return <ProductCart initialItems={items} />;
}
