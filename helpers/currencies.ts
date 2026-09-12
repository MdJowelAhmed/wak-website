import { DEFAULT_CURRENCY } from "./currency";

export interface CountryOption {
  code: string;
  name: string;
  flag: string;
  currency: string;
  symbol: string;
}

interface CurrencyMeta {
  name: string;
  countryCode: string;
  symbol: string;
}

export const CURRENCY_META: Record<string, CurrencyMeta> = {
  USD: { name: "United States", countryCode: "US", symbol: "$" },
  AED: { name: "United Arab Emirates", countryCode: "AE", symbol: "د.إ" },
  AFN: { name: "Afghanistan", countryCode: "AF", symbol: "؋" },
  ALL: { name: "Albania", countryCode: "AL", symbol: "L" },
  AMD: { name: "Armenia", countryCode: "AM", symbol: "֏" },
  ANG: { name: "Netherlands Antilles", countryCode: "CW", symbol: "ƒ" },
  AOA: { name: "Angola", countryCode: "AO", symbol: "Kz" },
  ARS: { name: "Argentina", countryCode: "AR", symbol: "$" },
  AUD: { name: "Australia", countryCode: "AU", symbol: "A$" },
  AWG: { name: "Aruba", countryCode: "AW", symbol: "ƒ" },
  AZN: { name: "Azerbaijan", countryCode: "AZ", symbol: "₼" },
  BAM: { name: "Bosnia and Herzegovina", countryCode: "BA", symbol: "KM" },
  BBD: { name: "Barbados", countryCode: "BB", symbol: "Bds$" },
  BDT: { name: "Bangladesh", countryCode: "BD", symbol: "৳" },
  BGN: { name: "Bulgaria", countryCode: "BG", symbol: "лв" },
  BHD: { name: "Bahrain", countryCode: "BH", symbol: "BD" },
  BIF: { name: "Burundi", countryCode: "BI", symbol: "FBu" },
  BMD: { name: "Bermuda", countryCode: "BM", symbol: "$" },
  BND: { name: "Brunei", countryCode: "BN", symbol: "B$" },
  BOB: { name: "Bolivia", countryCode: "BO", symbol: "Bs" },
  BRL: { name: "Brazil", countryCode: "BR", symbol: "R$" },
  BSD: { name: "Bahamas", countryCode: "BS", symbol: "B$" },
  BWP: { name: "Botswana", countryCode: "BW", symbol: "P" },
  BYN: { name: "Belarus", countryCode: "BY", symbol: "Br" },
  BZD: { name: "Belize", countryCode: "BZ", symbol: "BZ$" },
  CAD: { name: "Canada", countryCode: "CA", symbol: "C$" },
  CDF: { name: "DR Congo", countryCode: "CD", symbol: "FC" },
  CHF: { name: "Switzerland", countryCode: "CH", symbol: "CHF" },
  CLP: { name: "Chile", countryCode: "CL", symbol: "$" },
  CNY: { name: "China", countryCode: "CN", symbol: "¥" },
  COP: { name: "Colombia", countryCode: "CO", symbol: "$" },
  CRC: { name: "Costa Rica", countryCode: "CR", symbol: "₡" },
  CVE: { name: "Cape Verde", countryCode: "CV", symbol: "$" },
  CZK: { name: "Czechia", countryCode: "CZ", symbol: "Kč" },
  DJF: { name: "Djibouti", countryCode: "DJ", symbol: "Fdj" },
  DKK: { name: "Denmark", countryCode: "DK", symbol: "kr" },
  DOP: { name: "Dominican Republic", countryCode: "DO", symbol: "RD$" },
  DZD: { name: "Algeria", countryCode: "DZ", symbol: "DA" },
  EGP: { name: "Egypt", countryCode: "EG", symbol: "E£" },
  ETB: { name: "Ethiopia", countryCode: "ET", symbol: "Br" },
  EUR: { name: "Eurozone", countryCode: "EU", symbol: "€" },
  FJD: { name: "Fiji", countryCode: "FJ", symbol: "FJ$" },
  FKP: { name: "Falkland Islands", countryCode: "FK", symbol: "£" },
  GBP: { name: "United Kingdom", countryCode: "GB", symbol: "£" },
  GEL: { name: "Georgia", countryCode: "GE", symbol: "₾" },
  GIP: { name: "Gibraltar", countryCode: "GI", symbol: "£" },
  GMD: { name: "Gambia", countryCode: "GM", symbol: "D" },
  GNF: { name: "Guinea", countryCode: "GN", symbol: "FG" },
  GTQ: { name: "Guatemala", countryCode: "GT", symbol: "Q" },
  GYD: { name: "Guyana", countryCode: "GY", symbol: "G$" },
  HKD: { name: "Hong Kong", countryCode: "HK", symbol: "HK$" },
  HNL: { name: "Honduras", countryCode: "HN", symbol: "L" },
  HRK: { name: "Croatia", countryCode: "HR", symbol: "kn" },
  HTG: { name: "Haiti", countryCode: "HT", symbol: "G" },
  HUF: { name: "Hungary", countryCode: "HU", symbol: "Ft" },
  IDR: { name: "Indonesia", countryCode: "ID", symbol: "Rp" },
  ILS: { name: "Israel", countryCode: "IL", symbol: "₪" },
  INR: { name: "India", countryCode: "IN", symbol: "₹" },
  ISK: { name: "Iceland", countryCode: "IS", symbol: "kr" },
  JMD: { name: "Jamaica", countryCode: "JM", symbol: "J$" },
  JOD: { name: "Jordan", countryCode: "JO", symbol: "JD" },
  JPY: { name: "Japan", countryCode: "JP", symbol: "¥" },
  KES: { name: "Kenya", countryCode: "KE", symbol: "KSh" },
  KGS: { name: "Kyrgyzstan", countryCode: "KG", symbol: "сом" },
  KHR: { name: "Cambodia", countryCode: "KH", symbol: "៛" },
  KMF: { name: "Comoros", countryCode: "KM", symbol: "CF" },
  KRW: { name: "South Korea", countryCode: "KR", symbol: "₩" },
  KWD: { name: "Kuwait", countryCode: "KW", symbol: "KD" },
  KYD: { name: "Cayman Islands", countryCode: "KY", symbol: "CI$" },
  KZT: { name: "Kazakhstan", countryCode: "KZ", symbol: "₸" },
  LAK: { name: "Laos", countryCode: "LA", symbol: "₭" },
  LBP: { name: "Lebanon", countryCode: "LB", symbol: "ل.ل" },
  LKR: { name: "Sri Lanka", countryCode: "LK", symbol: "Rs" },
  LRD: { name: "Liberia", countryCode: "LR", symbol: "L$" },
  LSL: { name: "Lesotho", countryCode: "LS", symbol: "L" },
  MAD: { name: "Morocco", countryCode: "MA", symbol: "DH" },
  MDL: { name: "Moldova", countryCode: "MD", symbol: "L" },
  MGA: { name: "Madagascar", countryCode: "MG", symbol: "Ar" },
  MKD: { name: "North Macedonia", countryCode: "MK", symbol: "ден" },
  MMK: { name: "Myanmar", countryCode: "MM", symbol: "K" },
  MNT: { name: "Mongolia", countryCode: "MN", symbol: "₮" },
  MOP: { name: "Macao", countryCode: "MO", symbol: "MOP$" },
  MUR: { name: "Mauritius", countryCode: "MU", symbol: "₨" },
  MVR: { name: "Maldives", countryCode: "MV", symbol: "Rf" },
  MWK: { name: "Malawi", countryCode: "MW", symbol: "MK" },
  MXN: { name: "Mexico", countryCode: "MX", symbol: "MX$" },
  MYR: { name: "Malaysia", countryCode: "MY", symbol: "RM" },
  MZN: { name: "Mozambique", countryCode: "MZ", symbol: "MT" },
  NAD: { name: "Namibia", countryCode: "NA", symbol: "N$" },
  NGN: { name: "Nigeria", countryCode: "NG", symbol: "₦" },
  NIO: { name: "Nicaragua", countryCode: "NI", symbol: "C$" },
  NOK: { name: "Norway", countryCode: "NO", symbol: "kr" },
  NPR: { name: "Nepal", countryCode: "NP", symbol: "Rs" },
  NZD: { name: "New Zealand", countryCode: "NZ", symbol: "NZ$" },
  OMR: { name: "Oman", countryCode: "OM", symbol: "OMR" },
  PAB: { name: "Panama", countryCode: "PA", symbol: "B/." },
  PEN: { name: "Peru", countryCode: "PE", symbol: "S/" },
  PGK: { name: "Papua New Guinea", countryCode: "PG", symbol: "K" },
  PHP: { name: "Philippines", countryCode: "PH", symbol: "₱" },
  PKR: { name: "Pakistan", countryCode: "PK", symbol: "Rs" },
  PLN: { name: "Poland", countryCode: "PL", symbol: "zł" },
  PYG: { name: "Paraguay", countryCode: "PY", symbol: "₲" },
  QAR: { name: "Qatar", countryCode: "QA", symbol: "QR" },
  RON: { name: "Romania", countryCode: "RO", symbol: "lei" },
  RSD: { name: "Serbia", countryCode: "RS", symbol: "дин" },
  RUB: { name: "Russia", countryCode: "RU", symbol: "₽" },
  RWF: { name: "Rwanda", countryCode: "RW", symbol: "FRw" },
  SAR: { name: "Saudi Arabia", countryCode: "SA", symbol: "﷼" },
  SBD: { name: "Solomon Islands", countryCode: "SB", symbol: "SI$" },
  SCR: { name: "Seychelles", countryCode: "SC", symbol: "₨" },
  SEK: { name: "Sweden", countryCode: "SE", symbol: "kr" },
  SGD: { name: "Singapore", countryCode: "SG", symbol: "S$" },
  SHP: { name: "Saint Helena", countryCode: "SH", symbol: "£" },
  SLE: { name: "Sierra Leone", countryCode: "SL", symbol: "Le" },
  SOS: { name: "Somalia", countryCode: "SO", symbol: "Sh" },
  SRD: { name: "Suriname", countryCode: "SR", symbol: "$" },
  STD: { name: "São Tomé and Príncipe", countryCode: "ST", symbol: "Db" },
  SZL: { name: "Eswatini", countryCode: "SZ", symbol: "L" },
  THB: { name: "Thailand", countryCode: "TH", symbol: "฿" },
  TJS: { name: "Tajikistan", countryCode: "TJ", symbol: "ЅМ" },
  TND: { name: "Tunisia", countryCode: "TN", symbol: "DT" },
  TOP: { name: "Tonga", countryCode: "TO", symbol: "T$" },
  TRY: { name: "Türkiye", countryCode: "TR", symbol: "₺" },
  TTD: { name: "Trinidad and Tobago", countryCode: "TT", symbol: "TT$" },
  TWD: { name: "Taiwan", countryCode: "TW", symbol: "NT$" },
  TZS: { name: "Tanzania", countryCode: "TZ", symbol: "TSh" },
  UAH: { name: "Ukraine", countryCode: "UA", symbol: "₴" },
  UGX: { name: "Uganda", countryCode: "UG", symbol: "USh" },
  UYU: { name: "Uruguay", countryCode: "UY", symbol: "$U" },
  UZS: { name: "Uzbekistan", countryCode: "UZ", symbol: "soʻm" },
  VND: { name: "Vietnam", countryCode: "VN", symbol: "₫" },
  VUV: { name: "Vanuatu", countryCode: "VU", symbol: "VT" },
  WST: { name: "Samoa", countryCode: "WS", symbol: "T" },
  XAF: { name: "Central Africa (CFA)", countryCode: "CM", symbol: "FCFA" },
  XCD: { name: "East Caribbean", countryCode: "AG", symbol: "EC$" },
  XCG: { name: "Caribbean Guilder", countryCode: "CW", symbol: "Cg" },
  XOF: { name: "West Africa (CFA)", countryCode: "SN", symbol: "CFA" },
  XPF: { name: "CFP Franc", countryCode: "PF", symbol: "₣" },
  YER: { name: "Yemen", countryCode: "YE", symbol: "﷼" },
  ZAR: { name: "South Africa", countryCode: "ZA", symbol: "R" },
  ZMW: { name: "Zambia", countryCode: "ZM", symbol: "K" },
};

export function flagFromCountryCode(countryCode: string): string {
  if (countryCode === "EU") return "🇪🇺";
  const code = countryCode.toUpperCase();
  if (!/^[A-Z]{2}$/.test(code)) return "🏳️";
  return String.fromCodePoint(...[...code].map((char) => 0x1f1e6 - 65 + char.charCodeAt(0)));
}

export function currencyToOption(currencyCode: string): CountryOption {
  const code = currencyCode.toUpperCase();
  const meta = CURRENCY_META[code] ?? {
    name: code,
    countryCode: "US",
    symbol: code,
  };
  return {
    code: meta.countryCode,
    name: meta.name,
    flag: flagFromCountryCode(meta.countryCode),
    currency: code,
    symbol: meta.symbol,
  };
}

export function currenciesFromRates(rates: Record<string, number>): CountryOption[] {
  return Object.keys(rates)
    .map((code) => code.toUpperCase())
    .sort((a, b) => a.localeCompare(b))
    .map(currencyToOption);
}

export function countryByCurrencyCode(currency: string | undefined): CountryOption {
  return currencyToOption(currency || DEFAULT_CURRENCY);
}

export function countryByCountryCode(countryCode: string | undefined): CountryOption {
  if (!countryCode) return currencyToOption(DEFAULT_CURRENCY);
  const match = Object.entries(CURRENCY_META).find(
    ([, meta]) => meta.countryCode === countryCode,
  );
  return match ? currencyToOption(match[0]) : currencyToOption(DEFAULT_CURRENCY);
}
