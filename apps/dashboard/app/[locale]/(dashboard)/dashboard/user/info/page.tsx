import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import UserInfoPage from "../../../../../../components/user-info";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  return {
    title: t("metaUserInfoTitle"),
    description: t("metaUserInfoDescription"),
  };
}

export default function Page() {
  return <UserInfoPage />;
}
