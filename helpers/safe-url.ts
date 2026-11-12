/** Returns the path when `value` is a same-site relative path such as `/shop?x=1`. */
export function toInternalPath(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  if (!trimmed || !trimmed.startsWith("/") || trimmed.startsWith("//") || trimmed.includes("\\")) {
    return null;
  }
  return trimmed;
}

/** Returns a normalized absolute URL only for http(s), blocking `javascript:`, `data:` and similar schemes. */
export function toSafeExternalUrl(
  value: string | null | undefined,
  { requireHttps = false }: { requireHttps?: boolean } = {},
): string | null {
  const trimmed = value?.trim();
  if (!trimmed) return null;

  try {
    const url = new URL(trimmed);
    const allowed = requireHttps ? url.protocol === "https:" : url.protocol === "https:" || url.protocol === "http:";
    return allowed ? url.toString() : null;
  } catch {
    return null;
  }
}

/** Payment provider redirects must be HTTPS. */
export function redirectToCheckout(checkoutUrl: unknown): boolean {
  const safeUrl = typeof checkoutUrl === "string" ? toSafeExternalUrl(checkoutUrl, { requireHttps: true }) : null;
  if (!safeUrl) return false;
  window.location.assign(safeUrl);
  return true;
}
