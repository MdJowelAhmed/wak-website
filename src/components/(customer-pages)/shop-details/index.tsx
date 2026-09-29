import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import ProductInteractiveSection from "./components/ProductInteractiveSection";
import ProductSpecs from "./components/ProductSpecs";
import RelatedItems from "./components/RelatedItems";
import type { ProductDetailsData, RelatedProduct } from "./types";

export default async function ShopDetails({
    product,
    relatedProducts,
}: {
    product: ProductDetailsData;
    relatedProducts: RelatedProduct[];
}) {
    const t = await getTranslations("ShopDetails");

    return (
        <div className="px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
            <div className="container mx-auto max-w-7xl">
                <header className="mb-6">
                    <nav aria-label="Breadcrumb">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/80">
                            <Link href="/shop" className="hover:text-white transition-colors">
                                {t("shop")}
                            </Link>
                            <span className="mx-2 text-white/40">/</span>
                            <span className="text-white/60">{product.name}</span>
                        </p>
                    </nav>
                </header>

                <ProductInteractiveSection product={product} />

                <div className="mt-8 space-y-6">
                    <ProductSpecs product={product} />
                    {relatedProducts.length > 0 && <RelatedItems products={relatedProducts} />}
                </div>
            </div>
        </div>
    );
}
