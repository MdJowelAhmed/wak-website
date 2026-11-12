import Services from "@/components/(service-pages)/services";
import { type ServiceItem } from "@/components/(service-pages)/services/components/ServiceList";
import { Metadata } from "next";
import { nextFetch } from "../../../../helpers/myFetch";
import { findCategory, getActiveCategories } from "../../../../helpers/categoryService";

export const metadata: Metadata = {
    title: "Services",
    description: "Wakanda - Find the best services at affordable prices",
};

type SearchParams = { [key: string]: string | string[] | undefined };

interface ServicesPageProps {
    searchParams: Promise<SearchParams>;
}

const PAGE_SIZE = 12;

function fetchServices(searchParams: SearchParams, page: string, category?: string) {
    const params = new URLSearchParams();
    if (category) params.append("category", category);
    if (searchParams.search) params.append("search", String(searchParams.search));
    params.append("page", page);
    params.append("limit", String(PAGE_SIZE));

    return nextFetch<ServiceItem[]>(`/services?${params.toString()}`, {
        cache: 'force-cache',
        next: { revalidate: 3600, tags: ['services'] },
        debug: true,
    });
}

export default async function ServicesPage({ searchParams }: ServicesPageProps) {
    const resolvedSearchParams = await searchParams;
    const page = resolvedSearchParams.page ? String(resolvedSearchParams.page) : "1";
    const categoryValue = resolvedSearchParams.category ? String(resolvedSearchParams.category) : undefined;

    const categoriesPromise = getActiveCategories({ type: 'service' });
    // The category filter needs the matched category, so only that case waits for categories.
    const servicesPromise = categoryValue
        ? categoriesPromise.then((res) => {
              const matched = findCategory(res?.data || [], categoryValue);
              return fetchServices(resolvedSearchParams, page, matched?.slug || matched?.name || matched?._id || categoryValue);
          })
        : fetchServices(resolvedSearchParams, page);

    const [categoriesRes, servicesRes] = await Promise.all([categoriesPromise, servicesPromise]);

    const services = servicesRes?.data || [];
    const pagination = servicesRes?.pagination || {
        total: services.length,
        page: Number(page),
        limit: PAGE_SIZE,
        totalPage: 1,
    };

    return (
        <Services
            services={services}
            categoriesList={categoriesRes?.data || []}
            pagination={pagination}
            searchParams={resolvedSearchParams}
        />
    );
}
