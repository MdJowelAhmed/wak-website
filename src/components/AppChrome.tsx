import type { ReactNode } from "react";
import { Toaster } from "sonner";
import CustomerNavbar from "@/shared/Navbar";
import Footer from "@/shared/Footer";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { CurrencyProvider } from "@/context/CurrencyContext";
import ChatwootWidget from "@/components/ChatwootWidget";
import DevApiLogBridge from "@/components/DevApiLogBridge";
import type { SessionResult } from "../../helpers/getProfile";
import type { ShippingAddress } from "../../helpers/shipping-address";
import type { ExchangeRatesPayload } from "../../helpers/currency";

interface AppChromeProps {
  children: ReactNode;
  initialSession: SessionResult;
  initialCartCount: number;
  initialCountry: string;
  initialCurrency: string;
  exchangeRates: ExchangeRatesPayload | null;
  userMode?: string;
  initialShippingAddresses?: ShippingAddress[];
  /** When the server skipped session lookup (static shell), hydrate from cookie on the client. */
  syncSessionFromCookie?: boolean;
}

export default function AppChrome({
  children,
  initialSession,
  initialCartCount,
  initialCountry,
  initialCurrency,
  exchangeRates,
  userMode = "customer",
  initialShippingAddresses = [],
  syncSessionFromCookie = false,
}: AppChromeProps) {
  const content =
    process.env.NODE_ENV === "development" ? (
      <DevApiLogBridge>
        <div>{children}</div>
      </DevApiLogBridge>
    ) : (
      <div>{children}</div>
    );

  return (
    <AuthProvider initialSession={initialSession} syncSessionFromCookie={syncSessionFromCookie}>
      <CurrencyProvider
        initialRates={exchangeRates}
        initialCountry={initialCountry}
        initialCurrency={initialCurrency}
      >
        <CartProvider initialCartCount={initialCartCount}>
          <Toaster richColors position="top-center" />
          <CustomerNavbar userMode={userMode} initialShippingAddresses={initialShippingAddresses} />
          {content}
          <Footer />
          <ChatwootWidget />
        </CartProvider>
      </CurrencyProvider>
    </AuthProvider>
  );
}
