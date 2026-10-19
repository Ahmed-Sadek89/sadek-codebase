import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import UserCompaniesPage from "../../../../../../components/user-companies";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  return {
    title: t("metaUserCompaniesTitle"),
    description: t("metaUserCompaniesDescription"),
  };
}

export default function Page() {
  return <UserCompaniesPage />;
}
