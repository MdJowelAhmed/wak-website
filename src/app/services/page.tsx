import Services from "@/components/(service-pages)/services";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Services",
    description: "Wakanda - Find the best services at affordable prices",
};

const ServicesPage = () => {
    return (
        <div>
            <Services />
        </div>
    );
};

export default ServicesPage;