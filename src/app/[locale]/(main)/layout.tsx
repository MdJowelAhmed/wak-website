import { cookies, headers } from "next/headers";
import AppChrome from "@/components/AppChrome";
import { apiGetCart } from "../../../../helpers/cartService";
import { DEFAULT_COUNTRY } from "../../../../helpers/currency";
import { getExchangeRates } from "../../../../helpers/getExchangeRates";
import { readSession } from "../../../../helpers/getProfile";
import { myFetch } from "../../../../helpers/myFetch";
import { resolvePreferredCurrency } from "../../../../helpers/regions";
import { mapShippingAddresses } from "../../../../helpers/shipping-address";

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const hasAuthToken = Boolean(cookieStore.get("accessToken")?.value);

  const [headerStore, exchangeRates, session, addressRes, cartRes] = await Promise.all([
    headers(),
    getExchangeRates(),
    readSession(),
    hasAuthToken ? myFetch("/shipping-addresses", { cache: "no-store" }) : Promise.resolve(null),
    hasAuthToken ? apiGetCart() : Promise.resolve(null),
  ]);

  const initialCartCount = Array.isArray(cartRes?.data?.items) ? cartRes.data.items.length : 0;
  const cookieCountry = cookieStore.get("user_country")?.value;
  const initialCountry =
    headerStore.get("x-country-code") || cookieCountry || DEFAULT_COUNTRY;
  const initialCurrency = resolvePreferredCurrency(
    initialCountry,
    cookieCountry,
    cookieStore.get("user_currency")?.value,
  );

  return (
    <AppChrome
      initialSession={session}
      initialCartCount={initialCartCount}
      initialCountry={initialCountry}
      initialCurrency={initialCurrency}
      exchangeRates={exchangeRates}
      userMode={cookieStore.get("user-mode")?.value || "customer"}
      initialShippingAddresses={mapShippingAddresses(addressRes?.data)}
    >
      {children}
    </AppChrome>
  );
}
