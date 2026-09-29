import { getTranslations } from "next-intl/server";
import NotFoundView from "@/components/NotFound/NotFoundView";

export default async function NotFound() {
  const t = await getTranslations("NotFound");

  return (
    <NotFoundView
      title={t("title")}
      description={t("description")}
      backHomeText={t("backHome")}
    />
  );
}
