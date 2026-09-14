import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import ProductGallery from "./components/ProductGallery";
import ProductInfo from "./components/ProductInfo";
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
                <header className="mb-8">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/80">
                        <Link href="/shop" className="hover:text-white">
                            {t("shop")}
                        </Link>
                        <span className="mx-2 text-white/40">/</span>
                        {product.name}
                    </p>
                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        {product.name}
                    </h1>
                </header>

                <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_1.05fr] xl:gap-12">
                    <div className="lg:sticky lg:top-24">
                        <ProductGallery
                            images={product.images}
                            name={product.name}
                            inStock={product.stock > 0}
                            discount={product.discount}
                        />
                    </div>
                    <ProductInfo product={product} />
                </div>

                <div className="mt-8 space-y-6">
                    <ProductSpecs product={product} />
                    {relatedProducts.length > 0 && <RelatedItems products={relatedProducts} />}
                </div>
            </div>
        </div>
    );
}
