import { useTranslations } from "next-intl";

export default function WhatCanIDoPage() {
  const t = useTranslations();

  return (
    <main>
      <h1 className="text-2xl font-semibold">{t("whatCanIDoTitle")}</h1>
    </main>
  );
}
