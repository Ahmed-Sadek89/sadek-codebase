import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { dehydrate, getQueryClient, HydrationBoundary } from "@repo/libs/query";
import { projectsService } from "@repo/services/projects";
import { queryKeys } from "@repo/utils/query-keys";
import { auth } from "../../../../../../../libs/auth";
import ProjectFormPage from "../../../../../../../components/project-form";
import { isNotFoundError } from "../../../../../../../utils/api-errors";
import { ProjectFormSkeleton } from "../../../../../../../components/ui/skeleton/project-form-skeleton";

/** "create" → null (new project); a positive integer → that id; anything else → undefined (404). */
function parseSlug(slug: string): number | null | undefined {
  if (slug === "create") return null;
  if (!/^\d+$/.test(slug)) return undefined;
  const id = Number(slug);
  return Number.isSafeInteger(id) && id > 0 ? id : undefined;
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/dashboard/projects/form/[slug]">): Promise<Metadata> {
  const t = await getTranslations();
  const isCreate = parseSlug((await params).slug) === null;
  return {
    title: isCreate ? t("projectFormTitle") : t("projectFormEditTitle"),
    description: isCreate
      ? t("projectFormDescription")
      : t("projectFormEditDescription"),
  };
}

export default async function Page({
  params,
}: PageProps<"/[locale]/dashboard/projects/form/[slug]">) {
  const projectId = parseSlug((await params).slug);
  if (projectId === undefined) notFound();

  const queryClient = getQueryClient();
  const accessToken = (await auth())?.accessToken;

  if (projectId !== null && accessToken) {
    try {
      await queryClient.query({
        queryKey: queryKeys.projects.detail(projectId),
        queryFn: () => projectsService.findOne(projectId, { accessToken }),
      });
    } catch (error) {
      if (isNotFoundError(error)) notFound();
    }
  }

  return (
    <Suspense fallback={<ProjectFormSkeleton />}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ProjectFormPage projectId={projectId} />
      </HydrationBoundary>
    </Suspense>
  );
}
