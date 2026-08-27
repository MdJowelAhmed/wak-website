import Shop from "@/components/(customer-pages)/shop";

export default function ShopPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
    return <Shop searchParams={searchParams} />;
}