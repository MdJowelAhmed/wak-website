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
  currenciesFromRates,
  currencyToOption,
  fallbackCurrencies,
  resolvePreferredCurrency,
  type CountryOption,
} from "../../helpers/regions";

interface CurrencyContextValue {
  countryCode: string;
  currency: string;
  symbol: string;
  rate: number;
  rates: Record<string, number>;
  country: CountryOption;
  currencyOption: CountryOption;
  availableCurrencies: CountryOption[];
  formatPrice: (amountUsd: number) => string;
  rateLabel: string;
  setCountry: (countryCode: string) => void;
  setCurrencyCode: (currencyCode: string) => void;
}

const FALLBACK_RATES: Record<string, number> = { USD: 1 };
const defaultCountry = countryByCode(DEFAULT_COUNTRY);
const defaultCurrencyOption = currencyToOption(DEFAULT_CURRENCY);

const CurrencyContext = createContext<CurrencyContextValue>({
  countryCode: DEFAULT_COUNTRY,
  currency: DEFAULT_CURRENCY,
  symbol: defaultCurrencyOption.symbol,
  rate: 1,
  rates: { USD: 1 },
  country: defaultCountry,
  currencyOption: defaultCurrencyOption,
  availableCurrencies: fallbackCurrencies,
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
  const startingCountry = countryByCode(initialCountry);

  const [fetchedRates, setFetchedRates] = useState<Record<string, number> | null>(null);
  const [countryCode, setCountryCode] = useState(startingCountry.code);
  const [currency, setCurrency] = useState(() => currencyToOption(initialCurrency).currency);
  // Last persisted rate; only used until live rates for `currency` are available.
  const [storedRate, setStoredRate] = useState<number | undefined>(undefined);
  const [lastInitialCountry, setLastInitialCountry] = useState(initialCountry);

  const rates = initialRates?.rates ?? fetchedRates ?? FALLBACK_RATES;
  const rate = resolveRate(rates, currency, storedRate);

  const selectCurrency = useCallback((nextCurrency: string) => {
    setCurrency(currencyToOption(nextCurrency).currency);
    setStoredRate(undefined);
  }, []);

  if (initialCountry !== lastInitialCountry) {
    setLastInitialCountry(initialCountry);
    const option = countryByCode(initialCountry);
    if (option.code !== countryCode) {
      setCountryCode(option.code);
      selectCurrency(option.currency);
    }
  }

  useEffect(() => {
    const savedCountry = localStorage.getItem(STORAGE_COUNTRY);
    const savedCurrency = localStorage.getItem(STORAGE_CURRENCY);
    if (!savedCountry && !savedCurrency) return;

    const preferredCurrency = resolvePreferredCurrency(startingCountry.code, savedCountry, savedCurrency);
    const savedRate = Number(localStorage.getItem(STORAGE_RATE));
    const keepStoredRate = preferredCurrency === savedCurrency && Number.isFinite(savedRate) && savedRate > 0;
    // localStorage is only readable after hydration, so this one-time sync must run in an effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrency(preferredCurrency);
    setStoredRate(keepStoredRate ? savedRate : undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (initialRates?.rates) return;

    let cancelled = false;
    getExchangeRates().then((payload) => {
      if (!cancelled && payload) setFetchedRates(payload.rates);
    });
    return () => {
      cancelled = true;
    };
  }, [initialRates]);

  useEffect(() => {
    persistCurrencyPreference(countryCode, currency, rate);
  }, [countryCode, currency, rate]);

  const setCountry = useCallback(
    (nextCountryCode: string) => {
      const option = countryByCode(nextCountryCode);
      setCountryCode(option.code);
      selectCurrency(option.currency);
    },
    [selectCurrency],
  );

  const country = countryByCode(countryCode);
  const currencyOption = useMemo(() => currencyToOption(currency), [currency]);
  const availableCurrencies = useMemo(
    () => (Object.keys(rates).length > 1 ? currenciesFromRates(rates) : fallbackCurrencies),
    [rates],
  );

  const value = useMemo<CurrencyContextValue>(
    () => ({
      countryCode,
      currency,
      symbol: currencyOption.symbol,
      rate,
      rates,
      country,
      currencyOption,
      availableCurrencies,
      formatPrice: (amountUsd: number) => formatConvertedPrice(amountUsd, currency, rate),
      rateLabel: formatExchangeRate(rate, currency),
      setCountry,
      setCurrencyCode: selectCurrency,
    }),
    [
      availableCurrencies,
      country,
      countryCode,
      currency,
      currencyOption,
      rate,
      rates,
      setCountry,
      selectCurrency,
    ],
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
