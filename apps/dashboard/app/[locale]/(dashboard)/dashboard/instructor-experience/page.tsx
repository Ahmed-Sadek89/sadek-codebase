import { Suspense } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { dehydrate, getQueryClient, HydrationBoundary } from "@repo/libs/query";
import { instructorExperienceService } from "@repo/services/instructor-experience";
import { queryKeys } from "@repo/utils/query-keys";
import { auth } from "../../../../../libs/auth";
import InstructorExperiencePage from "../../../../../components/instructor-experience";
import { TableContentSkeleton } from "../../../../../components/ui/skeleton/table-content-skeleton";
import { getInstructorExperiencesQuery } from "../../../../../components/instructor-experience/utils/constants";
import { recordParamReader } from "../../../../../utils/list-query";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  return {
    title: t("metaInstructorExperienceTitle"),
    description: t("metaInstructorExperienceDescription"),
  };
}

export default async function Page({
  searchParams,
}: PageProps<"/[locale]/dashboard/instructor-experience">) {
  // ?search=&page=&limit=&order=&isActive=&skillId= (any combination). The client
  // builds the same query from useSearchParams, so the prefetch key matches.
  const query = getInstructorExperiencesQuery(recordParamReader(await searchParams));
  const queryClient = getQueryClient();
  const accessToken = (await auth())?.accessToken;

  if (accessToken) {
    await queryClient.query({
      queryKey: queryKeys.instructorExperience.list(query),
      queryFn: () => instructorExperienceService.findAll(query, { accessToken }),
    });
  }

  return (
    <Suspense fallback={<TableContentSkeleton />}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <InstructorExperiencePage />
      </HydrationBoundary>
    </Suspense>
  );
}
