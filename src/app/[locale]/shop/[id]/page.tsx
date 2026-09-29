import { notFound } from "next/navigation";
import ShopDetails from "@/components/(customer-pages)/shop-details";
import {
    mapProductDetails,
    mapRelatedProducts,
} from "@/components/(customer-pages)/shop-details/types";
import { myFetch } from "../../../../../helpers/myFetch";

export default async function ShopDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    let productRes = await myFetch(`/products/slug/${id}`, {
        cache: "force-cache",
        next: { revalidate: 3600, tags: ["products"] },
    });

    // Fallback to fetch by direct product ID if slug is not found
    if (!productRes?.data) {
        productRes = await myFetch(`/products/${id}`, {
            cache: "force-cache",
            next: { revalidate: 3600, tags: ["products"] },
        });
    }

    const product = mapProductDetails(productRes?.data);
    if (!product) notFound();

    const relatedRes = await myFetch(`/products/${product.id}/related`, {
        cache: "force-cache",
        next: { revalidate: 3600, tags: ["products"] },
    });

    return (
        <ShopDetails
            product={product}
            relatedProducts={mapRelatedProducts(relatedRes?.data)}
        />
    );
}
