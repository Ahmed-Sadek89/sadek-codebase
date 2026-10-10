import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import LoginPage from "../../../components/login";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  return {
    title: t("metaLoginTitle"),
    description: t("metaLoginDescription"),
  };
}

export default function Page() {
  return <LoginPage />;
}
