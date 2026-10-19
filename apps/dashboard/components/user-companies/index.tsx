import { useTranslations } from "next-intl";

export default function UserCompaniesPage() {
  const t = useTranslations();

  return (
    <main>
      <h1 className="text-2xl font-semibold">{t("userCompaniesTitle")}</h1>
    </main>
  );
}
