import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

function mergeMessages(fallback: Record<string, unknown>, current: Record<string, unknown>) {
  const result: Record<string, unknown> = { ...fallback };
  for (const key of Object.keys(current)) {
    if (
      typeof current[key] === "object" &&
      current[key] !== null &&
      !Array.isArray(current[key]) &&
      typeof fallback[key] === "object" &&
      fallback[key] !== null
    ) {
      result[key] = {
        ...(fallback[key] as Record<string, unknown>),
        ...(current[key] as Record<string, unknown>),
      };
    } else {
      result[key] = current[key];
    }
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
