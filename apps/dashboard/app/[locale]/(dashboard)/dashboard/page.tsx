import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Dashboard from "../../../../components/dashboard";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  return {
    title: t("metaDashboardTitle"),
    description: t("metaDashboardDescription"),
  };
}

export default function DashboardPage() {
  return <Dashboard />;
}
