import Checkout from "@/components/(customer-pages)/check-out";
import { redirect } from "@/i18n/navigation";
import { myFetch } from "../../../../helpers/myFetch";
import { apiGetCart } from "../../../../helpers/cartService";
import getProfile from "../../../../helpers/getProfile";
import {
    formFromAddress,
    mapAddresses,
    mapCartItems,
    mapCountries,
    readEstimate,
} from "@/components/(customer-pages)/check-out/types";

export default async function CheckoutPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const [{ locale }, profile, cartRes, addressRes, countriesRes] = await Promise.all([
        params,
        getProfile(),
        apiGetCart(),
        myFetch("/shipping-addresses", { cache: "no-store" }),
        myFetch("/meta/countries", {
            cache: "force-cache",
            next: { revalidate: 86400, tags: ["countries"] },
        }),
    ]);

    if (!profile) {
        redirect({ href: "/", locale });
    }

    const cartItems = mapCartItems(cartRes?.data?.items);
    const addresses = mapAddresses(addressRes?.data);
    const countries = mapCountries(countriesRes?.data);
    const profileEmail = typeof profile?.email === "string" ? profile.email : "";
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
