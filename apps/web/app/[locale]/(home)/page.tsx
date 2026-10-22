import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { dehydrate, getQueryClient, HydrationBoundary } from "@repo/libs/query";
import { categoryProjectsService } from "@repo/services/category-projects";
import { categorySkillsService } from "@repo/services/category-skills";
import { projectsService } from "@repo/services/projects";
import { skillsService } from "@repo/services/skills";
import { userCompanyService } from "@repo/services/user-company";
import { whatCanDoService } from "@repo/services/what-can-do";
import { queryKeys } from "@repo/utils/query-keys";
import { HomePage } from "../../../components/homepage";
import {
  categoryProjectsQuery,
  categorySkillsQuery,
  projectsQuery,
  skillsQuery,
  userCompanyQuery,
  userInfoQuery,
  whatCanDoQuery,
} from "../../../components/homepage/utils";
import { Footer } from "../../../components/layout/footer/index";
import { Header } from "../../../components/layout/header/index";
import {
  getPublicUserInfos,
  getUserInfoMetadata,
} from "../../../utils/user-info";

// Title and description come from the default-view user's info.
export async function generateMetadata({
  params,
}: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  return (await getUserInfoMetadata(locale)) ?? {};
}

export default async function Page() {
  // No default-view user means there is no portfolio to show. loading.tsx has
  // already started the stream, so this renders not-found.tsx with a 200 and
  // a `noindex` tag. A failed request is not a 404: the sections retry on the client.
  const userInfos = await getPublicUserInfos().catch(() => null);
  if (userInfos?.data.length === 0) notFound();

  const queryClient = getQueryClient();

  // Same keys and queries as the section hooks, so they hydrate without refetching.
  // Errors are swallowed: if the backend is down, the sections fetch on the client.
  await Promise.all([
    queryClient
      .query({
        queryKey: queryKeys.userInfo.publicList(userInfoQuery),
        queryFn: getPublicUserInfos,
      })
      .catch(() => {}),
    queryClient
      .query({
        queryKey: queryKeys.whatCanDo.publicList(whatCanDoQuery),
        queryFn: () => whatCanDoService.findAllPublic(whatCanDoQuery),
      })
      .catch(() => {}),
    queryClient
      .query({
        queryKey: queryKeys.skills.publicList(skillsQuery),
        queryFn: () => skillsService.findAllPublic(skillsQuery),
      })
      .catch(() => {}),
    queryClient
      .query({
        queryKey: queryKeys.categorySkills.publicList(categorySkillsQuery),
        queryFn: () => categorySkillsService.findAllPublic(categorySkillsQuery),
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
    <>
      <Header />
      <main>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <HomePage />
        </HydrationBoundary>
      </main>
      <Footer />
    </>
  );
}
