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
  experienceQuery,
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
            order: "ASC"
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
    // The Experience timeline is an infinite list: prefetch its first page only.
    queryClient
      .infiniteQuery({
        queryKey: queryKeys.userCompany.publicInfinite(experienceQuery),
        queryFn: ({ pageParam }: { pageParam: number }) =>
          userCompanyService.findAllPublic({
            ...experienceQuery,
            page: pageParam,
          }),
        initialPageParam: 1,
        getNextPageParam,
      })
      .catch(() => {}),
    // Work's categories and projects are infinite lists: first page only.
    queryClient
      .infiniteQuery({
        queryKey: queryKeys.categoryProjects.publicList(categoryProjectsQuery),
        queryFn: ({ pageParam }: { pageParam: number }) =>
          categoryProjectsService.findAllPublic({
            ...categoryProjectsQuery,
            page: pageParam,
          }),
        initialPageParam: 1,
        getNextPageParam,
      })
      .catch(() => {}),
    queryClient
      .infiniteQuery({
        queryKey: queryKeys.projects.publicList(projectsQuery),
        queryFn: ({ pageParam }: { pageParam: number }) =>
          projectsService.findAllPublic({ ...projectsQuery, page: pageParam }),
        initialPageParam: 1,
        getNextPageParam,
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
