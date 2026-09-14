import ServicesList, { type ServiceCategory, type ServiceItem } from "./components/ServiceList";

export interface PaginationData {
    total: number;
    page: number;
    limit: number;
    totalPage: number;
}

interface ServicesProps {
    services: ServiceItem[];
    pagination?: PaginationData;
    categoriesList: ServiceCategory[];
    searchParams?: { [key: string]: string | string[] | undefined };
}

const Services = ({ services, pagination, categoriesList, searchParams }: ServicesProps) => {
    return (
        <main className="w-full">
            <ServicesList
                services={services}
                pagination={pagination}
                categoriesList={categoriesList}
                searchParams={searchParams}
            />
        </main>
    );
};

export default Services;