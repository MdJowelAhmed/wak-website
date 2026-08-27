export const resolveImageUrl = (path: string | undefined | null, fallback = "") => {
  if (!path) return fallback;
  const trimmed = path.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  if (trimmed.startsWith("/http://") || trimmed.startsWith("/https://")) {
    return trimmed.substring(1);
  }
  const relativePath = trimmed.startsWith("/") ? trimmed.substring(1) : trimmed;
  
  const baseUrl = process.env.NEXT_PUBLIC_IMG_URL || process.env.IMG_URL;
  if (!baseUrl) {
    return `/${relativePath}`;
  }
  
  const sep = baseUrl.endsWith("/") ? "" : "/";
  return `${baseUrl}${sep}${relativePath}`;
};