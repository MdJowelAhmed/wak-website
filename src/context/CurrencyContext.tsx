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
  countriesList,
  countryByCode,
  currenciesFromRates,
  currencyToOption,
  type CountryOption,
} from "../../helpers/regions";

interface CurrencyContextValue {
  countryCode: string;
  currency: string;
  symbol: string;
  rate: number;
  rates: Record<string, number>;
  country: CountryOption;
  availableCurrencies: CountryOption[];
  formatPrice: (amountUsd: number) => string;
  rateLabel: string;
  setCountry: (countryCode: string) => void;
  setCurrencyCode: (currencyCode: string) => void;
}

const defaultCountry = countryByCode(DEFAULT_COUNTRY);

const CurrencyContext = createContext<CurrencyContextValue>({
  countryCode: DEFAULT_COUNTRY,
  currency: DEFAULT_CURRENCY,
  symbol: defaultCountry.symbol,
  rate: 1,
  rates: { USD: 1 },
  country: defaultCountry,
  availableCurrencies: countriesList,
  formatPrice: (amountUsd) => formatConvertedPrice(amountUsd, DEFAULT_CURRENCY, 1),
  rateLabel: formatExchangeRate(1, DEFAULT_CURRENCY),
  setCountry: () => {},
  setCurrencyCode: () => {},
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
  const startingOption = initialCurrency
    ? currencyToOption(initialCurrency)
    : countryByCode(initialCountry);
  const startingCurrency = startingOption.currency || DEFAULT_CURRENCY;
  const startingRates = initialRates?.rates ?? { USD: 1 };

  const [rates, setRates] = useState<Record<string, number>>(startingRates);
  const [countryCode, setCountryCode] = useState(startingOption.code);
  const [currency, setCurrency] = useState(startingCurrency);
  const [rate, setRate] = useState(resolveRate(startingRates, startingCurrency));

  const applyCurrency = useCallback(
    (nextCurrency: string, nextRates: Record<string, number>, storedRate?: number) => {
      const option = currencyToOption(nextCurrency);
      const nextRate = resolveRate(nextRates, option.currency, storedRate);
      setCountryCode(option.code);
      setCurrency(option.currency);
      setRate(nextRate);
      persistCurrencyPreference(option.code, option.currency, nextRate);
    },
    [],
  );

  useEffect(() => {
    const savedCountry = localStorage.getItem(STORAGE_COUNTRY);
    const savedCurrency = localStorage.getItem(STORAGE_CURRENCY);
    const savedRate = Number(localStorage.getItem(STORAGE_RATE));
    const option = savedCurrency
      ? currencyToOption(savedCurrency)
      : countryByCode(savedCountry || DEFAULT_COUNTRY);
    applyCurrency(
      option.currency,
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
      applyCurrency(countryByCode(nextCountryCode).currency, rates);
    },
    [applyCurrency, rates],
  );

  const setCurrencyCode = useCallback(
    (nextCurrency: string) => {
      applyCurrency(nextCurrency, rates);
    },
    [applyCurrency, rates],
  );

  const country = currencyToOption(currency);
  const availableCurrencies = useMemo(
    () => (Object.keys(rates).length > 1 ? currenciesFromRates(rates) : countriesList),
    [rates],
  );

  const value = useMemo<CurrencyContextValue>(
    () => ({
      countryCode,
      currency,
      symbol: country.symbol,
      rate,
      rates,
      country,
      availableCurrencies,
      formatPrice: (amountUsd: number) => formatConvertedPrice(amountUsd, currency, rate),
      rateLabel: formatExchangeRate(rate, currency),
      setCountry,
      setCurrencyCode,
    }),
    [availableCurrencies, country, countryCode, currency, rate, rates, setCountry, setCurrencyCode],
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
