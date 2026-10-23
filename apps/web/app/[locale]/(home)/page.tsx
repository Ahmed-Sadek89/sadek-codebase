import type { Metadata } from "next";
import { dehydrate, getQueryClient, HydrationBoundary } from "@repo/libs/query";
import {
  categoryProjectsService,
  categorySkillsService,
  projectsService,
  userCompanyService,
  whatCanDoService,
} from "@repo/services";
import { getNextPageParam } from "@repo/utils/pagination";
import { queryKeys } from "@repo/utils/query-keys";
import { HomePage } from "../../../components/homepage";
import {
  categoryProjectsQuery,
  categorySkillsQuery,
  projectsQuery,
  userCompanyQuery,
  whatCanDoQuery,
} from "../../../components/homepage/utils";
import {
  getPublicUserInfo,
  getUserInfoMetadata,
} from "../../../utils/user-info";
import { Suspense } from "react";
import { HomePageSkeleton } from "../../../components/loading";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  return (await getUserInfoMetadata(locale)) ?? {};
}

export default async function Page() {
  const queryClient = getQueryClient();
  await Promise.all([
    queryClient
      .query({
        queryKey: queryKeys.userInfo.public(),
        queryFn: getPublicUserInfo,
      })
      .catch(() => {}),
    // Services is an infinite list: prefetch its first page only.
    queryClient
      .infiniteQuery({
        queryKey: queryKeys.whatCanDo.publicInfinite(whatCanDoQuery),
        queryFn: ({ pageParam }: { pageParam: number }) =>
          whatCanDoService.findAllPublic({
            ...whatCanDoQuery,
            page: pageParam,
          }),
        initialPageParam: 1,
        getNextPageParam,
      })
      .catch(() => {}),
    // Skill categories are an infinite list: prefetch the first page only.
    queryClient
      .infiniteQuery({
        queryKey: queryKeys.categorySkills.publicInfinite(categorySkillsQuery),
        queryFn: ({ pageParam }: { pageParam: number }) =>
          categorySkillsService.findAllPublic({
            ...categorySkillsQuery,
            page: pageParam,
          }),
        initialPageParam: 1,
        getNextPageParam,
      })
      .catch(() => {}),
    queryClient
      .query({
        queryKey: queryKeys.userCompany.publicList(userCompanyQuery),
        queryFn: () => userCompanyService.findAllPublic(userCompanyQuery),
      })
      .catch(() => {}),
    queryClient
      .query({
        queryKey: queryKeys.categoryProjects.publicList(categoryProjectsQuery),
        queryFn: () =>
          categoryProjectsService.findAllPublic(categoryProjectsQuery),
      })
      .catch(() => {}),
    queryClient
      .query({
        queryKey: queryKeys.projects.publicList(projectsQuery),
        queryFn: () => projectsService.findAllPublic(projectsQuery),
      })
      .catch(() => {}),
  ]);

  return (
    <Suspense fallback={<HomePageSkeleton />}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <HomePage />
      </HydrationBoundary>
    </Suspense>
  );
}
