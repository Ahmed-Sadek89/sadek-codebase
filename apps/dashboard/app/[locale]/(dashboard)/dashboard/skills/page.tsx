import { Suspense } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { dehydrate, getQueryClient, HydrationBoundary } from "@repo/libs/query";
import { skillsService } from "@repo/services/skills";
import { queryKeys } from "@repo/utils/query-keys";
import { auth } from "../../../../../libs/auth";
import SkillsPage from "../../../../../components/skills";
import { TableContentSkeleton } from "../../../../../components/ui/skeleton/table-content-skeleton";
import { getSkillsQuery } from "../../../../../components/skills/utils/constants";
import { recordParamReader } from "../../../../../utils/list-query";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  return {
    title: t("metaSkillsTitle"),
    description: t("metaSkillsDescription"),
  };
}

export default async function Page({
  searchParams,
}: PageProps<"/[locale]/dashboard/skills">) {
  // ?search=&page=&limit=&order=&isActive=&categoryId= (any combination). The client
  // builds the same query from useSearchParams, so the prefetch key matches.
  const query = getSkillsQuery(recordParamReader(await searchParams));
  const queryClient = getQueryClient();
  const accessToken = (await auth())?.accessToken;

  if (accessToken) {
    await queryClient.query({
      queryKey: queryKeys.skills.list(query),
      queryFn: () => skillsService.findAll(query, { accessToken }),
    });
  }

  return (
    <Suspense fallback={<TableContentSkeleton />}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <SkillsPage />
      </HydrationBoundary>
    </Suspense>
  );
}
