import type { Metadata } from "next";
import { Inter, Noto_Naskh_Arabic, Noto_Sans_Bengali, Noto_Sans_Devanagari, Noto_Sans_JP, Noto_Sans_KR, Noto_Sans_SC, Noto_Sans_Thai } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { isRtlLocale } from "@/i18n/locales";

const inter = Inter({
  subsets: ["latin", "latin-ext", "cyrillic", "vietnamese"],
  variable: "--font-inter",
});

const notoArabic = Noto_Naskh_Arabic({
  subsets: ["arabic"],
  variable: "--font-arabic",
  preload: false,
});

const notoBengali = Noto_Sans_Bengali({
  subsets: ["bengali"],
  variable: "--font-bengali",
  preload: false,
});

const notoChinese = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-chinese",
  preload: false,
});

const notoJapanese = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-japanese",
  preload: false,
});

const notoKorean = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-korean",
  preload: false,
});

const notoHindi = Noto_Sans_Devanagari({
  subsets: ["devanagari", "latin"],
  weight: ["400", "700"],
  variable: "--font-hindi",
  preload: false,
});

const notoThai = Noto_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["400", "700"],
  variable: "--font-thai",
  preload: false,
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
    icons: {
      icon: [{ url: "/logo.png", type: "image/png" }],
      shortcut: "/logo.png",
      apple: "/logo.png",
    },
  };
}

/** Locale shell only — cookies/session live in `(main)/layout`, not on marketing pages. */
export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const direction = isRtlLocale(locale) ? "rtl" : "ltr";
  const fontClass = bodyFontClass(locale);

  return (
    <html
      lang={locale}
      dir={direction}
      className={`${inter.variable} ${notoArabic.variable} ${notoBengali.variable} ${notoChinese.variable} ${notoJapanese.variable} ${notoKorean.variable} ${notoHindi.variable} ${notoThai.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className={`${fontClass} min-h-full flex flex-col mx-auto`}>
        <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
