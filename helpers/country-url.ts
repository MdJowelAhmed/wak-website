import { isAppLocale } from "../src/i18n/locales";
import { isShoppingCountryCode, normalizeShoppingCountryCode } from "./regions";

export function parseLocaleCountryPath(pathname: string): {
  locale: string | null;
  country: string | null;
  rest: string;
} {
  const segments = pathname.split("/").filter(Boolean);
  const locale = segments[0] && isAppLocale(segments[0]) ? segments[0] : null;
  if (!locale) {
    return { locale: null, country: null, rest: pathname || "/" };
  }

  const second = segments[1];
  if (second && isShoppingCountryCode(second)) {
    const restSegments = segments.slice(2);
    return {
      locale,
      country: second.toUpperCase(),
      rest: restSegments.length ? `/${restSegments.join("/")}` : "/",
    };
  }

  const restSegments = segments.slice(1);
  return {
    locale,
    country: null,
    rest: restSegments.length ? `/${restSegments.join("/")}` : "/",
  };
}

export function buildCountryPath(locale: string, countryCode: string, rest: string): string {
  const country = normalizeShoppingCountryCode(countryCode).toLowerCase();
  const suffix = !rest || rest === "/" ? "" : rest.startsWith("/") ? rest : `/${rest}`;
  return `/${locale}/${country}${suffix}`;
}

export function toInternalLocalePath(locale: string, rest: string): string {
  const suffix = !rest || rest === "/" ? "" : rest.startsWith("/") ? rest : `/${rest}`;
  return `/${locale}${suffix}`;
}

export function stripCountryFromPathname(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments[0] && isShoppingCountryCode(segments[0])) {
    const rest = segments.slice(1);
    return rest.length ? `/${rest.join("/")}` : "/";
  }
  return pathname || "/";
}
