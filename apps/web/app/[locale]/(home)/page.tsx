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
} from "../../../libs/seo/user-info";
import { getHomeSeo, seoToMetadata } from "../../../libs/seo/seo";
import { defaultLanguageAlternates, localeUrl } from "../../../libs/seo/site";
import { HomeJsonLd } from "../../../components/seo/home-json-ld";
import { Suspense } from "react";
import { HomePageSkeleton } from "../../../components/loading";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  const [seo, userInfo] = await Promise.all([
    getHomeSeo(locale),
    getUserInfoMetadata(locale),
  ]);
  // The SEO row (managed in the dashboard) wins; the user info fills the
  // gaps (authors) and is the whole fallback when there is no active row.
  if (seo) return { ...userInfo, ...seoToMetadata(seo, locale) };
  return {
    ...userInfo,
    alternates: {
      canonical: localeUrl(locale),
      languages: defaultLanguageAlternates(),
    },
  };
}

export default async function Page({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
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
    <>
      <HomeJsonLd locale={locale} />
      <Suspense fallback={<HomePageSkeleton />}>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <HomePage />
        </HydrationBoundary>
      </Suspense>
    </>
  );
}
