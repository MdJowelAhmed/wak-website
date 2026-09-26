import type { Metadata } from "next";
import { Inter, Noto_Naskh_Arabic, Noto_Sans_Bengali, Noto_Sans_Devanagari, Noto_Sans_JP, Noto_Sans_KR, Noto_Sans_SC, Noto_Sans_Thai } from "next/font/google";
import { cookies, headers } from "next/headers";
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
import DevApiLogBridge from "@/components/DevApiLogBridge";
import { routing } from "@/i18n/routing";
import { isRtlLocale } from "@/i18n/locales";
import { getExchangeRates } from "../../../helpers/getExchangeRates";
import { DEFAULT_COUNTRY } from "../../../helpers/currency";
import { resolvePreferredCurrency } from "../../../helpers/regions";
import { myFetch } from "../../../helpers/myFetch";
import { mapShippingAddresses } from "../../../helpers/shipping-address";

const inter = Inter({
  subsets: ["latin", "latin-ext", "cyrillic", "vietnamese"],
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

const notoChinese = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-chinese",
});

const notoJapanese = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-japanese",
});

const notoKorean = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-korean",
});

const notoHindi = Noto_Sans_Devanagari({
  subsets: ["devanagari", "latin"],
  weight: ["400", "700"],
  variable: "--font-hindi",
});

const notoThai = Noto_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["400", "700"],
  variable: "--font-thai",
});

function bodyFontClass(locale: string) {
  switch (locale) {
    case "ar":
    case "ur":
      return notoArabic.className;
    case "bn":
      return notoBengali.className;
    case "zh":
      return notoChinese.className;
    case "ja":
      return notoJapanese.className;
    case "ko":
      return notoKorean.className;
    case "hi":
      return notoHindi.className;
    case "th":
      return notoThai.className;
    default:
      return inter.className;
  }
}

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

  const cookieStore = await cookies();
  const [headerStore, exchangeRates, messages, addressRes] = await Promise.all([
    headers(),
    getExchangeRates(),
    getMessages(),
    cookieStore.get("accessToken")?.value
      ? myFetch("/shipping-addresses", { cache: "no-store" })
      : Promise.resolve(null),
  ]);

  const userMode = cookieStore.get("user-mode")?.value || "customer";
  const initialShippingAddresses = mapShippingAddresses(addressRes?.data);
  const cookieCountry = cookieStore.get("user_country")?.value;
  const initialCountry =
    headerStore.get("x-country-code") ||
    cookieCountry ||
    DEFAULT_COUNTRY;
  const initialCurrency = resolvePreferredCurrency(
    initialCountry,
    cookieCountry,
    cookieStore.get("user_currency")?.value,
  );
  const direction = isRtlLocale(locale) ? "rtl" : "ltr";
  const fontClass = bodyFontClass(locale);

  return (
    <html lang={locale} dir={direction} className={`${inter.variable} ${notoArabic.variable} ${notoBengali.variable} ${notoChinese.variable} ${notoJapanese.variable} ${notoKorean.variable} ${notoHindi.variable} ${notoThai.variable} h-full antialiased`} suppressHydrationWarning>
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
                <CustomerNavbar
                  userMode={userMode}
                  initialShippingAddresses={initialShippingAddresses}
                />
                {process.env.NODE_ENV === "development" ? (
                  <DevApiLogBridge>
                    <div>{children}</div>
                  </DevApiLogBridge>
                ) : (
                  <div>{children}</div>
                )}
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
