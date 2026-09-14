import { getTranslations } from "next-intl/server";

const REASON_KEYS = ["reasonQuality", "reasonSatisfaction", "reasonSupport", "reasonAftercare"] as const;

export default async function WhyChooseUs() {
    const t = await getTranslations("ServiceDetails");

    return (
        <section className="rounded-2xl border border-white/10 bg-secondary p-5 shadow-lg sm:p-6">
            <h2 className="mb-4 text-lg font-bold text-white">{t("whyChoose")}</h2>
            <ul className="space-y-2.5">
                {REASON_KEYS.map((key) => (
                    <li key={key} className="flex items-start gap-3 text-sm text-white/85">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        <span>{t(key)}</span>
                    </li>
                ))}
            </ul>
        </section>
    );
}
