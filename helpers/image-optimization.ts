/**
 * The Next image optimizer cannot fetch blob/data URLs, and plain-http media comes from
 * the private-IP dev API, which the optimizer's SSRF guard rejects in production.
 */
export function skipImageOptimization(src: string | null | undefined): boolean {
  if (!src) return true;
  return src.startsWith("blob:") || src.startsWith("data:") || src.startsWith("http://");
}
