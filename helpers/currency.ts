export const DEFAULT_COUNTRY = "MW";
export const DEFAULT_CURRENCY = "MWK";

export const STORAGE_COUNTRY = "user_country";
export const STORAGE_CURRENCY = "user_currency";
export const STORAGE_RATE = "user_currency_rate";

export const COOKIE_MAX_AGE = 31536000;

export interface ExchangeRatesPayload {
  timestamp: number;
  base: string;
  rates: Record<string, number>;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
}

export function parseExchangeRates(raw: unknown): ExchangeRatesPayload | null {
  const root = asRecord(raw);
  if (!root) return null;

  const payload = asRecord(root.rates) ? root : asRecord(root.data);
  const ratesRaw = payload ? asRecord(payload.rates) : null;
  if (!payload || !ratesRaw) return null;

  const rates: Record<string, number> = {};
  for (const [code, value] of Object.entries(ratesRaw)) {
    if (typeof value === "number" && Number.isFinite(value) && value > 0) {
      rates[code.toUpperCase()] = value;
    }
  }

  if (!rates.USD) rates.USD = 1;
  if (Object.keys(rates).length === 0) return null;

  return {
    timestamp: typeof payload.timestamp === "number" ? payload.timestamp : 0,
    base: typeof payload.base === "string" && payload.base ? payload.base.toUpperCase() : "USD",
    rates,
  };
}

export function resolveRate(
  rates: Record<string, number>,
  currency: string,
  fallbackRate?: number,
): number {
  const live = rates[currency.toUpperCase()];
  if (typeof live === "number" && live > 0) return live;
  if (typeof fallbackRate === "number" && fallbackRate > 0) return fallbackRate;
  return 1;
}

export function convertFromUsd(amountUsd: number, rate: number): number {
  const amount = Number.isFinite(amountUsd) ? amountUsd : 0;
  const safeRate = Number.isFinite(rate) && rate > 0 ? rate : 1;
  return amount * safeRate;
}

export function formatConvertedPrice(
  amountUsd: number,
  currency: string,
  rate: number,
): string {
  const converted = convertFromUsd(amountUsd, rate);
  const code = currency || DEFAULT_CURRENCY;
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: code,
    }).format(converted);
  } catch {
    return `${code} ${converted.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
}

export function formatExchangeRate(rate: number, currency: string): string {
  const safeRate = Number.isFinite(rate) && rate > 0 ? rate : 1;
  const formatted = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: safeRate >= 10 ? 2 : 4,
  }).format(safeRate);
  return `1 USD = ${formatted} ${currency}`;
}

export function persistCurrencyPreference(
  countryCode: string,
  currency: string,
  rate: number,
): void {
  if (typeof window === "undefined") return;

  localStorage.setItem(STORAGE_COUNTRY, countryCode);
  localStorage.setItem(STORAGE_CURRENCY, currency);
  localStorage.setItem(STORAGE_RATE, String(rate));

  document.cookie = `${STORAGE_COUNTRY}=${countryCode}; path=/; max-age=${COOKIE_MAX_AGE}`;
  document.cookie = `${STORAGE_CURRENCY}=${currency}; path=/; max-age=${COOKIE_MAX_AGE}`;
  document.cookie = `${STORAGE_RATE}=${rate}; path=/; max-age=${COOKIE_MAX_AGE}`;
}
