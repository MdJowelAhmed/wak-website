"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getExchangeRates } from "../../helpers/getExchangeRates";
import {
  DEFAULT_COUNTRY,
  DEFAULT_CURRENCY,
  STORAGE_COUNTRY,
  STORAGE_CURRENCY,
  STORAGE_RATE,
  formatConvertedPrice,
  formatExchangeRate,
  persistCurrencyPreference,
  resolveRate,
  type ExchangeRatesPayload,
} from "../../helpers/currency";
import {
  countryByCode,
  countryByCurrency,
  type CountryOption,
} from "../../helpers/regions";

interface CurrencyContextValue {
  countryCode: string;
  currency: string;
  symbol: string;
  rate: number;
  rates: Record<string, number>;
  country: CountryOption;
  formatPrice: (amountUsd: number) => string;
  rateLabel: string;
  setCountry: (countryCode: string) => void;
}

const defaultCountry = countryByCode(DEFAULT_COUNTRY);

const CurrencyContext = createContext<CurrencyContextValue>({
  countryCode: DEFAULT_COUNTRY,
  currency: DEFAULT_CURRENCY,
  symbol: defaultCountry.symbol,
  rate: 1,
  rates: { USD: 1 },
  country: defaultCountry,
  formatPrice: (amountUsd) => formatConvertedPrice(amountUsd, DEFAULT_CURRENCY, 1),
  rateLabel: formatExchangeRate(1, DEFAULT_CURRENCY),
  setCountry: () => {},
});

interface CurrencyProviderProps {
  children: ReactNode;
  initialRates: ExchangeRatesPayload | null;
  initialCountry?: string;
  initialCurrency?: string;
}

export function CurrencyProvider({
  children,
  initialRates,
  initialCountry = DEFAULT_COUNTRY,
  initialCurrency = DEFAULT_CURRENCY,
}: CurrencyProviderProps) {
  const startingCountry = countryByCode(initialCountry);
  const startingCurrency = startingCountry.currency || initialCurrency || DEFAULT_CURRENCY;
  const startingRates = initialRates?.rates ?? { USD: 1 };

  const [rates, setRates] = useState<Record<string, number>>(startingRates);
  const [countryCode, setCountryCode] = useState(startingCountry.code);
  const [currency, setCurrency] = useState(startingCurrency);
  const [rate, setRate] = useState(resolveRate(startingRates, startingCurrency));

  const applyPreference = useCallback(
    (nextCountryCode: string, nextRates: Record<string, number>, storedRate?: number) => {
      const country = countryByCode(nextCountryCode);
      const nextCurrency = country.currency;
      const nextRate = resolveRate(nextRates, nextCurrency, storedRate);
      setCountryCode(country.code);
      setCurrency(nextCurrency);
      setRate(nextRate);
      persistCurrencyPreference(country.code, nextCurrency, nextRate);
    },
    [],
  );

  useEffect(() => {
    const savedCountry = localStorage.getItem(STORAGE_COUNTRY);
    const savedCurrency = localStorage.getItem(STORAGE_CURRENCY);
    const savedRate = Number(localStorage.getItem(STORAGE_RATE));
    const country = savedCountry
      ? countryByCode(savedCountry)
      : countryByCurrency(savedCurrency || undefined) || countryByCode(DEFAULT_COUNTRY);
    applyPreference(
      country.code,
      startingRates,
      Number.isFinite(savedRate) && savedRate > 0 ? savedRate : undefined,
    );
    // Hydrate from localStorage once on the client.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (initialRates?.rates) {
      setRates(initialRates.rates);
      return;
    }

    let cancelled = false;
    getExchangeRates().then((payload) => {
      if (cancelled || !payload) return;
      setRates(payload.rates);
    });
    return () => {
      cancelled = true;
    };
  }, [initialRates]);

  useEffect(() => {
    const nextRate = resolveRate(rates, currency, rate);
    if (nextRate !== rate) setRate(nextRate);
    persistCurrencyPreference(countryCode, currency, nextRate);
  }, [rates, currency, countryCode, rate]);

  const setCountry = useCallback(
    (nextCountryCode: string) => {
      applyPreference(nextCountryCode, rates);
    },
    [applyPreference, rates],
  );

  const country = countryByCode(countryCode);
  const value = useMemo<CurrencyContextValue>(
    () => ({
      countryCode,
      currency,
      symbol: country.symbol,
      rate,
      rates,
      country,
      formatPrice: (amountUsd: number) => formatConvertedPrice(amountUsd, currency, rate),
      rateLabel: formatExchangeRate(rate, currency),
      setCountry,
    }),
    [country, countryCode, currency, rate, rates, setCountry],
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
