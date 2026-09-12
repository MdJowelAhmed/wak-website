"use server";

import {
  parseExchangeRates,
  type ExchangeRatesPayload,
} from "./currency";

export async function getExchangeRates(): Promise<ExchangeRatesPayload | null> {
  try {
    const res = await fetch(`${process.env.BASE_URL}/exchange-rates`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 3600, tags: ["exchange-rates"] },
    });
    if (!res.ok) return null;
    return parseExchangeRates(await res.json());
  } catch {
    return null;
  }
}
