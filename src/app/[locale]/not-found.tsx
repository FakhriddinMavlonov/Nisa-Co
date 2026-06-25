import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("notFound");
  const tCommon = await getTranslations("common");
  const locale = await getLocale();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <h1 className="font-serif text-6xl font-bold text-brand-600 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">{t("title")}</h2>
      <p className="text-gray-500 mb-8">{t("description")}</p>
      <Link
        href="/"
        locale={locale}
        className="px-8 py-3 bg-brand-600 text-white rounded-full font-semibold hover:bg-brand-700 transition-colors"
      >
        {tCommon("backToHome")}
      </Link>
    </div>
  );
}
