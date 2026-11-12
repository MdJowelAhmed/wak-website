import { resolveImageUrl } from "./resolveImageUrl";
import { resolveMediaUrl } from "./resolveMediaUrl";
import type { HeroData } from "@/components/(customer-pages)/home/components/Banner";

type RawHero = {
  _id?: string;
  header?: string;
  description?: string;
  mediaType?: "image" | "video";
  image?: string | null;
  video?: string | null;
  thumbnail?: string | null;
  type?: "product" | "service" | "link";
  product?: { slug?: string } | null;
  service?: { slug?: string } | null;
  link?: string | null;
};

export function mapHeroBanners(raw: unknown): HeroData[] {
  if (!Array.isArray(raw)) return [];

  return raw.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const row = item as RawHero;
    if (!row._id || !row.header) return [];

    const mediaType: HeroData["mediaType"] =
      row.mediaType === "video" || Boolean(row.video) ? "video" : "image";

    const image =
      mediaType === "image" && row.image
        ? resolveImageUrl(row.image, "/banner.png") || "/banner.png"
        : null;

    const video =
      mediaType === "video" && row.video
        ? resolveMediaUrl(row.video) || null
        : null;

    const thumbnail = row.thumbnail
      ? resolveImageUrl(row.thumbnail) || null
      : null;

    return [
      {
        _id: row._id,
        header: row.header,
        description: row.description || "",
        mediaType,
        image,
        video,
        thumbnail,
        type: row.type,
        product: row.product?.slug ? { slug: row.product.slug } : null,
        service: row.service?.slug ? { slug: row.service.slug } : null,
        link: row.link || null,
      },
    ];
  });
}

export function isVideoHeroBanner(banner: HeroData): boolean {
  return banner.mediaType === "video" || Boolean(banner.video);
}
