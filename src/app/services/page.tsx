import Services from "@/components/(service-pages)/services";
import { Metadata } from "next";
import { nextFetch } from "../../../helpers/myFetch";
import { getActiveCategories } from "../../../helpers/categoryService";

export const metadata: Metadata = {
    title: "Services",
    description: "Wakanda - Find the best services at affordable prices",
};

interface ServicesPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }> | { [key: string]: string | string[] | undefined };
}

export default async function ServicesPage({ searchParams }: ServicesPageProps) {
    const resolvedSearchParams = await searchParams;

    const categoriesRes = await getActiveCategories({ type: 'service' });
    const categoriesList = categoriesRes?.data || [];

    const params = new URLSearchParams();

    if (resolvedSearchParams?.category) {
        const categoryVal = String(resolvedSearchParams.category);
        const matchedCategory = categoriesList.find(
            (c) => c.slug === categoryVal || c._id === categoryVal || c.name.toLowerCase() === categoryVal.toLowerCase()
        );
        const finalCategoryParam = matchedCategory?.slug || matchedCategory?.name || matchedCategory?._id || categoryVal;
        params.append("category", finalCategoryParam);
    }
    if (resolvedSearchParams?.search) {
        params.append("search", String(resolvedSearchParams.search));
    }

    const page = resolvedSearchParams?.page ? String(resolvedSearchParams.page) : "1";
    params.append("page", page);
    params.append("limit", "12");

    const queryString = params.toString() ? `?${params.toString()}` : "";
    const servicesRes = await nextFetch<any[]>(`/services${queryString}`, {
        cache: 'force-cache',
        next: { revalidate: 3600, tags: ['services'] },
    });

    const services = servicesRes?.data || [];
    const pagination = servicesRes?.pagination || {
        total: services.length,
        page: Number(page),
        limit: 12,
        totalPage: 1,
    };

    return (
        <Services
            services={services}
            categoriesList={categoriesList}
            pagination={pagination}
            searchParams={resolvedSearchParams || {}}
        />
    );
}