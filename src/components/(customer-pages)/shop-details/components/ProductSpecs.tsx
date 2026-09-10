import type { ProductDetailsData } from "../types";

export default function ProductSpecs({ product }: { product: ProductDetailsData }) {
    const hasAbout = Boolean(product.description || product.productDetails);
    const extraSpecs = [
        product.weight ? { label: "Weight", value: `${product.weight} kg` } : null,
        product.dimensions
            ? {
                  label: "Dimensions",
                  value: `${product.dimensions.length} × ${product.dimensions.width} × ${product.dimensions.height} cm`,
              }
            : null,
    ].filter((item): item is { label: string; value: string } => item !== null);
    const specs = [...product.highlights, ...extraSpecs];

    if (!hasAbout && specs.length === 0) return null;

    return (
        <section className="rounded-2xl border border-white/10 bg-secondary p-5 shadow-lg sm:p-6">
            {hasAbout && (
                <div>
                    <h2 className="text-lg font-bold text-white">About this product</h2>
                    {product.description && (
                        <p className="mt-3 text-sm leading-relaxed text-white/80">{product.description}</p>
                    )}
                    {product.productDetails && (
                        <p className="mt-3 text-sm leading-relaxed text-white/75">{product.productDetails}</p>
                    )}
                </div>
            )}

            {specs.length > 0 && (
                <div className={hasAbout ? "mt-6 border-t border-white/10 pt-5" : ""}>
                    <h2 className="mb-4 text-lg font-bold text-white">Specifications</h2>
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
