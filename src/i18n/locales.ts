export const APP_LOCALES = ["en", "bn", "ny", "af", "es", "fr", "de", "ar"] as const;

export type AppLocale = (typeof APP_LOCALES)[number];

export const RTL_LOCALES: readonly AppLocale[] = ["ar"];

export const localeMeta: Record<AppLocale, { name: string; nativeName: string }> = {
  en: { name: "English", nativeName: "English" },
  es: { name: "Spanish", nativeName: "Español" },
  fr: { name: "French", nativeName: "Français" },
  de: { name: "German", nativeName: "Deutsch" },
  ar: { name: "Arabic", nativeName: "العربية" },
  ny: { name: "Chichewa", nativeName: "Chinyanja" },
  af: { name: "Afrikaans", nativeName: "Afrikaans" },
  bn: { name: "Bengali", nativeName: "বাংলা" },
};

export function isAppLocale(value: string): value is AppLocale {
  return (APP_LOCALES as readonly string[]).includes(value);
}

export function isRtlLocale(locale: string): boolean {
  return (RTL_LOCALES as readonly string[]).includes(locale);
}
