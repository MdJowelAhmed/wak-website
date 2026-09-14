import { getTranslations } from "next-intl/server";
import { myFetch } from "../../../../helpers/myFetch";

const TermsOfServicesPage = async () => {
    const t = await getTranslations("Legal");
    const res = await myFetch("/disclaimers/terms-and-conditions", { cache: "no-store" });
    const content = res?.data?.content || t("termsFallback");

    return (
        <div className="container mx-auto py-[50px]">
            <div className="bg-white/20 backdrop-blur-md rounded-lg p-3 ps-6 mb-6 ">
                <h1 className="text-2xl text-white">{t("termsTitle")}</h1>
            </div>
            <div className="space-y-6 text-white/80 leading-relaxed border border-white/20 p-4 rounded-lg">
                <div dangerouslySetInnerHTML={{ __html: content }} />
            </div>
        </div>
    )
}

export default TermsOfServicesPage
