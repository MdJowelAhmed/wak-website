import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function ServiceBanner() {
    const t = await getTranslations("Services");

    return (
        <section className="relative w-full h-screen max-h-[600px] md:max-h-[400px] overflow-hidden">
            <Image
                src="https://i.pinimg.com/736x/42/79/fa/4279fa603e2d62b665b8951fc0e02ec0.jpg"
                alt={t("bannerAlt")}
                fill
                className="object-cover"
                priority
            />

            <div className="absolute inset-0 bg-black/50"></div>

            <div className="relative h-full flex flex-col justify-center container mx-auto px-4 py-16 md:py-24">
                <div className="mb-1 md:mb-1">
                    <p className="text-sm md:text-base font-medium text-gray-300 flex items-center gap-2">
                        <Link href="/" className="text-white hover:underline">
                            {t("home")}
                        </Link>
                        <span className="text-gray-500">/</span>
                        <span className="text-primary">{t("services")}</span>
                    </p>
                </div>

                <div className="max-w-lg">
                    <h1 className="text-4xl md:text-5xl lg:text-5xl font-medium leading-tight mb-3">
                        <span className="text-white">{t("bannerTitleBefore")} <br /> </span>
                        <span className="text-primary">{t("bannerTitleAccent")}</span>
                        <span className="text-white"> {t("bannerTitleAfter")}</span>
                    </h1>

                    <p className="text-base text-white/90 leading-relaxed">
                        {t("bannerDescription")}
                    </p>
                </div>
            </div>
        </section>
    );
}
