import AppChrome from "@/components/AppChrome";
import { DEFAULT_COUNTRY } from "../../../../helpers/currency";
import { getExchangeRates } from "../../../../helpers/getExchangeRates";
import { resolvePreferredCurrency } from "../../../../helpers/regions";

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const exchangeRates = await getExchangeRates();
  const initialCurrency = resolvePreferredCurrency(DEFAULT_COUNTRY, undefined, undefined);

  return (
    <AppChrome
      initialSession={{ status: "unauthenticated" }}
      initialCartCount={0}
      initialCountry={DEFAULT_COUNTRY}
      initialCurrency={initialCurrency}
      exchangeRates={exchangeRates}
      syncSessionFromCookie
    >
      {children}
    </AppChrome>
  );
}
