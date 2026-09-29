import { getTranslations } from "next-intl/server";
import NotFoundView from "@/components/NotFound/NotFoundView";

export default async function NotFound() {
  const [tNotFound, tNav] = await Promise.all([
    getTranslations("NotFound"),
    getTranslations("Navigation").catch(() => null),
  ]);

  return (
    <NotFoundView
      title={tNotFound("title")}
      description={tNotFound("description")}
      backHomeText={tNotFound("backHome")}
      loginText={tNav?.has("login") ? tNav("login") : "Go to Login"}
      supportText={tNav?.has("contact") ? tNav("contact") : "Go to Support"}
    />
  );
}
