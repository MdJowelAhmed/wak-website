'use client';
import { useEffect, useState } from 'react';
import About from "./components/About";
import Contact from "./components/Contact";
import Header from "./components/Header";
import Pricing from "./components/Pricing";
import Services from "./components/Services";
import Technologies from "./components/Technologies";
import WhyChooseUs from "./components/WhyChooseUs";
import { myFetch } from '../../../../helpers/myFetch';

const ServiceDetails = ({ slug }: { slug: string }) => {
    const [service, setService] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!slug) return;
        const fetchService = async () => {
            try {
                const res = await myFetch(`/services/slug/${slug}`);
                if (res?.data) {
                    setService(res.data);
                }
            } catch (error) {
                console.error("Failed to fetch service details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchService();
    }, [slug]);

    if (loading) {
        return <div className="py-20 text-center text-[#FFDDA5]">Loading service details...</div>;
    }

    if (!service) {
        return <div className="py-20 text-center text-white">Service not found.</div>;
    }

    return (
        <div className=" container">

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8  mx-auto px-4 py-12">
                <div className="lg:col-span-2 space-y-8">
                    <Header service={service} />
                    <About description={service.description} />
                    {service.serviceIncludes && service.serviceIncludes.length > 0 && <Services serviceIncludes={service.serviceIncludes} />}
                    {service.technologies && service.technologies.length > 0 && <Technologies technologies={service.technologies} />}
                    <WhyChooseUs />

                </div>
                <div className="lg:col-span-1">
                    <Pricing service={service} />
                </div>
            </div>

            <Contact creatorName={service.creator?.name} />
        </div>
    );
};

export default ServiceDetails;