import { getTranslations } from "next-intl/server";
import { publicFetch } from "../../../../../helpers/publicFetch";
import { sanitizeHtml } from "../../../../../helpers/sanitizeHtml";

export const revalidate = 3600;

const PrivacyPolicyPage = async () => {
    const t = await getTranslations("Legal");
    const res = await publicFetch<{ content?: string }>("/disclaimers/privacy-policy", {
        next: { revalidate: 3600, tags: ["disclaimers"] },
    });
    const html = typeof res?.data?.content === "string" ? res.data.content : "";
    const content = sanitizeHtml(html) || t("privacyFallback");

    return (
        <div className="container mx-auto py-[50px]">
            <div className="bg-white/20 backdrop-blur-md rounded-lg p-3 ps-6 mb-6 ">
                <h1 className="text-2xl text-white ">{t("privacyTitle")}</h1>
            </div>
            <div className="space-y-6 text-white/80 leading-relaxed border border-white/20 p-4 rounded-lg">
                <div dangerouslySetInnerHTML={{ __html: content }} />
            </div>
        </div>
    )
}

export default PrivacyPolicyPage
