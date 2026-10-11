import { Suspense } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { dehydrate, getQueryClient, HydrationBoundary } from "@repo/libs/query";
import { projectsService } from "@repo/services/projects";
import { queryKeys } from "@repo/utils/query-keys";
import { auth } from "../../../../../libs/auth";
import ProjectsPage from "../../../../../components/projects";
import { TableContentSkeleton } from "../../../../../components/ui/skeleton/table-content-skeleton";
import { getProjectsQuery } from "../../../../../components/projects/utils/constants";
import { recordParamReader } from "../../../../../utils/list-query";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  return {
    title: t("metaProjectsTitle"),
    description: t("metaProjectsDescription"),
  };
}

export default async function Page({
  searchParams,
}: PageProps<"/[locale]/dashboard/projects">) {
  // ?search=&page=&limit=&order=&isActive=&categoryId= (any combination). The client
  // builds the same query from useSearchParams, so the prefetch key matches.
  const query = getProjectsQuery(recordParamReader(await searchParams));
  const queryClient = getQueryClient();
  const accessToken = (await auth())?.accessToken;

  if (accessToken) {
    await queryClient.query({
      queryKey: queryKeys.projects.list(query),
      queryFn: () => projectsService.findAll(query, { accessToken }),
    });
  }

  return (
    <Suspense fallback={<TableContentSkeleton />}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ProjectsPage />
      </HydrationBoundary>
    </Suspense>
  );
}
