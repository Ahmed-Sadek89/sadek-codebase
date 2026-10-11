import { Suspense } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { dehydrate, getQueryClient, HydrationBoundary } from "@repo/libs/query";
import { categoryProjectsService } from "@repo/services/category-projects";
import { queryKeys } from "@repo/utils/query-keys";
import { auth } from "../../../../../../libs/auth";
import CategoryProjectsPage from "../../../../../../components/category-projects";
import { TableContentSkeleton } from "../../../../../../components/ui/skeleton/table-content-skeleton";
import { getCategoryProjectsQuery } from "../../../../../../components/category-projects/utils/constants";
import {
  readListQueryParams,
  recordParamReader,
} from "../../../../../../utils/list-query";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  return {
    title: t("metaCategoryProjectsTitle"),
    description: t("metaCategoryProjectsDescription"),
  };
}

export default async function Page({
  searchParams,
}: PageProps<"/[locale]/dashboard/projects/category">) {
  // ?search=&page=&limit=&order=&isActive= (any combination). The client builds the same
  // query from useSearchParams, so the prefetch key matches.
  const query = getCategoryProjectsQuery(
    readListQueryParams(recordParamReader(await searchParams)),
  );
  const queryClient = getQueryClient();
  const accessToken = (await auth())?.accessToken;

  if (accessToken) {
    await queryClient.query({
      queryKey: queryKeys.categoryProjects.list(query),
      queryFn: () => categoryProjectsService.findAll(query, { accessToken }),
    });
  }

  return (
    <Suspense fallback={<TableContentSkeleton />}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <CategoryProjectsPage />
      </HydrationBoundary>
    </Suspense>
  );
}
