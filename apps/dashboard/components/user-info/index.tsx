import { useTranslations } from "next-intl";

export default function UserInfoPage() {
  const t = useTranslations();

  return (
    <main>
      <h1 className="text-2xl font-semibold">{t("userInfoTitle")}</h1>
    </main>
  );
}
