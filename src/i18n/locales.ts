export const APP_LOCALES = [
  "en",
  "bn",
  "ny",
  "af",
  "zh",
  "es",
  "fr",
  "ar",
  "pt",
  "de",
  "ja",
  "ko",
  "hi",
  "sw",
  "nl",
  "it",
  "tr",
  "ru",
  "id",
  "vi",
  "th",
  "ms",
  "ur",
] as const;

export type AppLocale = (typeof APP_LOCALES)[number];

export const RTL_LOCALES: readonly AppLocale[] = ["ar", "ur"];

export const localeMeta: Record<AppLocale, { name: string; nativeName: string }> = {
  en: { name: "English", nativeName: "English" },
  bn: { name: "Bengali", nativeName: "বাংলা" },
  ny: { name: "Chichewa", nativeName: "Chinyanja" },
  af: { name: "Afrikaans", nativeName: "Afrikaans" },
  zh: { name: "Chinese", nativeName: "中文" },
  es: { name: "Spanish", nativeName: "Español" },
  fr: { name: "French", nativeName: "Français" },
  ar: { name: "Arabic", nativeName: "العربية" },
  pt: { name: "Portuguese", nativeName: "Português" },
  de: { name: "German", nativeName: "Deutsch" },
  ja: { name: "Japanese", nativeName: "日本語" },
  ko: { name: "Korean", nativeName: "한국어" },
  hi: { name: "Hindi", nativeName: "हिन्दी" },
  sw: { name: "Swahili", nativeName: "Kiswahili" },
  nl: { name: "Dutch", nativeName: "Nederlands" },
  it: { name: "Italian", nativeName: "Italiano" },
  tr: { name: "Turkish", nativeName: "Türkçe" },
  ru: { name: "Russian", nativeName: "Русский" },
  id: { name: "Indonesian", nativeName: "Bahasa Indonesia" },
  vi: { name: "Vietnamese", nativeName: "Tiếng Việt" },
  th: { name: "Thai", nativeName: "ไทย" },
  ms: { name: "Malay", nativeName: "Bahasa Melayu" },
  ur: { name: "Urdu", nativeName: "اردو" },
};

export function isAppLocale(value: string): value is AppLocale {
  return (APP_LOCALES as readonly string[]).includes(value);
}

export function isRtlLocale(locale: string): boolean {
  return (RTL_LOCALES as readonly string[]).includes(locale);
}
