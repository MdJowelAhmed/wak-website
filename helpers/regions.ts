import {
  currenciesFromRates,
  countryByCountryCode,
  countryByCurrencyCode,
  currencyToOption,
  type CountryOption,
} from "./currencies";
import { APP_LOCALES, localeMeta } from "../src/i18n/locales";

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

export const countriesList: CountryOption[] = [
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
];

export function countryByCode(code: string | undefined): CountryOption {
  return countryByCountryCode(code);
}

export function countryByCurrency(currency: string | undefined): CountryOption | undefined {
  return currency ? countryByCurrencyCode(currency) : undefined;
}

export { currenciesFromRates, currencyToOption, countryByCurrencyCode };
