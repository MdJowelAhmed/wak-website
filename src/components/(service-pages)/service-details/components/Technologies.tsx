import { getTranslations } from "next-intl/server";

export default async function Technologies({ technologies }: { technologies: string[] }) {
    if (technologies.length === 0) return null;
    const t = await getTranslations("ServiceDetails");

    return (
        <section className="rounded-2xl border border-white/10 bg-secondary p-5 shadow-lg sm:p-6">
            <h2 className="mb-4 text-lg font-bold text-white">{t("technologies")}</h2>
            <div className="flex flex-wrap gap-2">
                {technologies.map((tech) => (
                    <span
                        key={tech}
                        className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-sm font-medium text-white"
                    >
                        {tech}
                    </span>
                ))}
            </div>
        </section>
    );
}
