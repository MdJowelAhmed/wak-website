import {
  currenciesFromRates,
  currencyToOption,
  type CountryOption,
} from "./currencies";
import { APP_LOCALES, localeMeta } from "../src/i18n/locales";
import { DEFAULT_COUNTRY } from "./currency";

export type { CountryOption };

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
}

export const languagesList: LanguageOption[] = APP_LOCALES.map((code) => ({
  code,
  name: localeMeta[code].name,
  nativeName: localeMeta[code].nativeName,
}));

export const SHOPPING_COUNTRY_CODES = [
  "US",
  "CA",
  "MX",
  "IN",
  "MW",
  "ZA",
  "TZ",
  "NA",
  "ZM",
  "KE",
] as const;
export type ShoppingCountryCode = (typeof SHOPPING_COUNTRY_CODES)[number];

function region(currency: string, name: string): CountryOption {
  return { ...currencyToOption(currency), name };
}

export const countriesList: CountryOption[] = [
  region("USD", "USA"),
  region("CAD", "Canada"),
  region("MXN", "Mexico"),
  region("INR", "India"),
  region("MWK", "Malawi"),
  region("ZAR", "South Africa"),
  region("TZS", "Tanzania"),
  region("NAD", "Namibia"),
  region("ZMW", "Zambia"),
  region("KES", "Kenya"),
];

export const fallbackCurrencies: CountryOption[] = [
  currencyToOption("MWK"),
  currencyToOption("TZS"),
  currencyToOption("ZAR"),
  currencyToOption("KES"),
  currencyToOption("UGX"),
  currencyToOption("ZMW"),
  currencyToOption("BWP"),
  currencyToOption("NGN"),
  currencyToOption("USD"),
  currencyToOption("GBP"),
  currencyToOption("EUR"),
  currencyToOption("AED"),
  currencyToOption("INR"),
  currencyToOption("CAD"),
  currencyToOption("MXN"),
  currencyToOption("NAD"),
];

const COUNTRY_ALIASES: Record<string, string> = {
  MZ: "MW",
};

export function isShoppingCountryCode(value: string | undefined): boolean {
  if (!value) return false;
  return SHOPPING_COUNTRY_CODES.includes(value.toUpperCase() as ShoppingCountryCode);
}

export function normalizeShoppingCountryCode(value: string | null | undefined): ShoppingCountryCode {
  const upper = value?.trim().toUpperCase();
  const mapped = upper ? (COUNTRY_ALIASES[upper] ?? upper) : undefined;
  if (mapped && isShoppingCountryCode(mapped)) {
    return mapped as ShoppingCountryCode;
  }
  return DEFAULT_COUNTRY as ShoppingCountryCode;
}

export function countryByCode(code: string | undefined): CountryOption {
  const normalized = normalizeShoppingCountryCode(code);
  return countriesList.find((item) => item.code === normalized) ?? countriesList[0];
}

export function resolvePreferredCurrency(
  countryCode: string | undefined,
  savedCountry: string | null | undefined,
  savedCurrency: string | null | undefined,
): string {
  const country = countryByCode(countryCode);
  if (
    savedCountry &&
    countryByCode(savedCountry).code === country.code &&
    savedCurrency
  ) {
    return currencyToOption(savedCurrency).currency;
  }
  return country.currency;
}

export function countryByCurrency(currency: string | undefined): CountryOption | undefined {
  return currency ? currencyToOption(currency) : undefined;
}

export { currenciesFromRates, currencyToOption };
