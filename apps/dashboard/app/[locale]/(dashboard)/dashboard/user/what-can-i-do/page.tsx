import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import WhatCanIDoPage from "../../../../../../components/what-can-i-do";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  return {
    title: t("metaWhatCanIDoTitle"),
    description: t("metaWhatCanIDoDescription"),
  };
}

export default function Page() {
  return <WhatCanIDoPage />;
}
