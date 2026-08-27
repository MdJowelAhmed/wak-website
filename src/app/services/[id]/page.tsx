import ServiceDetails from "@/components/(service-pages)/service-details";

export default async function ServiceDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return (
        <div>
            <ServiceDetails slug={id} />
        </div>
    );
}