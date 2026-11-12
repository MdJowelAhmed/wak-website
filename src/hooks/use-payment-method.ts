"use client";

import { useCallback, useState } from "react";
import { useCurrency } from "./use-currency";

export type PaymentMethod = "stripe" | "paychangu";

function defaultPaymentMethod(countryCode: string | undefined): PaymentMethod {
  return countryCode?.toUpperCase() === "MW" ? "paychangu" : "stripe";
}

/** The user's choice applies to the country it was made in; changing country restores that country's default. */
export function usePaymentMethod() {
  const { countryCode } = useCurrency();
  const [choice, setChoice] = useState<{ countryCode: string | undefined; method: PaymentMethod } | null>(null);

  const paymentMethod =
    choice && choice.countryCode === countryCode ? choice.method : defaultPaymentMethod(countryCode);

  const setPaymentMethod = useCallback(
    (method: PaymentMethod) => setChoice({ countryCode, method }),
    [countryCode],
  );

  return [paymentMethod, setPaymentMethod] as const;
}
