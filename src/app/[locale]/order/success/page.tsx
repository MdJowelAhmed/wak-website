import { getTranslations } from "next-intl/server";
import PaymentStatusPage from "@/components/(customer-pages)/payment/PaymentStatusPage";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "OrderSuccess" });
    return { title: t("title") };
}

export default function OrderSuccessPage() {
    return <PaymentStatusPage status="success" />;
}
