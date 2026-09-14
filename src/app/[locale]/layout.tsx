import type { Metadata } from "next";
import { Inter, Noto_Naskh_Arabic, Noto_Sans_Bengali } from "next/font/google";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { Toaster } from "sonner";
import CustomerNavbar from "@/shared/Navbar";
import Footer from "@/shared/Footer";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { CurrencyProvider } from "@/context/CurrencyContext";
import ChatwootWidget from "@/components/ChatwootWidget";
import { routing } from "@/i18n/routing";
import { isRtlLocale } from "@/i18n/locales";
import { getExchangeRates } from "../../../helpers/getExchangeRates";
import { DEFAULT_COUNTRY, DEFAULT_CURRENCY } from "../../../helpers/currency";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
});

const notoArabic = Noto_Naskh_Arabic({
  subsets: ["arabic"],
  variable: "--font-arabic",
});

const notoBengali = Noto_Sans_Bengali({
  subsets: ["bengali"],
  variable: "--font-bengali",
});

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    title: {
      default: t("title"),
      template: `%s | ${t("title")}`,
    },
    description: t("description"),
  };
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const [cookieStore, exchangeRates, messages] = await Promise.all([
    cookies(),
    getExchangeRates(),
    getMessages(),
  ]);

  const userMode = cookieStore.get("user-mode")?.value || "customer";
  const initialCountry = cookieStore.get("user_country")?.value || DEFAULT_COUNTRY;
  const initialCurrency = cookieStore.get("user_currency")?.value || DEFAULT_CURRENCY;
  const direction = isRtlLocale(locale) ? "rtl" : "ltr";
  const fontClass =
    locale === "ar"
      ? notoArabic.className
      : locale === "bn"
        ? notoBengali.className
        : inter.className;

  return (
    <html lang={locale} dir={direction} className={`${inter.variable} ${notoArabic.variable} ${notoBengali.variable} h-full antialiased`} suppressHydrationWarning>
      <body className={`${fontClass} min-h-full flex flex-col mx-auto`}>
        <NextIntlClientProvider messages={messages}>
          <AuthProvider>
            <CurrencyProvider
              initialRates={exchangeRates}
              initialCountry={initialCountry}
              initialCurrency={initialCurrency}
            >
              <CartProvider>
                <Toaster richColors position="top-center" />
                <CustomerNavbar userMode={userMode} />
                <div>{children}</div>
                <Footer />
                <ChatwootWidget />
              </CartProvider>
            </CurrencyProvider>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
