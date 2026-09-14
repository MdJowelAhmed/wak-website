import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("NotFound");

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center">
      <h1 className="mb-4 text-6xl">{t("title")}</h1>
      <p className="mb-8 text-gray-400">{t("description")}</p>
      <Link
        href="/"
        className="rounded border-2 border-orange-500 px-6 py-3 text-orange-500 transition-colors hover:bg-orange-500 hover:text-white"
      >
        {t("backHome")}
      </Link>
    </div>
  );
}
