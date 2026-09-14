import { Check } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function Services({ serviceIncludes }: { serviceIncludes: string[] }) {
    if (serviceIncludes.length === 0) return null;
    const t = await getTranslations("ServiceDetails");

    return (
        <section className="rounded-2xl border border-white/10 bg-secondary p-5 shadow-lg sm:p-6">
            <h2 className="mb-4 text-lg font-bold text-white">{t("included")}</h2>
            <ul className="grid gap-2.5 sm:grid-cols-2">
                {serviceIncludes.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-white/85">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                            <Check className="h-3.5 w-3.5" />
                        </span>
                        <span>{item}</span>
                    </li>
                ))}
            </ul>
        </section>
    );
}
