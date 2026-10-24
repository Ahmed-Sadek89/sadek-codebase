import { Suspense } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { dehydrate, getQueryClient, HydrationBoundary } from "@repo/libs/query";
import { pagesService } from "@repo/services/pages";
import { queryKeys } from "@repo/utils/query-keys";
import { auth } from "../../../../../libs/auth";
import PagesPage from "../../../../../components/pages";
import { TableContentSkeleton } from "../../../../../components/ui/skeleton/table-content-skeleton";
import { getPagesQuery } from "../../../../../components/pages/utils/constants";
import {
  readListQueryParams,
  recordParamReader,
} from "../../../../../utils/list-query";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  return {
    title: t("metaPagesTitle"),
    description: t("metaPagesDescription"),
  };
}

export default async function Page({
  searchParams,
}: PageProps<"/[locale]/dashboard/pages">) {
  // ?search=&page=&limit=&order= (any combination). The client builds the same query
  // from useSearchParams, so the prefetch key matches.
  const query = getPagesQuery(readListQueryParams(recordParamReader(await searchParams)));
  const queryClient = getQueryClient();
  const accessToken = (await auth())?.accessToken;

  if (accessToken) {
    await queryClient.query({
      queryKey: queryKeys.pages.list(query),
      queryFn: () => pagesService.findAll(query, { accessToken }),
    });
  }

  return (
    <Suspense fallback={<TableContentSkeleton />}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <PagesPage />
      </HydrationBoundary>
    </Suspense>
  );
}
