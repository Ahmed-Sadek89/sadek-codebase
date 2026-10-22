import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { NotFoundPage } from "../../components/not-found";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  return {
    title: t("metaNotFoundTitle"),
    description: t("metaNotFoundDescription"),
  };
}

// Unknown URLs, and notFound() from page.tsx when there is no portfolio to show.
export default function NotFound() {
  return <NotFoundPage />;
}
