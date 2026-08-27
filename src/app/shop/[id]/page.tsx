import ShopDetails from "@/components/(customer-pages)/shop-details";

export default async function ShopDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <ShopDetails slug={id} />;
}
