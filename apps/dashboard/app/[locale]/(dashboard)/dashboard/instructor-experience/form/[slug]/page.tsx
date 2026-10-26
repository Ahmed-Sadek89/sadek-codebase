import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { dehydrate, getQueryClient, HydrationBoundary } from "@repo/libs/query";
import { instructorExperienceService } from "@repo/services/instructor-experience";
import { queryKeys } from "@repo/utils/query-keys";
import { auth } from "../../../../../../../libs/auth";
import InstructorExperienceFormPage from "../../../../../../../components/instructor-experience-form";
import { isNotFoundError } from "../../../../../../../utils/api-errors";
import { ProjectFormSkeleton } from "../../../../../../../components/ui/skeleton/project-form-skeleton";

/** "create" → null (new row); a positive integer → that id; anything else → undefined (404). */
function parseSlug(slug: string): number | null | undefined {
  if (slug === "create") return null;
  if (!/^\d+$/.test(slug)) return undefined;
  const id = Number(slug);
  return Number.isSafeInteger(id) && id > 0 ? id : undefined;
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/dashboard/instructor-experience/form/[slug]">): Promise<Metadata> {
  const t = await getTranslations();
  const isCreate = parseSlug((await params).slug) === null;
  return {
    title: isCreate
      ? t("instructorExperienceFormTitle")
      : t("instructorExperienceFormEditTitle"),
    description: isCreate
      ? t("instructorExperienceFormDescription")
      : t("instructorExperienceFormEditDescription"),
  };
}

export default async function Page({
  params,
}: PageProps<"/[locale]/dashboard/instructor-experience/form/[slug]">) {
  const id = parseSlug((await params).slug);
  if (id === undefined) notFound();

  const queryClient = getQueryClient();
  const accessToken = (await auth())?.accessToken;

  if (id !== null && accessToken) {
    try {
      await queryClient.query({
        queryKey: queryKeys.instructorExperience.detail(id),
        queryFn: () => instructorExperienceService.findOne(id, { accessToken }),
      });
    } catch (error) {
      // Missing, or another user's row (the backend answers 404 for both).
      if (isNotFoundError(error)) notFound();
    }
  }

  return (
    <Suspense fallback={<ProjectFormSkeleton />}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <InstructorExperienceFormPage id={id} />
      </HydrationBoundary>
    </Suspense>
  );
}
