export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
}

export interface CountryOption {
  code: string;
  name: string;
  flag: string;
  currency: string;
  symbol: string;
}

export const languagesList: LanguageOption[] = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "ny", name: "Chichewa", nativeName: "Chinyanja" },
  { code: "sw", name: "Swahili", nativeName: "Kiswahili" },
  { code: "fr", name: "French", nativeName: "Français" },
  { code: "pt", name: "Portuguese", nativeName: "Português" },
];

export const countriesList: CountryOption[] = [
  { code: "MW", name: "Malawi", flag: "🇲🇼", currency: "MWK", symbol: "MK" },
  { code: "TZ", name: "Tanzania", flag: "🇹🇿", currency: "TZS", symbol: "TSh" },
  { code: "ZA", name: "South Africa", flag: "🇿🇦", currency: "ZAR", symbol: "R" },
  { code: "KE", name: "Kenya", flag: "🇰🇪", currency: "KES", symbol: "KSh" },
  { code: "UG", name: "Uganda", flag: "🇺🇬", currency: "UGX", symbol: "USh" },
  { code: "ZM", name: "Zambia", flag: "🇿🇲", currency: "ZMW", symbol: "K" },
  { code: "BW", name: "Botswana", flag: "🇧🇼", currency: "BWP", symbol: "P" },
  { code: "NG", name: "Nigeria", flag: "🇳🇬", currency: "NGN", symbol: "₦" },
  { code: "US", name: "United States", flag: "🇺🇸", currency: "USD", symbol: "$" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧", currency: "GBP", symbol: "£" },
  { code: "EU", name: "Eurozone", flag: "🇪🇺", currency: "EUR", symbol: "€" },
  { code: "AE", name: "United Arab Emirates", flag: "🇦🇪", currency: "AED", symbol: "د.إ" },
  { code: "IN", name: "India", flag: "🇮🇳", currency: "INR", symbol: "₹" },
  { code: "CA", name: "Canada", flag: "🇨🇦", currency: "CAD", symbol: "C$" },
];

export function countryByCode(code: string | undefined): CountryOption {
  return countriesList.find((item) => item.code === code) || countriesList[0];
}

export function countryByCurrency(currency: string | undefined): CountryOption | undefined {
  return countriesList.find((item) => item.currency === currency);
}
