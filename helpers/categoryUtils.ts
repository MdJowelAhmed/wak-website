import type { Category } from "./categoryService";

export type CategoryKind = "product" | "service";

export function getCategoryHref(
    category: Pick<Category, "_id" | "name" | "slug">,
    kind: CategoryKind,
): string {
    const param = encodeURIComponent(category.slug || category._id || category.name);
    return kind === "product" ? `/shop?category=${param}` : `/services?category=${param}`;
}

export function isFeaturedCategory(category: Category): boolean {
    return category.isFeatured === true || String(category.isFeatured).toLowerCase() === "true";
}
