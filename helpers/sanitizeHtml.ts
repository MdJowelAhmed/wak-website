import "server-only";
import sanitize from "sanitize-html";

const OPTIONS: sanitize.IOptions = {
  allowedTags: [...sanitize.defaults.allowedTags, "h1", "h2", "img", "span"],
  allowedAttributes: {
    a: ["href", "name", "target", "rel"],
    img: ["src", "alt", "width", "height"],
  },
  allowedSchemes: ["http", "https", "mailto", "tel"],
  transformTags: {
    a: sanitize.simpleTransform("a", { rel: "noopener noreferrer" }),
  },
};

const HTML_TAG_PATTERN = /<[a-z][\s\S]*>/i;

/** Strips scripts, event handlers and unsafe URLs from CMS/admin-authored HTML. */
export function sanitizeHtml(html: string): string {
  return sanitize(html, OPTIONS);
}

/** Sanitizes values that are rendered as HTML; plain text is left untouched so React escapes it. */
export function sanitizeRichText(content: string): string {
  return HTML_TAG_PATTERN.test(content) ? sanitizeHtml(content) : content;
}
