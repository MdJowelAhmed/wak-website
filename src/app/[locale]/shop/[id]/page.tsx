import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import ShopDetails from "@/components/(customer-pages)/shop-details";
import {
    mapProductDetails,
    mapRelatedProducts,
} from "@/components/(customer-pages)/shop-details/types";
import { myFetch } from "../../../../../helpers/myFetch";
import { sanitizeRichText } from "../../../../../helpers/sanitizeHtml";

type ShopDetailsPageProps = {
    params: Promise<{ id: string }>;
};

const PRODUCT_FETCH: Parameters<typeof myFetch>[1] = {
    cache: "force-cache",
    next: { revalidate: 3600, tags: ["products"] },
};
const META_DESCRIPTION_LENGTH = 160;

const getProduct = cache(async (id: string) => {
    const bySlug = await myFetch(`/products/slug/${encodeURIComponent(id)}`, PRODUCT_FETCH);
    const res = bySlug?.data ? bySlug : await myFetch(`/products/${encodeURIComponent(id)}`, PRODUCT_FETCH);
    const product = mapProductDetails(res?.data);
    if (!product) return null;

    return {
        ...product,
        description: sanitizeRichText(product.description),
        productDetails: sanitizeRichText(product.productDetails),
    };
});

function toPlainText(html: string): string {
    return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export async function generateMetadata({ params }: ShopDetailsPageProps): Promise<Metadata> {
    const { id } = await params;
    const product = await getProduct(id);
    if (!product) return {};

    const description = toPlainText(product.description).slice(0, META_DESCRIPTION_LENGTH);
    const image = product.images[0];

    return {
        title: product.name,
        description: description || undefined,
        openGraph: {
            title: product.name,
            description: description || undefined,
            images: image?.startsWith("http") ? [image] : undefined,
        },
    };
}

export default async function ShopDetailsPage({ params }: ShopDetailsPageProps) {
    const { id } = await params;
    const product = await getProduct(id);
    if (!product) notFound();

    const relatedRes = await myFetch(`/products/${product.id}/related`, PRODUCT_FETCH);

    return (
        <ShopDetails
            product={product}
            relatedProducts={mapRelatedProducts(relatedRes?.data)}
        />
    );
}
