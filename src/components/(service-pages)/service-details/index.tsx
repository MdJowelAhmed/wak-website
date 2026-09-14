import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Header from "./components/Header";
import About from "./components/About";
import Services from "./components/Services";
import Technologies from "./components/Technologies";
import WhyChooseUs from "./components/WhyChooseUs";
import Pricing from "./components/Pricing";
import type { ServiceDetailsData } from "./types";

export default async function ServiceDetails({ service }: { service: ServiceDetailsData }) {
    const t = await getTranslations("ServiceDetails");

    return (
        <div className="px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
            <div className="container mx-auto max-w-7xl">
                <header className="mb-8">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/80">
                        <Link href="/services" className="hover:text-white">
                            {t("services")}
                        </Link>
                        <span className="mx-2 text-white/40">/</span>
                        {service.categoryName}
                    </p>
                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        {service.name}
                    </h1>
                </header>

                <div className="flex flex-col gap-8 lg:flex-row">
                    <div className="min-w-0 flex-1 space-y-6">
                        <Header service={service} />
                        <About description={service.description} />
                        <Services serviceIncludes={service.includes} />
                        <Technologies technologies={service.technologies} />
                        <WhyChooseUs />
                    </div>
                    <Pricing service={service} />
                </div>
            </div>
        </div>
    );
}
