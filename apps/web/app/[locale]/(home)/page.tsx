import type { Metadata } from "next";
import { dehydrate, getQueryClient, HydrationBoundary } from "@repo/libs/query";
import {
  categoryProjectsService, categorySkillsService, projectsService, skillsService, userCompanyService, whatCanDoService
} from "@repo/services";
import { queryKeys } from "@repo/utils/query-keys";
import { HomePage } from "../../../components/homepage";
import {
  categoryProjectsQuery,
  categorySkillsQuery,
  projectsQuery,
  skillsQuery,
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
      .catch(() => { }),
    queryClient
      .query({
        queryKey: queryKeys.whatCanDo.publicList(whatCanDoQuery),
        queryFn: () => whatCanDoService.findAllPublic(whatCanDoQuery),
      })
      .catch(() => { }),
    queryClient
      .query({
        queryKey: queryKeys.skills.publicList(skillsQuery),
        queryFn: () => skillsService.findAllPublic(skillsQuery),
      })
      .catch(() => { }),
    queryClient
      .query({
        queryKey: queryKeys.categorySkills.publicList(categorySkillsQuery),
        queryFn: () => categorySkillsService.findAllPublic(categorySkillsQuery),
      })
      .catch(() => { }),
    queryClient
      .query({
        queryKey: queryKeys.userCompany.publicList(userCompanyQuery),
        queryFn: () => userCompanyService.findAllPublic(userCompanyQuery),
      })
      .catch(() => { }),
    queryClient
      .query({
        queryKey: queryKeys.categoryProjects.publicList(categoryProjectsQuery),
        queryFn: () =>
          categoryProjectsService.findAllPublic(categoryProjectsQuery),
      })
      .catch(() => { }),
    queryClient
      .query({
        queryKey: queryKeys.projects.publicList(projectsQuery),
        queryFn: () => projectsService.findAllPublic(projectsQuery),
      })
      .catch(() => { }),
  ]);

  return (
    <Suspense fallback={<HomePageSkeleton />}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <HomePage />
      </HydrationBoundary>
    </Suspense>
  );
}
