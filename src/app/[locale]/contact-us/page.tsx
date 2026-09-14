import { Clock, Mail, Phone } from "lucide-react";
import { getTranslations } from "next-intl/server";
import ContactUsForm from "@/shared/ContactUsForm";

const PHONE = "+8801611112222";
const EMAIL = "support@gmail.com";

export default async function ContactUsPage() {
    const t = await getTranslations("Contact");

    const contactMethods = [
        {
            id: "call",
            icon: Phone,
            title: t("callUs"),
            description: t("callDescription"),
            href: `tel:${PHONE}`,
            label: PHONE,
        },
        {
            id: "write",
            icon: Mail,
            title: t("emailUs"),
            description: t("emailDescription"),
            href: `mailto:${EMAIL}`,
            label: EMAIL,
        },
    ] as const;

    return (
        <div className="min-h-[70vh] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
            <div className="container mx-auto max-w-6xl">
                <header className="mb-8 max-w-2xl md:mb-10">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/80">
                        {t("support")}
                    </p>
                    <h1 className="mb-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        {t("title")}
                    </h1>
                    <p className="text-sm leading-relaxed text-white/85 sm:text-base">
                        {t("intro")}
                    </p>
                </header>

                <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12 lg:gap-8">
                    <aside className="flex flex-col justify-between rounded-2xl border border-white/10 bg-secondary p-6 shadow-lg sm:p-8 lg:col-span-4">
                        <div>
                            <h2 className="mb-6 text-lg font-bold text-white">{t("details")}</h2>
                            <ul className="space-y-6">
                                {contactMethods.map((item, index) => (
                                    <li key={item.id}>
                                        {index > 0 && (
                                            <div className="mb-6 border-t border-white/10" />
                                        )}
                                        <div className="flex items-start gap-4">
                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-white">
                                                <item.icon className="h-5 w-5" aria-hidden />
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="text-base font-semibold text-white">
                                                    {item.title}
                                                </h3>
                                                <p className="mt-1 text-sm leading-relaxed text-white/70">
                                                    {item.description}
                                                </p>
                                                <a
                                                    href={item.href}
                                                    className="mt-2 inline-block text-sm font-semibold text-white underline-offset-4 hover:underline"
                                                >
                                                    {item.label}
                                                </a>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="mt-8 flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white/80">
                            <Clock className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                            <span>{t("liveSupport")}</span>
                        </div>
                    </aside>

                    <div className="lg:col-span-8">
                        <ContactUsForm />
                    </div>
                </div>
            </div>
        </div>
    );
}
