import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { dehydrate, getQueryClient, HydrationBoundary } from "@repo/libs/query";
import { instructorExperienceService } from "@repo/services/instructor-experience";
import { queryKeys } from "@repo/utils/query-keys";
import { auth } from "../../../../../../../libs/auth";
import InstructorExperienceViewPage from "../../../../../../../components/instructor-experience-view";
import { ProjectFormSkeleton } from "../../../../../../../components/ui/skeleton/project-form-skeleton";
import { isNotFoundError } from "../../../../../../../utils/api-errors";

/** A positive integer id, or undefined (404). */
function parseId(value: string): number | undefined {
  if (!/^\d+$/.test(value)) return undefined;
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : undefined;
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  return {
    title: t("instructorExperienceViewTitle"),
    description: t("instructorExperienceViewDescription"),
  };
}

export default async function Page({
  params,
}: PageProps<"/[locale]/dashboard/instructor-experience/view/[id]">) {
  const id = parseId((await params).id);
  if (id === undefined) notFound();

  const queryClient = getQueryClient();
  const accessToken = (await auth())?.accessToken;

  if (accessToken) {
    try {
      await queryClient.query({
        queryKey: queryKeys.instructorExperience.detail(id),
        queryFn: () => instructorExperienceService.findOne(id, { accessToken }),
      });
    } catch (error) {
      // Missing, or another user's row (the backend answers 404 for both).
      if (isNotFoundError(error)) notFound();
      // Other failures aren't dehydrated; the client fetches again and shows its error state.
    }
  }

  return (
    <Suspense fallback={<ProjectFormSkeleton />}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <InstructorExperienceViewPage id={id} />
      </HydrationBoundary>
    </Suspense>
  );
}
