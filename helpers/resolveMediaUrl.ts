import { resolveImageUrl } from "./resolveImageUrl";

/** Resolves API paths such as `/media/promo.mp4` to a full playback URL. */
export const resolveMediaUrl = (
  path: string | undefined | null,
  fallback = "",
): string => {
  return resolveImageUrl(path, fallback);
};
