import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import NotFoundPage from "../../components/ui/streams/not-found";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  return {
    title: t("metaNotFoundTitle"),
    description: t("metaNotFoundDescription"),
  };
}

export default function NotFound() {
  return <NotFoundPage />;
}
