import { notFound } from "next/navigation";
import ServiceDetails from "@/components/(service-pages)/service-details";
import { mapServiceDetails } from "@/components/(service-pages)/service-details/types";
import { myFetch } from "../../../../../helpers/myFetch";

export default async function ServiceDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const res = await myFetch(`/services/slug/${id}`, {
        cache: "force-cache",
        next: { revalidate: 3600, tags: ["services"] },
    });

    const service = mapServiceDetails(res?.data);
    if (!service) notFound();

    return <ServiceDetails service={service} />;
}
