import { Suspense } from 'react';
import Banner from "./components/Banner";
import ServicesList from "./components/ServiceList";

const Services = () => {
    return (
        <main className="w-full">
            {/* <Banner />  */}
            <Suspense fallback={
                <div className="py-10 text-center text-zinc-500 font-medium">
                    Loading services...
                </div>
            }>
                <ServicesList />
            </Suspense>
        </main>
    );
};

export default Services;