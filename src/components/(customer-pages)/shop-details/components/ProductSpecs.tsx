import { getTranslations } from "next-intl/server";
import type { ProductDetailsData } from "../types";

function HtmlOrText({ content, className }: { content: string; className?: string }) {
    const isHtml = /<[a-z][\s\S]*>/i.test(content);
    if (isHtml) {
        return (
            <div
                className={className}
                dangerouslySetInnerHTML={{ __html: content }}
            />
        );
    }
    return <p className={className}>{content}</p>;
}

export default async function ProductSpecs({ product }: { product: ProductDetailsData }) {
    const t = await getTranslations("ShopDetails");
    const hasDetails = Boolean(product.productDetails);
    const hasDescriptionOnly = !hasDetails && Boolean(product.description);
    const hasAbout = hasDetails || hasDescriptionOnly;

    const specs = [
        product.weight ? { label: t("weight"), value: t("weightValue", { value: product.weight }) } : null,
        product.dimensions
            ? {
                  label: t("dimensions"),
                  value: t("dimensionsValue", {
                      length: product.dimensions.length,
                      width: product.dimensions.width,
                      height: product.dimensions.height,
                  }),
              }
            : null,
    ].filter((item): item is { label: string; value: string } => item !== null);

    if (!hasAbout && specs.length === 0) return null;

    return (
        <section className="rounded-2xl border border-white/10 bg-secondary p-5 shadow-lg sm:p-6">
            {hasAbout && (
                <div className="space-y-5">
                    <h2 className="text-lg font-bold text-white">
                        {hasDetails ? (t("productDetails") || "Product Details") : t("about")}
                    </h2>

                    {hasDetails ? (
                        <HtmlOrText
                            content={product.productDetails}
                            className="text-sm leading-relaxed text-white/80 [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-white [&_h3]:mt-5 [&_h3]:mb-2 [&_h3:first-child]:mt-0 [&_p]:text-white/80 [&_p]:leading-relaxed [&_p]:mb-3 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_ul]:my-3 [&_li]:text-white/80 [&_li]:text-sm [&_li_p]:m-0 [&_strong]:text-white [&_strong]:font-semibold"
                        />
                    ) : (
                        <HtmlOrText
                            content={product.description}
                            className="text-sm leading-relaxed text-white/85 [&_p]:mb-3 [&_p:last-child]:mb-0 [&_strong]:text-white [&_strong]:font-semibold"
                        />
                    )}
                </div>
            )}

            {specs.length > 0 && (
                <div className={hasAbout ? "mt-6 border-t border-white/10 pt-5" : ""}>
                    <h2 className="mb-4 text-lg font-bold text-white">{t("specifications")}</h2>
                    <dl className="grid gap-3 sm:grid-cols-2">
                        {specs.map((item) => (
                            <div
                                key={item.label}
                                className="rounded-xl border border-white/10 bg-white/5 px-4 py-3"
                            >
                                <dt className="text-xs font-semibold uppercase tracking-wide text-white/55">
                                    {item.label}
                                </dt>
                                <dd className="mt-1 text-sm font-medium text-white">{item.value}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            )}
        </section>
    );
}
