import { getTranslations } from "next-intl/server";
import { myFetch } from "../../../../helpers/myFetch";
import { sanitizeHtml } from "../../../../helpers/sanitizeHtml";

async function AboutUsPage() {
    const t = await getTranslations("Legal");
    const res = await myFetch("/disclaimers/about-us", {
        next: { revalidate: 3600, tags: ["disclaimers"] },
    });
    const html = typeof res?.data?.content === "string" ? res.data.content : "";
    const content = sanitizeHtml(html) || t("aboutFallback");

    return (
        <div className="container mx-auto py-[50px]">
            <div className="bg-white/30  backdrop-blur-md rounded-lg p-3 ps-6 mb-6 ">
                <h1 className="text-2xl text-white ">{t("aboutTitle")}</h1>
            </div>

            <div className="space-y-6 text-white/80 leading-relaxed border border-white/20 p-4 rounded-lg">
                <div dangerouslySetInnerHTML={{ __html: content }} />
            </div>
        </div>

    )
}

export default AboutUsPage
