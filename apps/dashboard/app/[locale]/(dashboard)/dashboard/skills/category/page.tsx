import { Suspense } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { dehydrate, getQueryClient, HydrationBoundary } from "@repo/libs/query";
import { categorySkillsService } from "@repo/services/category-skills";
import { queryKeys } from "@repo/utils/query-keys";
import { auth } from "../../../../../../libs/auth";
import CategorySkillsPage from "../../../../../../components/category-skills";
import { TableContentSkeleton } from "../../../../../../components/ui/skeleton/table-content-skeleton";
import { CATEGORY_SKILLS_QUERY } from "../../../../../../components/category-skills/utils/constants";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  return {
    title: t("metaCategorySkillsTitle"),
    description: t("metaCategorySkillsDescription"),
  };
}

export default async function Page() {
  const queryClient = getQueryClient();
  const accessToken = (await auth())?.accessToken;

  if (accessToken) {
    await queryClient.query({
      queryKey: queryKeys.categorySkills.list(CATEGORY_SKILLS_QUERY),
      queryFn: () =>
        categorySkillsService.findAll(CATEGORY_SKILLS_QUERY, { accessToken }),
    });
  }

  return (
    <Suspense fallback={<TableContentSkeleton />}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <CategorySkillsPage />
      </HydrationBoundary>
    </Suspense>
  );
}
