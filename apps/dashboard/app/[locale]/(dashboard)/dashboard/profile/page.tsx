import { Suspense } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { dehydrate, getQueryClient, HydrationBoundary } from "@repo/libs/query";
import { authService } from "@repo/services/auth";
import { queryKeys } from "@repo/utils/query-keys";
import { auth } from "../../../../../libs/auth";
import ProfilePage from "../../../../../components/profile";
import { ProfileSkeleton } from "../../../../../components/ui/skeleton/profile-skeleton";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  return {
    title: t("metaProfileTitle"),
    description: t("metaProfileDescription"),
  };
}

export default async function Page() {
  const queryClient = getQueryClient();
  const accessToken = (await auth())?.accessToken;

  if (accessToken) {
    // A failure is not dehydrated, so the client hook fetches again and shows
    // the error state.
    await queryClient
      .query({
        queryKey: queryKeys.auth.me(),
        queryFn: () => authService.me({ accessToken }),
      })
      .catch(() => undefined);
  }

  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ProfilePage />
      </HydrationBoundary>
    </Suspense>
  );
}
