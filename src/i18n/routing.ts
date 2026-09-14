import { defineRouting } from "next-intl/routing";
import { APP_LOCALES } from "./locales";

export const routing = defineRouting({
  locales: APP_LOCALES,
  defaultLocale: "en",
  localePrefix: "always",
  localeCookie: {
    name: "user_language",
    maxAge: 60 * 60 * 24 * 365,
  },
});
