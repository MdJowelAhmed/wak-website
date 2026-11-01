import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://worthworld.com";
  const routes = [
    "",
    "/shop",
    "/services",
    "/about-us",
    "/contact-us",
    "/privacy-policy",
    "/terms-of-services",
    "/product-categories",
    "/service-categories",
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    for (const route of routes) {
      entries.push({
        url: `${siteUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === "" || route === "/shop" || route === "/services" ? "daily" : "monthly",
        priority: route === "" ? 1.0 : 0.8,
      });
    }
  }

  return entries;
}

