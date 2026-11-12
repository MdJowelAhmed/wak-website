import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import ServiceDetails from "@/components/(service-pages)/service-details";
import { mapServiceDetails } from "@/components/(service-pages)/service-details/types";
import { myFetch } from "../../../../../helpers/myFetch";

type ServiceDetailsPageProps = {
    params: Promise<{ id: string }>;
};

const META_DESCRIPTION_LENGTH = 160;

const getService = cache(async (id: string) => {
    const res = await myFetch(`/services/slug/${encodeURIComponent(id)}`, {
        cache: "force-cache",
        next: { revalidate: 3600, tags: ["services"] },
    });
    return mapServiceDetails(res?.data);
});

export async function generateMetadata({ params }: ServiceDetailsPageProps): Promise<Metadata> {
    const { id } = await params;
    const service = await getService(id);
    if (!service) return {};

    const description = service.description.replace(/\s+/g, " ").trim().slice(0, META_DESCRIPTION_LENGTH);

    return {
        title: service.name,
        description: description || undefined,
        openGraph: {
            title: service.name,
            description: description || undefined,
            images: service.image.startsWith("http") ? [service.image] : undefined,
        },
    };
}

export default async function ServiceDetailsPage({ params }: ServiceDetailsPageProps) {
    const { id } = await params;
    const service = await getService(id);
    if (!service) notFound();

    return <ServiceDetails service={service} />;
}
