import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import { COOKIE_MAX_AGE, STORAGE_COUNTRY } from "../helpers/currency";
import {
  buildCountryPath,
  parseLocaleCountryPath,
  toInternalLocalePath,
} from "../helpers/country-url";
import { normalizeShoppingCountryCode } from "../helpers/regions";

const intlMiddleware = createMiddleware(routing);

function withCountryCookie(response: NextResponse, countryCode: string) {
  response.cookies.set(STORAGE_COUNTRY, countryCode, {
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
  return response;
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const parsed = parseLocaleCountryPath(pathname);

  if (parsed.locale && parsed.country) {
    const country = normalizeShoppingCountryCode(parsed.country);
    const canonical = buildCountryPath(parsed.locale, country, parsed.rest);

    if (pathname !== canonical) {
      const url = request.nextUrl.clone();
      url.pathname = canonical;
      return withCountryCookie(NextResponse.redirect(url), country);
    }

    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = toInternalLocalePath(parsed.locale, parsed.rest);

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-country-code", country);

    return withCountryCookie(
      NextResponse.rewrite(rewriteUrl, {
        request: { headers: requestHeaders },
      }),
      country,
    );
  }

  if (parsed.locale) {
    const country = normalizeShoppingCountryCode(
      request.cookies.get(STORAGE_COUNTRY)?.value,
    );
    const url = request.nextUrl.clone();
    url.pathname = buildCountryPath(parsed.locale, country, parsed.rest);
    return withCountryCookie(NextResponse.redirect(url), country);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
