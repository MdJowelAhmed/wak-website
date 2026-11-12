import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

type Messages = Record<string, unknown>;

function isMessageObject(value: unknown): value is Messages {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function mergeMessages(fallback: Messages, current: Messages): Messages {
  const result: Messages = { ...fallback };
  for (const key of Object.keys(current)) {
    const fallbackValue = fallback[key];
    const currentValue = current[key];
    result[key] =
      isMessageObject(fallbackValue) && isMessageObject(currentValue)
        ? mergeMessages(fallbackValue, currentValue)
        : currentValue;
  }
  return result;
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const defaultMessages = (await import("../messages/en.json")).default;
  const localeMessages =
    locale === "en"
      ? defaultMessages
      : (await import(`../messages/${locale}.json`)).default;

  return {
    locale,
    messages: locale === "en" ? defaultMessages : mergeMessages(defaultMessages, localeMessages),
  };
});
