import { Suspense } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { dehydrate, getQueryClient, HydrationBoundary } from "@repo/libs/query";
import { seoService } from "@repo/services/seo";
import { queryKeys } from "@repo/utils/query-keys";
import { auth } from "../../../../../libs/auth";
import SeoPage from "../../../../../components/seo";
import { TableContentSkeleton } from "../../../../../components/ui/skeleton/table-content-skeleton";
import { getSeoListQuery } from "../../../../../components/seo/utils/constants";
import { recordParamReader } from "../../../../../utils/list-query";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  return {
    title: t("metaSeoTitle"),
    description: t("metaSeoDescription"),
  };
}

export default async function Page({
  searchParams,
}: PageProps<"/[locale]/dashboard/seo">) {
  // ?search=&page=&limit=&order=&isActive=&pageName= (any combination). The client builds the same
  // query from useSearchParams, so the prefetch key matches.
  const query = getSeoListQuery(recordParamReader(await searchParams));
  const queryClient = getQueryClient();
  const accessToken = (await auth())?.accessToken;

  if (accessToken) {
    await queryClient.query({
      queryKey: queryKeys.seo.list(query),
      queryFn: () => seoService.findAll(query, { accessToken }),
    });
  }

  return (
    <Suspense fallback={<TableContentSkeleton />}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <SeoPage />
      </HydrationBoundary>
    </Suspense>
  );
}
