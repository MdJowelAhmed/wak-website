import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://worthworld.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/profile/",
        "/order/failed",
        "/orders/failed",
        "/cart",
        "/check-out",
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}

