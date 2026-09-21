"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
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
  const startingCurrencyOption = currencyToOption(initialCurrency);
  const startingCurrency = startingCurrencyOption.currency;
  const startingRates = initialRates?.rates ?? { USD: 1 };

  const [rates, setRates] = useState<Record<string, number>>(startingRates);
  const [countryCode, setCountryCode] = useState(startingCountry.code);
  const [currency, setCurrency] = useState(startingCurrency);
  const [rate, setRate] = useState(resolveRate(startingRates, startingCurrency));
  const syncedCountryRef = useRef(startingCountry.code);

  const applyCurrency = useCallback(
    (
      nextCurrency: string,
      nextRates: Record<string, number>,
      nextCountryCode: string,
      storedRate?: number,
    ) => {
      const option = currencyToOption(nextCurrency);
      const nextRate = resolveRate(nextRates, option.currency, storedRate);
      setCurrency(option.currency);
      setRate(nextRate);
      persistCurrencyPreference(nextCountryCode, option.currency, nextRate);
    },
    [],
  );

  useEffect(() => {
    const savedCountry = localStorage.getItem(STORAGE_COUNTRY);
    const savedCurrency = localStorage.getItem(STORAGE_CURRENCY);
    if (!savedCountry && !savedCurrency) return;

    const preferredCurrency = resolvePreferredCurrency(
      startingCountry.code,
      savedCountry,
      savedCurrency,
    );
    const savedRate = Number(localStorage.getItem(STORAGE_RATE));
    const keepStoredRate = preferredCurrency === savedCurrency;
    applyCurrency(
      preferredCurrency,
      startingRates,
      startingCountry.code,
      keepStoredRate && Number.isFinite(savedRate) && savedRate > 0 ? savedRate : undefined,
    );
    // Hydrate from localStorage only when it belongs to the current country.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const option = countryByCode(initialCountry);
    if (option.code === syncedCountryRef.current) return;
    syncedCountryRef.current = option.code;
    setCountryCode(option.code);
    applyCurrency(option.currency, rates, option.code);
    // URL country changed; live rates update the displayed number in the persist effect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applyCurrency, initialCountry]);

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
      const option = countryByCode(nextCountryCode);
      syncedCountryRef.current = option.code;
      setCountryCode(option.code);
      applyCurrency(option.currency, rates, option.code);
    },
    [applyCurrency, rates],
  );

  const setCurrencyCode = useCallback(
    (nextCurrency: string) => {
      applyCurrency(nextCurrency, rates, countryCode);
    },
    [applyCurrency, countryCode, rates],
  );

  const country = countryByCode(countryCode);
  const currencyOption = currencyToOption(currency);
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
      setCurrencyCode,
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
      setCurrencyCode,
    ],
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
