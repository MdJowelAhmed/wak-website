import Checkout from "@/components/(customer-pages)/check-out";
import { myFetch } from "../../../helpers/myFetch";
import {
    formFromAddress,
    mapAddresses,
    mapCartItems,
    mapCountries,
    readEstimate,
} from "@/components/(customer-pages)/check-out/types";

export default async function CheckoutPage() {
    const [cartRes, addressRes, profileRes, countriesRes] = await Promise.all([
        myFetch("/carts/", { cache: "no-store" }),
        myFetch("/shipping-addresses", { cache: "no-store" }),
        myFetch("/users/profile", { cache: "no-store" }),
        myFetch("/meta/countries", {
            cache: "force-cache",
            next: { revalidate: 86400, tags: ["countries"] },
        }),
    ]);

    const cartItems = mapCartItems(cartRes?.data?.items);
    const addresses = mapAddresses(addressRes?.data);
    const countries = mapCountries(countriesRes?.data);
    const profileEmail =
        typeof profileRes?.data?.email === "string" ? profileRes.data.email : "";
    const defaultAddress = addresses.find((address) => address.isDefault) || addresses[0] || null;

    let initialEstimate = null;
    if (defaultAddress) {
        const estimateRes = await myFetch(
            `/product-orders/shipping-estimate?shippingAddressId=${defaultAddress._id}`,
            { cache: "no-store" },
        );
        initialEstimate = readEstimate(estimateRes?.data);
    }

    return (
        <Checkout
            cartItems={cartItems}
            addresses={addresses}
            countries={countries}
            initialForm={formFromAddress(defaultAddress, profileEmail)}
            initialAddressId={defaultAddress?._id ?? null}
            initialEstimate={initialEstimate}
        />
    );
}
